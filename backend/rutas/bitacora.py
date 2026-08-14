from fastapi import APIRouter
from cargador_datos import obtener_citas

# Enrutador para el Módulo 3: Bitácora (Optimizador de Lotes)
enrutador_bitacora = APIRouter(
    prefix="/bitacora",
    tags=["Bitácora (Módulo 3 — Optimizador de Presupuesto y Lotes)"]
)

@enrutador_bitacora.get("/")
def verificar_modulo_bitacora():
    """
    Ruta básica de verificación para confirmar que el módulo Bitácora está en funcionamiento
    y puede acceder al dataset de citas compartido.
    """
    citas = obtener_citas()
    return {
        "modulo": "Bitácora",
        "estado": "activo",
        "mensaje": "Optimizador de Presupuesto listo para simular bin-packing.",
        "citas_disponibles": len(citas)
    }
