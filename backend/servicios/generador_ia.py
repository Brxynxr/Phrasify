import os
import re
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

def limpiar_ensayo_ia(texto: str) -> str:
    """
    Limpia el texto del ensayo de forma defensiva para eliminar cualquier
    etiqueta de estructura, títulos o notas aclaratorias coladas por el LLM.
    Preserva la separación de dos párrafos.
    """
    if not texto:
        return ""
    
    # 1. Filtrar líneas de cabecera que no aportan al ensayo (títulos, preámbulos, etiquetas)
    lineas = texto.splitlines()
    lineas_filtradas = []
    ignorar_cabecera = True
    
    for linea in lineas:
        linea_strip = linea.strip()
        if ignorar_cabecera:
            lower = linea_strip.lower()
            if (not linea_strip or 
                linea_strip.startswith("#") or 
                linea_strip.startswith("---") or
                lower.startswith("ensayo") or
                lower.startswith("respuesta") or
                lower.startswith("pregunta") or
                lower.startswith("aquí tienes") or
                lower.startswith("a continuación") or
                lower.startswith("párrafo") or
                lower.startswith("parrafo") or
                lower.startswith("paragraph")):
                continue
            else:
                ignorar_cabecera = False # Primer párrafo real
        
        lineas_filtradas.append(linea)

    texto_filtrado = "\n".join(lineas_filtradas).strip()

    # 2. Eliminar etiquetas de sección en línea (ej. "Párrafo 1:", "**Párrafo 2**:")
    texto_filtrado = re.sub(
        r'(?i)\b(párrafo|parrafo|paragraph)\s*\d+[\s*:\-*_]*', 
        '', 
        texto_filtrado
    )
    
    # 3. Recortar cualquier nota explicativa al final (ej: "Nota: el ensayo...")
    partes_nota = re.split(
        r'(?i)\n\s*(nota|explicación|explicacion|comentario)\s*:', 
        texto_filtrado
    )
    if len(partes_nota) > 1:
        texto_filtrado = partes_nota[0].strip()

    return texto_filtrado.strip()

async def generar_ensayo_ia(pregunta: str, citas_relevantes: list) -> str:
    """
    Genera un mini-ensayo argumentativo utilizando el LLM configurado (Ollama/Gemini).
    Usa las citas recuperadas en el prompt para un argumento más rico y diverso.
    
    Parámetros:
        pregunta (str): La consulta o tesis planteada por el usuario.
        citas_relevantes (list): Citas reales del dataset que superaron el umbral.
        
    Retorna:
        str: El texto del mini-ensayo generado.
    """
    proveedor = os.environ.get("PROVEEDOR_IA", "gemini").lower()

    # 1. Obtener los detalles de la cita más relevante (anclaje para el segundo párrafo)
    primera_cita = citas_relevantes[0]
    cita_texto = primera_cita["frase"]
    cita_autor = primera_cita["autor"]
    cita_limpia = cita_texto.rstrip(".")
        
    # 2. Formatear las citas de apoyo para contextualizar la postura
    otras_citas_txt = ""
    for c in citas_relevantes[1:]:
        otras_citas_txt += f'  • {c["autor"]}: "{c["frase"]}"\n'

    # 3. Prompt unificado estructurado para evitar alucinaciones y metadata
    prompt_completo = f"""[INSTRUCCIONES DE REDACCIÓN]
Escribe un mini-ensayo filosófico en español de exactamente DOS párrafos respondiendo a esta pregunta: "{pregunta}"

REGLAS DE ESTRUCTURA:
- Párrafo 1: Comienza directamente con tu postura o afirmación principal sobre el tema (sin introducciones ni frases de relleno). Escribe de 3 a 4 oraciones de análisis en tercera persona. Puedes parafrasear ideas de las FUENTES DISPONIBLES si lo deseas, pero no las cites textualmente aquí.
- Párrafo 2: Integra la siguiente cita de respaldo exactamente como está escrita, de forma fluida y como parte de tus oraciones. Escribe luego una oración de cierre.
  * Cita (inglés): "{cita_limpia}"
  * Autor: {cita_autor}
  Ejemplo de integración fluida: "Esta postura coincide con la visión de {cita_autor} al sugerir que '{cita_limpia}', lo que demuestra que el desarrollo humano requiere de bases sólidas."

FUENTES DISPONIBLES:
{otras_citas_txt.strip()}

REGLAS DE FORMATO:
- Devuelve únicamente los dos párrafos del ensayo, separados por una línea en blanco.
- No incluyas títulos, subtítulos, etiquetas (como "Párrafo 1" o "Ensayo:") ni porcentajes.
- No agregues notas aclaratorias ni explicaciones del texto generado.
- Mantén la cita de respaldo en inglés.

ENSAYO:"""

    # 4. Consumo de APIs según el proveedor
    if proveedor == "ollama":
        url_ollama = os.environ.get("OLLAMA_API_URL", "http://127.0.0.1:11434").rstrip("/")
        endpoint = f"{url_ollama}/api/generate"
        modelo = os.environ.get("OLLAMA_MODEL", "qwen2.5:7b-instruct")
        
        payload = {
            "model": modelo,
            "prompt": prompt_completo,
            "stream": False,
            "options": {
                "temperature": 0.45,
                "repeat_penalty": 1.3,
                "repeat_last_n": 128,
                "num_predict": 300,
                "num_thread": 12,
                "stop": ["\n\n\n", "PREGUNTA:", "FUENTES DISPONIBLES:", "ENSAYO:"]
            }
        }
        
        print(f"Generador IA: Consultando Ollama ({modelo}, 12 threads)...")
        
        try:
            respuesta = await cliente_http_global.post(endpoint, json=payload, timeout=180.0)
            respuesta.raise_for_status()
            texto = respuesta.json().get("response", "").strip()
            return limpiar_ensayo_ia(texto)
        except Exception as e:
            raise RuntimeError(f"Error al conectar con la API local de Ollama: {e}")
            
    else:  # Gemini
        api_key = os.environ.get("GEMINI_API_KEY", "")
        if not api_key:
            raise ValueError(
                "La clave de API de Gemini (GEMINI_API_KEY) no está configurada en tu archivo .env. "
                "Crea el archivo backend/.env e introduce tu clave: GEMINI_API_KEY=tu_clave_aqui"
            )
        endpoint = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key={api_key}"
        payload = {
            "contents": [{"parts": [{"text": prompt_completo}]}]
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
                    texto = partes[0].get("text", "").strip()
                    return limpiar_ensayo_ia(texto)
            raise ValueError("La API de Gemini devolvió una respuesta vacía o con formato inesperado.")
        except Exception as e:
            raise RuntimeError(f"Error al conectar con la API de Gemini de Google: {e}")
