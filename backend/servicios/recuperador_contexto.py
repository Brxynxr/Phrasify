from servicios.buscador_semantico import buscar_citas_por_afinidad

def recuperar_citas_candidatas(pregunta: str, limite: int = 5):
    """
    Reutiliza el motor de búsqueda semántica (Espejo) del Módulo 1 para
    recuperar las citas más relevantes que servirán como base y soporte
    para el orador argumentativo.
    
    Parámetros:
        pregunta (str): Pregunta filosófica u opinión del usuario.
        limite (int): Cantidad máxima de citas a recuperar (por defecto 5).
        
    Retorna:
        list: Lista de diccionarios de citas con sus tags y nivel de similitud.
    """
    print(f"Recuperador de Contexto: Extrayendo las {limite} citas más afines a la pregunta: '{pregunta}'")
    
    # Reutilizar el servicio del Módulo 1 cargando las citas en memoria global
    citas_recuperadas = buscar_citas_por_afinidad(consulta=pregunta, limite=limite)
    
    return citas_recuperadas

if __name__ == "__main__":
    import sys
    import os
    
    # Agregar la ruta del backend en el path en caso de ejecución independiente
    sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
    from cargador_datos import cargar_dataset_maestro
    
    print("Prueba independiente del Recuperador de Contexto:")
    cargar_dataset_maestro()
    
    pregunta_prueba = "¿Cuál es el valor del fracaso y de seguir intentando?"
    candidatas = recuperar_citas_candidatas(pregunta_prueba, limite=5)
    
    for idx, cita in enumerate(candidatas, 1):
        print(f"  {idx}. [{cita['similitud']:.4f}] \"{cita['frase']}\" — {cita['autor']}")
