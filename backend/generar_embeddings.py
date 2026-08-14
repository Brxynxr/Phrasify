import os
import pandas as pd
import numpy as np
from sentence_transformers import SentenceTransformer

def generar_y_guardar_embeddings():
    """
    Carga el dataset maestro de citas, descarga el modelo multilingüe de sentence-transformers,
    calcula los embeddings (vectores numéricos) para cada frase y los guarda en un archivo .npy
    para servir de caché de búsqueda semántica.
    """
    # 1. Resolver rutas de forma absoluta
    directorio_actual = os.path.dirname(os.path.abspath(__file__))
    ruta_excel = os.path.join(directorio_actual, "datos", "citas_maestro.xlsx")
    ruta_embeddings = os.path.join(directorio_actual, "datos", "citas_embeddings.npy")
    
    # Validar existencia del Excel
    if not os.path.exists(ruta_excel):
        raise FileNotFoundError(
            f"No se encontró el dataset maestro en: {ruta_excel}. "
            "Por favor, ejecuta 'generar_dataset.py' primero."
        )
        
    print(f"Cargando citas desde: {ruta_excel}")
    df = pd.read_excel(ruta_excel, engine='openpyxl')
    
    # Extraer las frases del dataset (asegurando que sean de tipo string)
    frases = df['frase'].astype(str).tolist()
    print(f"Total de frases a procesar: {len(frases)}")
    
    # 2. Cargar el modelo multilingüe de SentenceTransformers
    # Este modelo es ideal para consultas en español sobre citas en inglés
    nombre_modelo = "paraphrase-multilingual-MiniLM-L12-v2"
    print(f"Cargando el modelo de embeddings: '{nombre_modelo}'...")
    modelo = SentenceTransformer(nombre_modelo)
    
    # 3. Calcular los embeddings vectoriales
    print("Generando vectores de embeddings (esto puede tardar unos segundos)...")
    embeddings = modelo.encode(
        frases, 
        show_progress_bar=True, 
        convert_to_numpy=True
    )
    
    # 4. Guardar los embeddings en formato binario de numpy (.npy)
    print(f"Guardando matriz de embeddings (forma: {embeddings.shape}) en: {ruta_embeddings}")
    np.save(ruta_embeddings, embeddings)
    
    print("¡Proceso de generación y cacheo de embeddings completado exitosamente!")

if __name__ == "__main__":
    generar_y_guardar_embeddings()
