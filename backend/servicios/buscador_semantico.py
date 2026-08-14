import os
import numpy as np
from sentence_transformers import SentenceTransformer
from cargador_datos import obtener_citas, obtener_embeddings

# Instancia global del modelo en este módulo (Lazy Loading)
_modelo_embeddings = None

def obtener_modelo():
    """
    Retorna la instancia global del modelo de embeddings.
    La carga se realiza de forma perezosa (lazy load) la primera vez que se requiere.
    """
    global _modelo_embeddings
    if _modelo_embeddings is None:
        nombre_modelo = "paraphrase-multilingual-MiniLM-L12-v2"
        print(f"Buscador Semántico: Inicializando instancia del modelo '{nombre_modelo}'...")
        _modelo_embeddings = SentenceTransformer(nombre_modelo)
    return _modelo_embeddings

def buscar_citas_por_afinidad(consulta: str, limite: int = 3):
    """
    Realiza la búsqueda semántica vectorial (sin keyword matching).
    Calcula la similitud coseno entre el embedding de la consulta del usuario y los embeddings
    de todas las citas del dataset maestro cargadas en memoria global.
    
    Parámetros:
        consulta (str): Texto libre con la emoción, situación o pensamiento del usuario.
        limite (int): Cantidad de citas más cercanas a retornar.
        
    Retorna:
        list: Lista de diccionarios con las citas más afines y sus puntuaciones de similitud.
              Cada diccionario contiene: 'frase', 'autor', 'tags' y 'similitud' (float entre -1 y 1).
    """
    # 1. Obtener las citas de texto y la matriz de embeddings del cargador global
    citas = obtener_citas()
    embeddings = obtener_embeddings()
    
    if not citas or embeddings is None:
        raise ValueError("El dataset o los embeddings no han sido cargados en memoria. Inicializa el cargador de datos.")
    
    # 2. Generar el embedding vectorial para la consulta del usuario
    modelo = obtener_modelo()
    # Se genera el vector con forma (384,)
    vector_consulta = modelo.encode(consulta, convert_to_numpy=True)
    
    # 3. Calcular la similitud coseno usando álgebra lineal vectorizada con numpy
    # Similitud Coseno = (A . B) / (||A|| * ||B||)
    
    # Producto punto (dot product) de la matriz de embeddings contra el vector de la consulta
    producto_punto = np.dot(embeddings, vector_consulta)
    
    # Magnitudes (normas L2) de todos los vectores del dataset (fila por fila)
    normas_dataset = np.linalg.norm(embeddings, axis=1)
    # Magnitud (norma L2) del vector de la consulta
    norma_consulta = np.linalg.norm(vector_consulta)
    
    # Prevenir divisiones por cero en casos atípicos
    if norma_consulta == 0:
        norma_consulta = 1e-9
    normas_dataset[normas_dataset == 0] = 1e-9
    
    # Vector de similitudes con forma (100,)
    similitudes = producto_punto / (normas_dataset * norma_consulta)
    
    # 4. Obtener los índices de las citas con mayor similitud (orden descendente)
    indices_ordenados = np.argsort(similitudes)[::-1]
    indices_seleccionados = indices_ordenados[:limite]
    
    # 5. Estructurar la respuesta
    resultados = []
    for indice in indices_seleccionados:
        cita_original = citas[indice]
        # Es necesario convertir float32 de numpy a un float nativo de Python para la serialización JSON de FastAPI
        porcentaje_similitud = float(similitudes[indice])
        
        resultados.append({
            "frase": cita_original["frase"],
            "autor": cita_original["autor"],
            "tags": cita_original["tags"],
            "similitud": porcentaje_similitud
        })
        
    return resultados

# Ejecución de prueba local independiente
if __name__ == "__main__":
    from cargador_datos import cargar_dataset_maestro
    print("Prueba independiente del Buscador Semántico:")
    
    # Carga de cimientos
    cargar_dataset_maestro()
    
    consultas_prueba = [
        "Me siento extremadamente melancólico y triste",
        "El éxito solo viene después de mucho esfuerzo y dedicación",
        "No te preocupes por el fracaso, sigue intentándolo"
    ]
    
    for c in consultas_prueba:
        print(f"\nConsulta: '{c}'")
        res = buscar_citas_por_afinidad(c, limite=3)
        for i, item in enumerate(res, 1):
            print(f"  {i}. [{item['similitud']:.4f}] \"{item['frase']}\" — {item['autor']} (Tags: {item['tags']})")
