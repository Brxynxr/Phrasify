from fastapi import APIRouter, HTTPException
from cargador_datos import obtener_citas
from esquemas.bitacora import EntradaOptimizador, SalidaOptimizador
from servicios.empaquetador_lotes import empaquetar_citas

# Enrutador para el Módulo 3: Bitácora (Optimizador de Presupuesto y Empaquetado)
enrutador_bitacora = APIRouter(
    prefix="/bitacora",
    tags=["Bitácora (Módulo 3 — Optimizador de Presupuesto y Empaquetado)"]
)

@enrutador_bitacora.get("/")
def verificar_modulo_bitacora():
    """
    Ruta básica de verificación para confirmar que el módulo Bitácora está activo.
    """
    citas = obtener_citas()
    return {
        "modulo": "Bitacora",
        "estado": "activo",
        "mensaje": "Optimizador de Presupuestos listo para empaquetar lotes.",
        "citas_disponibles": len(citas)
    }

@enrutador_bitacora.post("/optimizar", response_model=SalidaOptimizador)
def optimizar_presupuesto_empaque(datos: EntradaOptimizador):
    """
    Toma todas las citas del dataset maestro y las agrupa de forma óptima
    utilizando el algoritmo FFD (First-Fit Decreasing) según el límite de tokens,
    retornando los lotes detallados y el recibo financiero simulado.
    """
    try:
        citas = obtener_citas()
        if not citas:
            raise HTTPException(
                status_code=404,
                detail="No hay citas cargadas en el dataset maestro. Ejecuta la indexación de datos."
            )
            
        # Ejecutar empaquetado asíncrono-síncrono
        resultado = empaquetar_citas(citas, datos.limite_tokens)
        return resultado
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error interno al calcular la optimización de lotes: {str(e)}"
        )
