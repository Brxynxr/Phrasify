from pydantic import BaseModel, Field
from typing import List

class EntradaBusqueda(BaseModel):
    """
    Contrato de datos para recibir la consulta del usuario.
    Valida que el texto tenga una longitud mínima para realizar la búsqueda
    y limita la cantidad máxima de resultados para proteger el rendimiento.
    """
    consulta: str = Field(
        ...,
        min_length=3,
        description="Frase, emoción o pensamiento a buscar de forma semántica.",
        examples=["Me siento muy melancólico hoy", "Siento que el éxito requiere esfuerzo"]
    )
    limite: int = Field(
        default=3,
        ge=1,
        le=10,
        description="Número máximo de citas afines a retornar (entre 1 y 10)."
    )

class CitaResultado(BaseModel):
    """
    Modelo que define la estructura de una cita encontrada
    junto con su nivel de similitud semántica.
    """
    frase: str
    autor: str
    tags: List[str]
    similitud: float = Field(
        ...,
        description="Puntuación de similitud coseno calculada en el backend."
    )

class SalidaBusqueda(BaseModel):
    """
    Modelo de respuesta final de la búsqueda semántica.
    """
    resultados: List[CitaResultado]
