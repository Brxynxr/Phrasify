import os
from servicios.cliente_http import cliente_http_global

def cargar_variables_entorno():
    """
    Carga de forma manual las variables del archivo .env localizado en la raíz
    del backend, evitando la dependencia de librerías externas.
    """
    directorio_backend = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    ruta_env = os.path.join(directorio_backend, ".env")
    
    if os.path.exists(ruta_env):
        with open(ruta_env, "r", encoding="utf-8") as f:
            for linea in f:
                linea = linea.strip()
                if linea and not linea.startswith("#") and "=" in linea:
                    clave, valor = linea.split("=", 1)
                    os.environ[clave.strip()] = valor.strip()

# Cargar variables al importar el módulo
cargar_variables_entorno()

async def generar_ensayo_ia(pregunta: str, citas_relevantes: list) -> str:
    """
    Genera un mini-ensayo argumentativo utilizando el LLM configurado (Ollama).
    Usa las 3 citas recuperadas en el prompt para un argumento más rico y diverso.
    
    Parámetros:
        pregunta (str): La consulta o tesis planteada por el usuario.
        citas_relevantes (list): Citas reales del dataset que superaron el umbral.
        
    Retorna:
        str: El texto del mini-ensayo generado.
    """
    proveedor = os.environ.get("PROVEEDOR_IA", "gemini").lower()

    # 1. Formatear todas las citas recuperadas como contexto documental
    citas_contexto = ""
    for idx, c in enumerate(citas_relevantes, 1):
        citas_contexto += f"  [{idx}] \"{c['frase']}\" — {c['autor']}\n"
    
    # Cita principal (la más relevante) para anclaje del segundo párrafo
    primera_cita = citas_relevantes[0]
    cita_texto = primera_cita["frase"]
    cita_autor = primera_cita["autor"]
        
    # 2. Prompt ultra-estructurado tipo plantilla para modelos pequeños (evita bucles)
    otras_ideas = ""
    for c in citas_relevantes[1:]:
        otras_ideas += f"- {c['autor']}: \"{c['frase']}\"\n"

    prompt = f"""Escribe exactamente DOS párrafos en español sobre: "{pregunta}"

PÁRRAFO 1 (reflexión directa, 3-4 oraciones, tercera persona, sin citar textualmente):
El fracaso no es el fin del camino,"""

    # 3. Consumo de Ollama usando el cliente HTTP global reutilizable
    if proveedor == "ollama":
        url_ollama = os.environ.get("OLLAMA_API_URL", "http://127.0.0.1:11434").rstrip("/")
        endpoint = f"{url_ollama}/api/generate"
        modelo = os.environ.get("OLLAMA_MODEL", "qwen2:0.5b")
        
        # Estrategia "gap-fill": pre-rellenar ambos inicios de párrafo.
        # Para modelos ≤1B, completar huecos es mucho más fiable que generar libremente.
        # El modelo SOLO tiene que extender las dos oraciones que ya iniciamos.
        prompt_completo = f"""Continúa el siguiente ensayo filosófico en español. No cambies lo que ya está escrito. Escribe solo la continuación de cada párrafo. No agregues títulos ni introducciones.

---
Pregunta: {pregunta}

Párrafo 1 — Reflexión (continúa desde aquí, 2-3 oraciones, sin usar primera persona):
El fracaso repetido no define el límite de una persona, sino"""

        # Llamamos a Ollama para obtener la continuación del párrafo 1
        payload_p1 = {
            "model": modelo,
            "prompt": prompt_completo,
            "stream": False,
            "options": {
                "temperature": 0.45,
                "repeat_penalty": 1.4,
                "repeat_last_n": 64,
                "num_predict": 110,
                "stop": ["\n\n", "Párrafo 2", "Como dijo", "---", "Pregunta:"]
            }
        }

        print(f"Generador IA: Realizando consulta a Ollama (Modelo: {modelo}) — Párrafo 1...")

        try:
            resp_p1 = await cliente_http_global.post(endpoint, json=payload_p1, timeout=180.0)
            resp_p1.raise_for_status()
            continuacion_p1 = resp_p1.json().get("response", "").strip()

            # Párrafo 2: ancla fija con la cita real, el modelo solo completa la explicación
            cita_limpia = cita_texto.rstrip(".")
            inicio_p2 = f'Como dijo {cita_autor}, "{cita_limpia}." Esta cita'
            prompt_p2 = f"""{prompt_completo} {continuacion_p1}

Párrafo 2 — Cierre con la cita (continúa desde aquí, 2-3 oraciones):
{inicio_p2}"""

            payload_p2 = {
                "model": modelo,
                "prompt": prompt_p2,
                "stream": False,
                "options": {
                    "temperature": 0.45,
                    "repeat_penalty": 1.4,
                    "repeat_last_n": 64,
                    "num_predict": 110,
                    "stop": ["\n\n", "Párrafo 3", "---", "Pregunta:"]
                }
            }

            print(f"Generador IA: Realizando consulta a Ollama (Modelo: {modelo}) — Párrafo 2...")
            resp_p2 = await cliente_http_global.post(endpoint, json=payload_p2, timeout=180.0)
            resp_p2.raise_for_status()
            continuacion_p2 = resp_p2.json().get("response", "").strip()

            # Ensamblar el ensayo final con los dos párrafos
            parrafo_1 = f"El fracaso repetido no define el límite de una persona, sino {continuacion_p1}".strip()
            parrafo_2 = f"{inicio_p2} {continuacion_p2}".strip()
            return f"{parrafo_1}\n\n{parrafo_2}"

        except Exception as e:
            raise RuntimeError(f"Error al conectar con la API local de Ollama: {e}")
            
    else:  # Gemini (para uso futuro con API Key)
        api_key = os.environ.get("GEMINI_API_KEY", "")
        if not api_key:
            raise ValueError(
                "La clave de API de Gemini (GEMINI_API_KEY) no está configurada en tu archivo .env."
            )
        endpoint = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key={api_key}"
        payload = {
            "contents": [{"parts": [{"text": prompt}]}]
        }
        print("Generador IA: Realizando consulta a la API de Gemini 2.0 Flash...")
        try:
            respuesta = await cliente_http_global.post(endpoint, json=payload, timeout=30.0)
            respuesta.raise_for_status()
            datos_respuesta = respuesta.json()
            candidatos = datos_respuesta.get("candidates", [])
            if candidatos:
                partes = candidatos[0].get("content", {}).get("parts", [])
                if partes:
                    return partes[0].get("text", "").strip()
            raise ValueError("La API de Gemini devolvió una respuesta vacía o con formato inesperado.")
        except Exception as e:
            raise RuntimeError(f"Error al conectar con la API de Gemini de Google: {e}")
