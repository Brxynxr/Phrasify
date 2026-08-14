import os
import pandas as pd
import numpy as np

# Variables globales en memoria para compartir textos y vectores entre los módulos
citas_compartidas = []
embeddings_compartidos = None

def cargar_dataset_maestro():
    """
    Carga el dataset maestro de citas y sus embeddings vectoriales asociados.
    Si el caché de embeddings no existe, lo genera automáticamente.
    """
    global citas_compartidas, embeddings_compartidos
    
    directorio_actual = os.path.dirname(os.path.abspath(__file__))
    ruta_excel = os.path.join(directorio_actual, "datos", "citas_maestro.xlsx")
    ruta_embeddings = os.path.join(directorio_actual, "datos", "citas_embeddings.npy")
    
    # 1. Carga de citas de texto desde Excel
    if not os.path.exists(ruta_excel):
        raise FileNotFoundError(
            f"No se encontró el dataset maestro en: {ruta_excel}. "
            "Por favor, ejecuta 'generar_dataset.py' primero."
        )
    
    print(f"Cargando citas en memoria desde: {ruta_excel}")
    df = pd.read_excel(ruta_excel, engine='openpyxl')
    
    citas_cargadas = []
    for _, fila in df.iterrows():
        tags_raw = str(fila.get('tags', ''))
        lista_tags = [tag.strip() for tag in tags_raw.split(',') if tag.strip()]
        
        citas_cargadas.append({
            "frase": str(fila.get('frase', '')).strip(),
            "autor": str(fila.get('autor', '')).strip(),
            "tags": lista_tags
        })
        
    citas_compartidas = citas_cargadas
    print(f"Texto: se cargaron exitosamente {len(citas_compartidas)} citas en memoria.")
    
    # 2. Carga/Generación automática de embeddings vectoriales (.npy)
    if not os.path.exists(ruta_embeddings):
        print(f"Caché de embeddings no encontrado en: {ruta_embeddings}")
        print("Iniciando generación automática de embeddings vectoriales...")
        # Importación tardía para evitar problemas de dependencias en compilaciones simples
        from generar_embeddings import generar_y_guardar_embeddings
        generar_y_guardar_embeddings()
        
    # Cargar los embeddings vectoriales desde la caché (.npy)
    print(f"Cargando matriz de embeddings desde: {ruta_embeddings}")
    embeddings_compartidos = np.load(ruta_embeddings)
    print(f"Vectores: se cargaron exitosamente {embeddings_compartidos.shape[0]} embeddings vectoriales.")
    
    return citas_compartidas, embeddings_compartidos

def obtener_citas():
    """
    Retorna la lista de citas actualmente en memoria.
    """
    global citas_compartidas
    return citas_compartidas

def obtener_embeddings():
    """
    Retorna la matriz de embeddings vectoriales en memoria.
    """
    global embeddings_compartidos
    return embeddings_compartidos
