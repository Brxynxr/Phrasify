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
        
    # 2. Prompt refinado que aprovecha las 3 citas pero ancla la cita literal en el párrafo 2
    prompt = f"""
Escribe una reflexión filosófica de exactamente dos párrafos en español respondiendo a la idea: "{pregunta}"

Sustento documental disponible:
{citas_contexto}
Estructura de dos párrafos (escribe el texto de corrido, sin títulos):
- Primer párrafo: Desarrolla una reflexión directa y profunda sobre el dilema, comenzando con una afirmación fuerte. Puedes apoyarte en las ideas de cualquiera de los autores de las fuentes, pero sin citar textualmente.
- Segundo párrafo: Escribe literalmente: Como dijo {cita_autor}, "{cita_texto}". Luego explica en español cómo esta frase da sentido y cierre a tu argumento.

Reglas:
- Copia "{cita_texto}" exacta, en inglés, entre comillas en el segundo párrafo.
- NO agregues preámbulos, títulos ni etiquetas de sección.
- Ve directo al grano desde la primera oración.
"""

    # 3. Consumo de Ollama usando el cliente HTTP global reutilizable
    if proveedor == "ollama":
        url_ollama = os.environ.get("OLLAMA_API_URL", "http://127.0.0.1:11434").rstrip("/")
        endpoint = f"{url_ollama}/api/generate"
        modelo = os.environ.get("OLLAMA_MODEL", "qwen2.5:7b")
        
        payload = {
            "model": modelo,
            "prompt": prompt,
            "stream": False,
            "options": {
                "temperature": 0.3,
                "repeat_penalty": 1.2,
                "presence_penalty": 0.6,
                "frequency_penalty": 0.6,
                "num_predict": 300,
                "stop": ["\n\n\n", "["]
            }
        }
        
        print(f"Generador IA: Realizando consulta a Ollama (Modelo: {modelo})...")
        
        try:
            respuesta = await cliente_http_global.post(endpoint, json=payload, timeout=180.0)
            respuesta.raise_for_status()
            datos_respuesta = respuesta.json()
            return datos_respuesta.get("response", "").strip()
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
