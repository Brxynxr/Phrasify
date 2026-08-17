import os
import re
from servicios.cliente_http import cliente_http_global

def cargar_variables_entorno():
    """
    Carga de forma manual las variables del archivo .env localizado en la raíz
    del backend, evitando la dependencia de librerías externas.
    También limpia comillas y comentarios finales de los valores.
    """
    directorio_backend = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    ruta_env = os.path.join(directorio_backend, ".env")
    
    if os.path.exists(ruta_env):
        with open(ruta_env, "r", encoding="utf-8") as f:
            for linea in f:
                linea = linea.strip()
                if linea and not linea.startswith("#") and "=" in linea:
                    clave, valor = linea.split("=", 1)
                    clave = clave.strip()
                    # Limpiar comillas simples y dobles, y comentarios finales (# ...) del valor
                    valor = valor.strip().strip('"').strip("'")
                    # Remover comentario final que venga después de # dentro del valor
                    if "#" in valor:
                        valor = valor[:valor.index("#")].strip()
                    os.environ[clave] = valor

# Cargar variables al importar el módulo
cargar_variables_entorno()

def limpiar_ensayo_ia(texto: str) -> str:
    """
    Limpia el texto del ensayo de forma defensiva para eliminar cualquier
    etiqueta de estructura, títulos o notas aclaratorias coladas por el LLM.
    Preserva y garantiza que se devuelvan exactamente dos párrafos.
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

    # 4. Asegurar exactamente 2 párrafos
    texto_normalizado = re.sub(r'\n{3,}', '\n\n', texto_filtrado)
    parrafos = [p.strip() for p in texto_normalizado.split('\n\n') if p.strip()]
    
    if len(parrafos) > 2:
        parrafo_1 = parrafos[0]
        parrafo_2 = " ".join(parrafos[1:])
        return f"{parrafo_1}\n\n{parrafo_2}"
    elif len(parrafos) == 1:
        mitad = len(parrafos[0]) // 2
        punto = parrafos[0].find(".", mitad)
        if punto != -1:
            parrafo_1 = parrafos[0][:punto+1].strip()
            parrafo_2 = parrafos[0][punto+1:].strip()
            return f"{parrafo_1}\n\n{parrafo_2}"
        
    return "\n\n".join(parrafos)

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
    proveedor = os.environ.get("PROVEEDOR_IA", "ollama").lower()

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
Escribe un mini-ensayo filosófico en español sobre el dilema planteado por el usuario.
Pregunta del usuario: "{pregunta}"

REGLAS OBLIGATORIAS DE ESTRUCTURA Y FORMATO:
1. El ensayo debe constar de exactamente DOS párrafos, separados únicamente por una línea en blanco. No generes más de dos párrafos bajo ninguna circunstancia.
2. Ambos párrafos deben mantener un tono profundamente filosófico, reflexivo, existencial y analítico de alta calidad literaria.
3. En el PÁRRAFO 1, plantea tu reflexión e integra de forma narrativa y fluida la esencia de la siguiente cita de soporte (en español, como texto plano, sin usar comillas dobles en ella). No escribas la cita en inglés ni uses comillas dobles en absoluto dentro de la redacción.
   * Cita de soporte: "{cita_limpia}"
   * Autor de la cita: {cita_autor}
   Ejemplo de integración fluida: Al examinar esta cuestión, la visión de {cita_autor} acerca de que el conocimiento tiene límites y debe ser complementado por el pensamiento creativo nos invita a considerar...
4. En el PÁRRAFO 2, continúa la corriente de pensamiento de forma orgánica y fluida, ofreciendo un cierre reflexivo. Está estrictamente prohibido iniciar el párrafo con conectores de conclusión predecibles como "En conclusión,", "En resumen,", "Por lo tanto,", "Finalmente,", "En síntesis,", o "Como conclusión,".
5. No devuelvas títulos, subtítulos, etiquetas (como "Párrafo 1:", "Ensayo:"), comillas externas, notas explicativas ni comentarios al final. Devuelve solo los dos párrafos de texto plano.

ENSAYO:"""

    # 4. Consumo de APIs según el proveedor
    if proveedor == "ollama":
        url_ollama = os.environ.get("OLLAMA_API_URL", "http://127.0.0.1:11434").rstrip("/")
        endpoint = f"{url_ollama}/api/generate"
        modelo = os.environ.get("OLLAMA_MODEL", "qwen2.5:3b")
        
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
            
    else:
        # WARNING: Gemini provider is deprecated and inactive. 
        # The system defaults to the local Ollama API (http://localhost:11434/api/generate).
        # To use Gemini, re-enable the provider and configure GEMINI_API_KEY in your .env.
        raise RuntimeError("El proveedor de IA Gemini está inactivo/desactivado. El sistema usa Ollama por defecto. "
                          "Configura PROVEEDOR_IA=gemini y GEMINI_API_KEY si necesitas usar Gemini.")
