from pydantic import BaseModel, Field
from typing import List

class EntradaOptimizador(BaseModel):
    """
    Contrato de datos de entrada para ejecutar el empaquetado de lotes.
    Permite configurar dinámicamente el tamaño de tokens por contenedor.
    """
    limite_tokens: int = Field(
        250,
        ge=50,
        le=1000,
        description="Límite máximo de tokens permitidos en cada lote individual (mínimo 50, máximo 1000).",
        examples=[150, 250, 500]
    )

class CitaEmpaquetada(BaseModel):
    """
    Representación de una cita procesada dentro de un lote con su respectivo tamaño de tokens.
    """
    frase: str
    autor: str
    tags: List[str]
    tokens: int = Field(
        ...,
        description="Footprint de tokens calculado por el tokenizador."
    )

class DetalleLote(BaseModel):
    """
    Representación del contenido y las métricas de eficiencia de un lote resultante.
    """
    lote_id: int = Field(..., description="Identificador secuencial del lote (1-indexed).")
    tokens_utilizados: int = Field(..., description="Suma total de tokens que consumen las citas del lote.")
    eficiencia: float = Field(..., description="Porcentaje de espacio utilizado del límite de tokens.")
    citas: List[CitaEmpaquetada] = Field(..., description="Lista de citas empaquetadas en este lote.")

class ResumenFinanciero(BaseModel):
    """
    Desglose financiero detallado de la simulación de procesamiento.
    """
    total_lotes: int = Field(..., description="Cantidad total de lotes de transmisión generados.")
    total_tokens: int = Field(..., description="Número total de tokens procesados.")
    coste_fijo_total: float = Field(..., description="Costo total de lotes ($0.005 por lote).")
    coste_tokens_total: float = Field(..., description="Costo total de tokens ($0.00002 por token).")
    coste_final_total: float = Field(..., description="Costo final acumulado de la simulación.")
    eficiencia_promedio: float = Field(..., description="Eficiencia promedio de llenado de todos los lotes.")

class SalidaOptimizador(BaseModel):
    """
    Contrato de datos de salida que devuelve la simulación del optimizador de presupuestos.
    """
    resumen_financiero: ResumenFinanciero
    lotes: List[DetalleLote]
