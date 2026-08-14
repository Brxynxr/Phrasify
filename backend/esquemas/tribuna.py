from pydantic import BaseModel, Field
from typing import List, Optional

class EntradaDebate(BaseModel):
    """
    Contrato de datos de entrada para formular una pregunta al orador en Tribuna.
    Valida la longitud mínima de la pregunta y permite ajustar el umbral de relevancia.
    """
    pregunta: str = Field(
        ...,
        min_length=5,
        description="La pregunta filosófica o tema sobre el cual se desea generar un argumento.",
        examples=["¿Es el fracaso indispensable para alcanzar el éxito?", "¿Qué significa ser feliz?"]
    )
    umbral: Optional[float] = Field(
        default=0.42,
        ge=0.0,
        le=1.0,
        description="Umbral de similitud coseno mínimo (entre 0 y 1) para aceptar citas como sustento."
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
        description="Indica si se encontraron fuentes válidas que superen el umbral."
    )
    ensayo: str = Field(
        ...,
        description="Mini-ensayo redactado por IA citando fuentes reales, o mensaje explicativo del fallback."
    )
    citas_utilizadas: List[CitaSoporte] = Field(
        ...,
        description="Listado de las citas reales utilizadas para respaldar el argumento."
    )
