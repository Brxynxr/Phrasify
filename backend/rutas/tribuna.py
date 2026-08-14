from fastapi import APIRouter
from cargador_datos import obtener_citas

# Enrutador para el Módulo 2: Tribuna (Orador de Debates)
enrutador_tribuna = APIRouter(
    prefix="/tribuna",
    tags=["Tribuna (Módulo 2 — Orador de Debates Respaldado)"]
)

@enrutador_tribuna.get("/")
def verificar_modulo_tribuna():
    """
    Ruta básica de verificación para confirmar que el módulo Tribuna está en funcionamiento
    y puede acceder al dataset de citas compartido.
    """
    citas = obtener_citas()
    return {
        "modulo": "Tribuna",
        "estado": "activo",
        "mensaje": "Orador de Debates listo para recibir dilemas y formular discursos.",
        "citas_disponibles": len(citas)
    }
