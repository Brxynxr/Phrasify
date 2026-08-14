import os
import pandas as pd

# Variable global en memoria para almacenar las citas compartidas entre los módulos
citas_compartidas = []

def cargar_dataset_maestro():
    """
    Lee el archivo Excel citas_maestro.xlsx, procesa las etiquetas de vuelta
    a una lista de strings y carga los datos en la variable global citas_compartidas.
    """
    global citas_compartidas
    
    # Resolver la ruta de forma absoluta relativa a la ubicación de este script
    directorio_actual = os.path.dirname(os.path.abspath(__file__))
    ruta_excel = os.path.join(directorio_actual, "datos", "citas_maestro.xlsx")
    
    # Verificar que el dataset exista antes de proceder
    if not os.path.exists(ruta_excel):
        raise FileNotFoundError(
            f"No se encontró el dataset maestro en: {ruta_excel}. "
            "Por favor, ejecuta el script 'generar_dataset.py' primero."
        )
    
    print(f"Cargando dataset maestro en memoria desde: {ruta_excel}")
    
    # Leer archivo con Pandas usando openpyxl
    df = pd.read_excel(ruta_excel, engine='openpyxl')
    
    # Limpiar y estructurar las citas cargadas
    citas_cargadas = []
    for _, fila in df.iterrows():
        tags_raw = str(fila.get('tags', ''))
        # Separar el string de etiquetas por coma y limpiar espacios blancos
        lista_tags = [tag.strip() for tag in tags_raw.split(',') if tag.strip()]
        
        citas_cargadas.append({
            "frase": str(fila.get('frase', '')).strip(),
            "autor": str(fila.get('autor', '')).strip(),
            "tags": lista_tags
        })
        
    citas_compartidas = citas_cargadas
    print(f"Carga completa. Se cargaron exitosamente {len(citas_compartidas)} citas en memoria.")
    return citas_compartidas

def obtener_citas():
    """
    Retorna la lista de citas actualmente en memoria.
    """
    global citas_compartidas
    return citas_compartidas
