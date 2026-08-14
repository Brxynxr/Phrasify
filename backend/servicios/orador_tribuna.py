import unicodedata
from servicios.recuperador_contexto import recuperar_citas_candidatas
from servicios.generador_ia import generar_ensayo_ia

# Caché simple en memoria: { pregunta_normalizada -> resultado_debate }
_cache_debates: dict = {}

def _normalizar_pregunta(pregunta: str) -> str:
    """
    Normaliza la pregunta para usarla como clave de caché:
    minúsculas, sin tildes, sin espacios extra.
    """
    nfkd = unicodedata.normalize("NFKD", pregunta.strip().lower())
    return "".join(c for c in nfkd if not unicodedata.combining(c))

async def generar_debate_respaldado(pregunta: str, umbral: float = 0.42) -> dict:
    """
    Orquesta la lógica del Módulo 2: Tribuna.
    
    1. Verifica el caché en memoria antes de llamar al LLM.
    2. Recupera las 3 citas candidatas semánticamente más cercanas.
    3. Aplica el filtro de umbral mínimo de similitud coseno.
    4. Si ninguna supera el umbral, devuelve fallback anti-alucinación.
    5. Si hay citas válidas, genera el ensayo con el LLM y lo guarda en caché.
    
    Parámetros:
        pregunta (str): Pregunta planteada por el usuario.
        umbral (float): Similitud mínima requerida (0.0-1.0). Por defecto: 0.42.
        
    Retorna:
        dict: Estructura de debate con 'suficientes_fuentes', 'ensayo' y 'citas_utilizadas'.
    """
    # 1. Revisar caché (clave: pregunta_normalizada + umbral)
    clave_cache = f"{_normalizar_pregunta(pregunta)}|{umbral}"
    if clave_cache in _cache_debates:
        print(f"Orador Tribuna: Respuesta recuperada del caché para: '{pregunta}'")
        return _cache_debates[clave_cache]
    
    # 2. Recuperar las 3 citas candidatas más afines
    citas_candidatas = recuperar_citas_candidatas(pregunta, limite=3)
    
    # 3. Filtrar por umbral mínimo de similitud (anti-alucinaciones)
    citas_validas = [c for c in citas_candidatas if c["similitud"] >= umbral]
    
    print(f"Orador Tribuna: Encontradas {len(citas_validas)} citas que superan el umbral ({umbral}) de un total de {len(citas_candidatas)} candidatas.")
    
    # 4. Fallback si no hay fuentes suficientes (cumple el Reto 2)
    if not citas_validas:
        mensaje_fallback = (
            "No encontré en mi base de citas ninguna fuente con relación directa a esta pregunta, "
            "así que no puedo argumentar con respaldo real."
        )
        resultado = {
            "suficientes_fuentes": False,
            "ensayo": mensaje_fallback,
            "citas_utilizadas": []  # No mostramos citas por debajo del umbral
        }
        _cache_debates[clave_cache] = resultado
        return resultado
    
    # 5. Generar el ensayo con el LLM usando las citas válidas
    print(f"Orador Tribuna: Procediendo con {len(citas_validas)} fuentes válidas para redactar el ensayo con IA.")
    try:
        ensayo_generado = await generar_ensayo_ia(pregunta, citas_validas)
        resultado = {
            "suficientes_fuentes": True,
            "ensayo": ensayo_generado,
            "citas_utilizadas": citas_validas
        }
    except Exception as e:
        print(f"Orador Tribuna: Error durante la generación con IA: {e}")
        error_fallback = (
            f"No se pudo generar el ensayo argumentativo debido a un problema con el servicio de IA ({str(e)}). "
            "No obstante, a continuación se muestran las fuentes reales encontradas en nuestro dataset maestro."
        )
        resultado = {
            "suficientes_fuentes": True,
            "ensayo": error_fallback,
            "citas_utilizadas": citas_validas
        }
    
    # 6. Guardar en caché y retornar
    _cache_debates[clave_cache] = resultado
    return resultado
