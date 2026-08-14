import os
from servicios.recuperador_contexto import recuperar_citas_candidatas
from servicios.generador_ia import generar_ensayo_ia

# Umbral de relevancia por defecto para similitud coseno
UMBRAL_RELEVANCIA_DEFECTO = 0.42

async def generar_debate_respaldado(pregunta: str, umbral: float = UMBRAL_RELEVANCIA_DEFECTO):
    """
    Orquesta la lógica del Módulo 2: Tribuna.
    1. Recupera las citas candidatas usando el motor semántico de búsqueda.
    2. Aplica un filtro de umbral mínimo de similitud.
    3. Si no hay citas relevantes, activa la respuesta de fallback para evitar alucinaciones.
    4. Si hay citas relevantes, genera el ensayo argumentativo respaldado usando la IA.
    
    Parámetros:
        pregunta (str): Pregunta planteada por el usuario.
        umbral (float): Nivel mínimo de similitud coseno requerido.
        
    Retorna:
        dict: Estructura de debate que contiene:
              - 'suficientes_fuentes' (bool): Si existen datos válidos para argumentar.
              - 'ensayo' (str): El mini-ensayo generado o el mensaje de error/fallback.
              - 'citas_utilizadas' (list): Lista de citas que superaron el umbral y sirvieron de base.
    """
    # 1. Recuperar citas candidatas usando el motor semántico (recupera 5 candidatas)
    citas_candidatas = recuperar_citas_candidatas(pregunta, limite=5)
    
    # 2. Filtrar las citas que superen el umbral mínimo de relevancia
    citas_relevantes = [
        cita for cita in citas_candidatas 
        if cita["similitud"] >= umbral
    ]
    
    print(f"Orador Tribuna: Encontradas {len(citas_relevantes)} citas que superan el umbral ({umbral}) de un total de {len(citas_candidatas)} candidatas.")
    
    # 3. Lógica de fallback si no hay suficientes fuentes
    if not citas_relevantes:
        mensaje_fallback = (
            "No tengo fuentes suficientes en mi dataset maestro para debatir este tema de forma respaldada. "
            "Para evitar alucinaciones, prefiero abstenerme de argumentar."
        )
        print("Orador Tribuna: Activando fallback de escasez de fuentes.")
        return {
            "suficientes_fuentes": False,
            "ensayo": mensaje_fallback,
            "citas_utilizadas": []
        }
        
    # 4. Caso exitoso: hay fuentes. Procedemos a generar el ensayo con la IA.
    print(f"Orador Tribuna: Procediendo con {len(citas_relevantes)} fuentes válidas para redactar el ensayo con IA.")
    try:
        ensayo_generado = await generar_ensayo_ia(pregunta, citas_relevantes)
        return {
            "suficientes_fuentes": True,
            "ensayo": ensayo_generado,
            "citas_utilizadas": citas_relevantes
        }
    except Exception as e:
        print(f"Orador Tribuna: Error durante la generación del ensayo con IA: {e}")
        # En caso de error técnico de la API de IA (ej: falta de llave en .env), retornamos un mensaje amistoso
        # y adjuntamos las fuentes recuperadas para que el usuario las consulte directamente
        error_fallback = (
            f"No se pudo generar el ensayo argumentativo debido a un problema con el servicio de IA ({str(e)}). "
            "No obstante, a continuación se muestran las fuentes reales encontradas en nuestro dataset maestro."
        )
        return {
            "suficientes_fuentes": True,
            "ensayo": error_fallback,
            "citas_utilizadas": citas_relevantes
        }

if __name__ == "__main__":
    import sys
    import asyncio
    
    # Agregar la ruta del backend en el path para testing independiente
    sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
    from cargador_datos import cargar_dataset_maestro
    
    async def prueba_principal():
        print("Prueba independiente del Orador de Tribuna con Mock de IA...")
        cargar_dataset_maestro()
        
        # Test de fallback
        res_fallback = await generar_debate_respaldado("¿Cómo se programa una API en Rust?")
        print(f"\nCaso Fallback:\n¿Suficientes fuentes?: {res_fallback['suficientes_fuentes']}\nEnsayo: {res_fallback['ensayo']}")
        
        # Test de éxito
        res_exito = await generar_debate_respaldado("Háblame sobre la perseverancia ante el fracaso")
        print(f"\nCaso Éxito (Sin .env de IA configurado, retornará error controlado):\n¿Suficientes fuentes?: {res_exito['suficientes_fuentes']}\nEnsayo: {res_exito['ensayo']}")

    asyncio.run(prueba_principal())
