from fastapi import APIRouter, HTTPException
from cargador_datos import obtener_citas
from esquemas.espejo import EntradaBusqueda, SalidaBusqueda
from servicios.buscador_semantico import buscar_citas_por_afinidad

# Enrutador para el Módulo 1: Espejo (Buscador de Vibras)
enrutador_espejo = APIRouter(
    prefix="/espejo",
    tags=["Espejo (Módulo 1 — Buscador de Vibras)"]
)

@enrutador_espejo.get("/")
def verificar_modulo_espejo():
    """
    Ruta básica de verificación para confirmar que el módulo Espejo está en funcionamiento
    y puede acceder al dataset de citas compartido.
    """
    citas = obtener_citas()
    return {
        "modulo": "Espejo",
        "estado": "activo",
        "mensaje": "Buscador de Vibras listo para recibir peticiones semánticas.",
        "citas_disponibles": len(citas)
    }

@enrutador_espejo.post("/buscar", response_model=SalidaBusqueda)
def buscar_citas_semanticas(datos_busqueda: EntradaBusqueda):
    """
    Realiza la búsqueda semántica vectorial (Buscador de Vibras).
    Recibe un texto libre con la emoción o pensamiento, calcula similitud coseno
    contra todas las citas del dataset y retorna las citas más afines.
    """
    try:
        # Llamar al servicio que calcula las similitudes usando numpy
        resultados_busqueda = buscar_citas_por_afinidad(
            consulta=datos_busqueda.consulta,
            limite=datos_busqueda.limite
        )
        return {"resultados": resultados_busqueda}
    except ValueError as ve:
        # Error si los datos en memoria global no están disponibles
        raise HTTPException(status_code=503, detail=str(ve))
    except Exception as e:
        # Manejo de error general para fallos internos del servidor
        raise HTTPException(status_code=500, detail=f"Error interno durante la búsqueda semántica: {str(e)}")
