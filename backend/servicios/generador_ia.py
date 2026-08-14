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
    
    # 1. Formatear el listado de citas reales como contexto para la IA
    citas_contexto = ""
    for idx, c in enumerate(citas_relevantes, 1):
        citas_contexto += f"{idx}. \"{c['frase']}\" — Autor: {c['autor']}\n"
        
    # 2. Construir el prompt con instrucciones rígidas de estructuración y anti-alucinación
    prompt = f"""
Eres un orador y pensador filosófico riguroso. Tu tarea es redactar un breve ensayo de exactamente dos párrafos en español que aborde la siguiente pregunta:
"{pregunta}"

Para respaldar tu argumentación de forma empírica y verídica, es obligatorio que incorpores y cites textualmente al menos una (y preferiblemente más) de las siguientes citas literales de autores célebres que hemos recuperado de nuestra base de datos histórica:

{citas_contexto}

REGLAS CRÍTICAS DE OBLIGADO CUMPLIMIENTO:
1. El ensayo debe contener exactamente dos párrafos de longitud total. No agregues preámbulos, títulos, despedidas ni listas.
2. Debes citar textualmente (encerrando entre comillas la frase exacta) y atribuir explícitamente al autor correspondiente (ejemplo: Como afirma Albert Einstein, "Try not to...").
3. No inventes citas, ni autores, ni modifiques las frases provistas. Si una frase no se adapta al contexto, no la uses, pero debes usar al menos una de las provistas.
4. Redacta en un estilo persuasivo, elegante y coherente en español.
"""

    # 3. Consumo de APIs según el proveedor configurado
    if proveedor == "ollama":
        url_ollama = os.environ.get("OLLAMA_API_URL", "http://localhost:11434").rstrip("/")
        endpoint = f"{url_ollama}/api/generate"
        modelo = os.environ.get("OLLAMA_MODEL", "llama3")
        
        payload = {
            "model": modelo,
            "prompt": prompt,
            "stream": False
        }
        
        print(f"Generador IA: Realizando consulta a Ollama (Modelo: {modelo})...")
        
        async with httpx.AsyncClient() as cliente:
            try:
                respuesta = await cliente.post(endpoint, json=payload, timeout=60.0)
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
