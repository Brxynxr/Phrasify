from pydantic import BaseModel, Field
from typing import List

class EntradaDebate(BaseModel):
    """
    Contrato de datos de entrada para formular una pregunta al orador en Tribuna.
    Permite configurar el nivel de rigor semántico mínimo requerido.
    """
    pregunta: str = Field(
        ...,
        min_length=5,
        description="La pregunta filosófica o tema sobre el cual se desea generar un argumento.",
        examples=["¿Es el fracaso indispensable para alcanzar el éxito?", "¿Qué significa ser feliz?"]
    )
    umbral: float = Field(
        0.42,
        ge=0.20,
        le=0.70,
        description="Umbral mínimo de similitud coseno (0.20-0.70). Valores altos = más rigor, mayor riesgo de fallback."
    )

class CitaSoporte(BaseModel):
    """
    Representación de una cita real del dataset maestro utilizada como soporte.
    """
    frase: str
    autor: str
    tags: List[str]
    similitud: float = Field(
        ...,
        description="Nivel de similitud coseno respecto a la consulta."
    )

class SalidaDebate(BaseModel):
    """
    Contrato de datos de salida que devuelve el orador de debates.
    """
    suficientes_fuentes: bool = Field(
        ...,
        description="Indica si se encontraron citas que superaron el umbral de rigor mínimo."
    )
    ensayo: str = Field(
        ...,
        description="Mini-ensayo redactado por IA citando fuentes reales, o mensaje de fallback si no hay fuentes."
    )
    citas_utilizadas: List[CitaSoporte] = Field(
        ...,
        description="Listado de las citas reales utilizadas (o candidatas en caso de fallback)."
    )
