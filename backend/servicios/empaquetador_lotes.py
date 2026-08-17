import os
import sys

# Agregar la ruta del backend al path para ejecuciones independientes
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from servicios.tokenizador import contar_tokens

def empaquetar_citas(citas: list, limite_tokens: int) -> dict:
    """
    Empaqueta una lista de citas en el menor número posible de lotes (bins)
    aplicando el algoritmo First-Fit Decreasing (FFD) basado en el conteo de tokens.
    
    Además, realiza una simulación financiera de costes de procesamiento:
      - Tarifa fija por lote: $0.005 USD
      - Tarifa variable por token: $0.00002 USD
      
    Parámetros:
        citas (list): Lista de diccionarios de citas del dataset maestro.
        limite_tokens (int): Límite máximo de tokens permitido por lote.
        
    Retorna:
        dict: Resumen financiero totalizador y el listado detallado de lotes.
    """
    if not citas:
        return {
            "resumen_financiero": {
                "total_lotes": 0,
                "total_tokens": 0,
                "coste_fijo_total": 0.0,
                "coste_tokens_total": 0.0,
                "coste_final_total": 0.0,
                "eficiencia_promedio": 0.0
            },
            "lotes": []
        }

    # 1. Calcular los tokens de cada cita y enriquecer el diccionario
    citas_con_tokens = []
    for c in citas:
        tokens_cita = contar_tokens(c["frase"])
        citas_con_tokens.append({
            "frase": c["frase"],
            "autor": c["autor"],
            "tags": c["tags"],
            "tokens": tokens_cita
        })
        
    # 2. Ordenar las citas de mayor a menor tokenización (Decreasing)
    citas_ordenadas = sorted(citas_con_tokens, key=lambda x: x["tokens"], reverse=True)
    
    # 3. Aplicar First-Fit con validación de citas indivisibles
    lotes = [] # Cada lote es: {"tokens_utilizados": int, "citas": list, "excedido": bool}
    
    for cita in citas_ordenadas:
        tokens_cita = cita["tokens"]
        colocada = False
        
        # Intentar meter la cita en el primer lote que tenga suficiente espacio residual
        for lote in lotes:
            if lote["tokens_utilizados"] + tokens_cita <= limite_tokens:
                lote["citas"].append(cita)
                lote["tokens_utilizados"] += tokens_cita
                colocada = True
                break
        
        # Si no cabe en ningún lote existente, crear uno nuevo
        if not colocada:
            # Validar si la cita individual excede el límite de tokens
            if tokens_cita > limite_tokens:
                lotes.append({
                    "tokens_utilizados": tokens_cita,
                    "citas": [cita],
                    "excedido": True
                })
            else:
                lotes.append({
                    "tokens_utilizados": tokens_cita,
                    "citas": [cita],
                    "excedido": False
                })
            
    # 4. Calcular métricas financieras y formatear salida
    coste_fijo_por_lote = 0.005
    coste_por_token = 0.00002
    
    total_lotes = len(lotes)
    total_tokens = sum(l["tokens_utilizados"] for l in lotes)
    
    coste_fijo_total = total_lotes * coste_fijo_por_lote
    coste_tokens_total = total_tokens * coste_por_token
    coste_final_total = coste_fijo_total + coste_tokens_total
    
    lotes_resultado = []
    eficiencias = []
    
    for idx, l in enumerate(lotes, 1):
        # Calcular eficiencia real; si el lote tiene excedido: true, permitir >100%
        if l.get("excedido", False):
            eficiencia = (l["tokens_utilizados"] / limite_tokens) * 100
        else:
            eficiencia = min((l["tokens_utilizados"] / limite_tokens) * 100, 100.0)
        eficiencias.append(eficiencia)
        
        lotes_resultado.append({
            "lote_id": idx,
            "tokens_utilizados": l["tokens_utilizados"],
            "eficiencia": round(eficiencia, 2),
            "excedido": l.get("excedido", False),
            "citas": l["citas"]
        })
        
    eficiencia_promedio = sum(eficiencias) / len(eficiencias) if eficiencias else 0.0
    
    return {
        "resumen_financiero": {
            "total_lotes": total_lotes,
            "total_tokens": total_tokens,
            "coste_fijo_total": round(coste_fijo_total, 4),
            "coste_tokens_total": round(coste_tokens_total, 6),
            "coste_final_total": round(coste_final_total, 6),
            "eficiencia_promedio": round(eficiencia_promedio, 2)
        },
        "lotes": lotes_resultado
    }

if __name__ == "__main__":
    from cargador_datos import cargar_dataset_maestro, obtener_citas
    
    print("Prueba del Empaquetador de Lotes:")
    cargar_dataset_maestro()
    citas = obtener_citas()
    
    limite = 250
    resultado = empaquetar_citas(citas, limite)
    resumen = resultado["resumen_financiero"]
    
    print(f"\nEmpaquetado completado para límite = {limite} tokens:")
    print(f"Total de lotes generados: {resumen['total_lotes']}")
    print(f"Total de tokens procesados: {resumen['total_tokens']}")
    print(f"Eficiencia promedio de llenado: {resumen['eficiencia_promedio']}%")
    print(f"Coste total estimado: ${resumen['coste_final_total']} USD")
    # Mostrar información sobre lotes con citas indivisibles
    lotes_excedidos = [l for l in resultado["lotes"] if l.get("excedido", False)]
    if lotes_excedidos:
        print(f"⚠️  Cuidado: {len(lotes_excedidos)} lote(s) contiene(n) cita(s) indivisible(s) que exceden el límite de tokens.")
