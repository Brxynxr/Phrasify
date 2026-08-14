from fastapi import APIRouter, HTTPException
from cargador_datos import obtener_citas
from esquemas.tribuna import EntradaDebate, SalidaDebate
from servicios.orador_tribuna import generar_debate_respaldado

# Enrutador para el Módulo 2: Tribuna (Orador de Debates)
enrutador_tribuna = APIRouter(
    prefix="/tribuna",
    tags=["Tribuna (Módulo 2 — Orador de Debates Respaldado)"]
)

@enrutador_tribuna.get("/")
def verificar_modulo_tribuna():
    """
    Ruta básica de verificación para confirmar que el módulo Tribuna está en funcionamiento.
    """
    citas = obtener_citas()
    return {
        "modulo": "Tribuna",
        "estado": "activo",
        "mensaje": "Orador de Debates listo para recibir dilemas y formular discursos.",
        "citas_disponibles": len(citas)
    }

@enrutador_tribuna.post("/debatir", response_model=SalidaDebate)
async def debatir_tema_filosofico(datos_debate: EntradaDebate):
    """
    Recibe una pregunta o dilema ético y un umbral de rigor configurable.
    Recupera las citas semánticas más afines, verifica que superen el umbral
    (anti-alucinaciones), y llama al LLM para redactar el ensayo argumentativo.
    Si no hay fuentes con suficiente afinidad, devuelve un fallback honesto.
    """
    try:
        resultado = await generar_debate_respaldado(
            pregunta=datos_debate.pregunta,
            umbral=datos_debate.umbral
        )
        return resultado
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error interno del servidor en el módulo Tribuna: {str(e)}"
        )
