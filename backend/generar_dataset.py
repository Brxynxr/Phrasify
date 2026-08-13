import asyncio
import os
import pandas as pd
from extractor_citas import extraer_todas_las_citas

async def generar_dataset_maestro():
    """
    Coordina la extracción de citas mediante el scraper y utiliza pandas para
    procesar, estructurar y exportar la información a un archivo Excel maestro (.xlsx).
    """
    # 1. Obtener la información cruda a través de la función de scraping
    citas_crudas = await extraer_todas_las_citas()
    
    if not citas_crudas:
        print("Error: No se pudieron extraer citas. Proceso cancelado.")
        return
    
    print("\nProcesando los datos con Pandas...")
    
    # 2. Crear el DataFrame de pandas a partir de los datos crudos
    df_citas = pd.DataFrame(citas_crudas)
    
    # 3. Formatear la lista de etiquetas (tags) como una cadena separada por comas para Excel
    # Esto facilita su visualización en Excel y su posterior lectura
    df_citas['tags'] = df_citas['tags'].apply(lambda lista: ",".join(lista))
    
    # Reordenar y limpiar columnas usando los nombres en español definidos en el scraper
    df_citas = df_citas[['frase', 'autor', 'tags']]
    
    # Eliminar duplicados si existieran por redundancia en el sitio
    total_antes = len(df_citas)
    df_citas.drop_duplicates(subset=['frase'], inplace=True)
    total_despues = len(df_citas)
    
    if total_antes != total_despues:
        print(f"Se eliminaron {total_antes - total_despues} frases duplicadas.")
    
    # 4. Asegurar que la carpeta de almacenamiento de datos existe de forma relativa al script
    directorio_actual = os.path.dirname(os.path.abspath(__file__))
    directorio_datos = os.path.join(directorio_actual, "datos")
    if not os.path.exists(directorio_datos):
        os.makedirs(directorio_datos)
        print(f"Carpeta creada: {directorio_datos}")
        
    ruta_excel = os.path.join(directorio_datos, "citas_maestro.xlsx")
    
    # 5. Guardar los datos procesados en formato Excel usando openpyxl (requerido por pandas para xlsx)
    print(f"Exportando {len(df_citas)} citas a '{ruta_excel}'...")
    df_citas.to_excel(ruta_excel, index=False, engine='openpyxl')
    
    print("¡Dataset maestro de citas generado exitosamente!")

if __name__ == "__main__":
    # Ejecutar el flujo de generación del dataset maestro
    asyncio.run(generar_dataset_maestro())
