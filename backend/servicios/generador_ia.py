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
        modelo = os.environ.get("OLLAMA_MODEL", "qwen2.5:3b")
        
        # qwen2.5:3b puede seguir instrucciones directas — un solo prompt bien estructurado es suficiente.
        # Usamos num_thread:12 para aprovechar todos los núcleos del i5-1235U (~2x de velocidad).
        cita_limpia = cita_texto.rstrip(".")
        otras_citas_txt = ""
        for c in citas_relevantes[1:]:
            otras_citas_txt += f'  • {c["autor"]}: "{c["frase"]}"\n'

        prompt_completo = f"""Eres un ensayista filosófico. Escribe EXACTAMENTE DOS párrafos en español. Nada más.

PREGUNTA: {pregunta}

FUENTES DE APOYO (para el párrafo 1, parafrasea sus ideas sin citarlas):
{otras_citas_txt.strip()}

ESTRUCTURA OBLIGATORIA:
Párrafo 1 → Reflexión filosófica directa. Empieza con una afirmación fuerte. Desarrolla el argumento con 3 oraciones. No uses primera persona. No menciones autores ni citas textuales.
Párrafo 2 → Empieza EXACTAMENTE así (copia esta frase sin cambiarla): Como dijo {cita_autor}, "{cita_limpia}." Luego explica en 2 oraciones cómo esa cita cierra el argumento.

RECUERDA: Solo DOS párrafos. Sin títulos. Sin numeración. Sin un tercer párrafo.

ENSAYO:"""

        payload = {
            "model": modelo,
            "prompt": prompt_completo,
            "stream": False,
            "options": {
                "temperature": 0.4,
                "repeat_penalty": 1.3,
                "repeat_last_n": 128,
                "num_predict": 280,
                "num_thread": 12,
                "stop": ["\n\n\n", "PREGUNTA:", "INSTRUCCIONES:", "ENSAYO:"]
            }
        }

        print(f"Generador IA: Consultando Ollama ({modelo}, 12 threads)...")

        try:
            respuesta = await cliente_http_global.post(endpoint, json=payload, timeout=180.0)
            respuesta.raise_for_status()
            texto = respuesta.json().get("response", "").strip()
            return texto
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
