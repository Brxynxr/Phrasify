import os
from servicios.recuperador_contexto import recuperar_citas_candidatas

# Umbral de relevancia por defecto para similitud coseno
UMBRAL_RELEVANCIA_DEFECTO = 0.42

def generar_debate_respaldado(pregunta: str, umbral: float = UMBRAL_RELEVANCIA_DEFECTO):
    """
    Orquesta la lógica del Módulo 2: Tribuna.
    1. Recupera las citas candidatas usando el motor semántico de búsqueda.
    2. Aplica un filtro de umbral mínimo de similitud.
    3. Si no hay citas relevantes, activa la respuesta de fallback para evitar alucinaciones.
    4. Si hay citas relevantes, prepara el contexto para ser enviado al generador IA (Fase 3).
    
    Parámetros:
        pregunta (str): Pregunta planteada por el usuario.
        umbral (float): Nivel mínimo de similitud coseno requerido.
        
    Retorna:
        dict: Estructura de debate que contiene:
              - 'suficientes_fuentes' (bool): Si existen datos válidos para argumentar.
              - 'ensayo' (str o None): El mini-ensayo generado (None en Fase 2, se implementa en Fase 3).
              - 'citas_utilizadas' (list): Lista de citas que superaron el umbral.
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
        
    # 4. Caso exitoso: hay fuentes. Retornamos los datos limpios.
    # En la siguiente Fase (Fase 3) conectaremos con el LLM para escribir el ensayo.
    print(f"Orador Tribuna: Procediendo con {len(citas_relevantes)} fuentes válidas para redactar el ensayo.")
    return {
        "suficientes_fuentes": True,
        "ensayo": None,  # Pendiente de implementar generación por IA en la Fase 3
        "citas_utilizadas": citas_relevantes
    }

if __name__ == "__main__":
    import sys
    # Agregar la ruta del backend en el path para testing independiente
    sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
    from cargador_datos import cargar_dataset_maestro
    
    print("Prueba independiente de Lógica de Umbral y Fallback:")
    cargar_dataset_maestro()
    
    # Caso 1: Pregunta ajena al dataset (debería lanzar fallback)
    pregunta_ajena = "¿Cómo puedo programar una base de datos relacional usando SQL?"
    print(f"\n--- Prueba Caso 1: '{pregunta_ajena}' ---")
    resultado_1 = generar_debate_respaldado(pregunta_ajena)
    print(f"¿Tiene suficientes fuentes?: {resultado_1['suficientes_fuentes']}")
    print(f"Ensayo/Mensaje: \"{resultado_1['ensayo']}\"")
    print(f"Citas utilizadas: {len(resultado_1['citas_utilizadas'])}")
    
    # Caso 2: Pregunta relacionada con fracaso/éxito (debería aprobar)
    pregunta_relacionada = "¿Por qué fracasar es parte del aprendizaje humano?"
    print(f"\n--- Prueba Caso 2: '{pregunta_relacionada}' ---")
    resultado_2 = generar_debate_respaldado(pregunta_relacionada)
    print(f"¿Tiene suficientes fuentes?: {resultado_2['suficientes_fuentes']}")
    print(f"Citas utilizadas: {[c['autor'] for c in resultado_2['citas_utilizadas']]}")
