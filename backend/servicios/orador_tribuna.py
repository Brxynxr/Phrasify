import os
from servicios.recuperador_contexto import recuperar_citas_candidatas
from servicios.generador_ia import generar_ensayo_ia

async def generar_debate_respaldado(pregunta: str):
    """
    Orquesta la lógica del Módulo 2: Tribuna.
    Recupera las 3 citas semánticamente más cercanas del dataset maestro y las envía 
    al modelo de IA local para generar de forma consistente un ensayo argumentativo.
    
    Parámetros:
        pregunta (str): Pregunta planteada por el usuario.
        
    Retorna:
        dict: Estructura de debate que contiene:
              - 'suficientes_fuentes' (bool): Siempre True al desactivarse el filtro de umbral.
              - 'ensayo' (str): El ensayo generado por la IA.
              - 'citas_utilizadas' (list): Las 3 citas utilizadas como soporte.
    """
    # 1. Recuperar las 3 citas más afines
    citas_utilizadas = recuperar_citas_candidatas(pregunta, limite=3)
    
    print(f"Orador Tribuna: Generando argumento respaldado con {len(citas_utilizadas)} fuentes para: '{pregunta}'")
    
    # 2. Generar el ensayo con la IA
    try:
        ensayo_generado = await generar_ensayo_ia(pregunta, citas_utilizadas)
        return {
            "suficientes_fuentes": True,
            "ensayo": ensayo_generado,
            "citas_utilizadas": citas_utilizadas
        }
    except Exception as e:
        print(f"Orador Tribuna: Error durante la generación con IA: {e}")
        error_fallback = (
            f"No se pudo generar el ensayo argumentativo debido a un problema con el servicio de IA ({str(e)}). "
            "No obstante, a continuación se muestran las fuentes reales encontradas en nuestro dataset maestro."
        )
        return {
            "suficientes_fuentes": True,
            "ensayo": error_fallback,
            "citas_utilizadas": citas_utilizadas
        }

if __name__ == "__main__":
    import sys
    import asyncio
    
    sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
    from cargador_datos import cargar_dataset_maestro
    
    async def prueba():
        cargar_dataset_maestro()
        res = await generar_debate_respaldado("Yo solo sé que nada sé")
        print("\nEnsayo Generado:\n", res["ensayo"])
        
    asyncio.run(prueba())
