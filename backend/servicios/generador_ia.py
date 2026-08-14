import os
import httpx

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
                # Omitir líneas vacías y comentarios
                if linea and not linea.startswith("#") and "=" in linea:
                    clave, valor = linea.split("=", 1)
                    os.environ[clave.strip()] = valor.strip()

# Cargar variables al importar el módulo
cargar_variables_entorno()

async def generar_ensayo_ia(pregunta: str, citas_relevantes: list) -> str:
    """
    Genera un mini-ensayo argumentativo utilizando el LLM configurado (Gemini u Ollama).
    Fuerza al modelo a usar y citar textualmente las citas reales del dataset maestro.
    
    Parámetros:
        pregunta (str): La consulta o tesis planteada por el usuario.
        citas_relevantes (list): Citas reales del dataset que superaron el umbral.
        
    Retorna:
        str: El texto del mini-ensayo generado.
    """
    proveedor = os.environ.get("PROVEEDOR_IA", "gemini").lower()
    
    # 1. Obtener la cita más relevante e inyectar sus metadatos (tags) como heurística
    primera_cita = citas_relevantes[0]
    cita_texto = primera_cita["frase"]
    cita_autor = primera_cita["autor"]
    cita_tags = ", ".join(primera_cita["tags"])
        
    # 2. Construir el nuevo prompt refinado y directo para debates filosóficos
    prompt = f"""
Escribe una reflexión filosófica de exactamente dos párrafos en español respondiendo a la idea: "{pregunta}"

Sustento documental (Obligatorio):
- Cita: "{cita_texto}"
- Autor: {cita_autor}

Estructura de dos párrafos (Escribe el texto de corrido, sin títulos ni etiquetas como "Párrafo 1"):
- Primer párrafo: Desarrolla una reflexión directa en español sobre el dilema, comenzando con una afirmación fuerte y conectores fluidos.
- Segundo párrafo: Escribe textualmente: Como dijo {cita_autor}, "{cita_texto}". Y explica a continuación en español cómo esta frase da sentido a tu argumento.

Reglas clave:
- Copia la cita "{cita_texto}" exacta en inglés, entre comillas.
- NO agregues preámbulos ni introducciones como "En este ensayo voy a hablar". Ve directo al grano.
- NO agregues nombres de sección o títulos. Escribe solo los párrafos.
"""

    # 3. Consumo de APIs según el proveedor configurado
    if proveedor == "ollama":
        url_ollama = os.environ.get("OLLAMA_API_URL", "http://127.0.0.1:11434").rstrip("/")
        endpoint = f"{url_ollama}/api/generate"
        modelo = os.environ.get("OLLAMA_MODEL", "llama3")
        
        payload = {
            "model": modelo,
            "prompt": prompt,
            "stream": False,
            "options": {
                "temperature": 0.2,
                "repeat_penalty": 1.3,
                "presence_penalty": 0.8,
                "frequency_penalty": 0.8,
                "num_predict": 250,
                "stop": ["\n\n\n", "["]
            }
        }
        
        print(f"Generador IA: Realizando consulta a Ollama (Modelo: {modelo})...")
        
        async with httpx.AsyncClient() as cliente:
            try:
                respuesta = await cliente.post(endpoint, json=payload, timeout=120.0)
                respuesta.raise_for_status()
                datos_respuesta = respuesta.json()
                return datos_respuesta.get("response", "").strip()
            except Exception as e:
                raise RuntimeError(f"Error al conectar con la API local de Ollama: {e}")
                
    else:  # Por defecto usar Gemini
        api_key = os.environ.get("GEMINI_API_KEY", "")
        if not api_key:
            raise ValueError(
                "La clave de API de Gemini (GEMINI_API_KEY) no está configurada en tu archivo .env. "
                "Crea el archivo backend/.env e introduce tu clave: GEMINI_API_KEY=tu_clave_aqui"
            )
            
        endpoint = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={api_key}"
        
        payload = {
            "contents": [{
                "parts": [{"text": prompt}]
            }]
        }
        
        print("Generador IA: Realizando consulta a la API de Gemini...")
        
        async with httpx.AsyncClient() as cliente:
            try:
                respuesta = await cliente.post(endpoint, json=payload, timeout=30.0)
                respuesta.raise_for_status()
                datos_respuesta = respuesta.json()
                # Extraer el texto generado de la respuesta estándar de la API de Gemini
                candidatos = datos_respuesta.get("candidates", [])
                if candidatos:
                    partes = candidatos[0].get("content", {}).get("parts", [])
                    if partes:
                        return partes[0].get("text", "").strip()
                raise ValueError("La API de Gemini devolvió una respuesta vacía o con formato inesperado.")
            except Exception as e:
                raise RuntimeError(f"Error al conectar con la API de Gemini de Google: {e}")
