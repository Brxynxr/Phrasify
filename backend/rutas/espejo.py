from fastapi import APIRouter
from cargador_datos import obtener_citas

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
