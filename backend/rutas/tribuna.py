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

@enrutador_tribuna.post("/debatir", response_model=SalidaDebate)
async def debatir_tema_filosofico(datos_debate: EntradaDebate):
    """
    Recibe una pregunta o dilema ético, evalúa si existen citas relevantes
    dentro del dataset maestro (según el umbral de similitud) y, si es el caso,
    llama al modelo generador de IA para redactar un ensayo de 2 párrafos
    citando estrictamente las fuentes reales recuperadas.
    """
    try:
        # Llamar al orquestador asíncrono del módulo Tribuna
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
