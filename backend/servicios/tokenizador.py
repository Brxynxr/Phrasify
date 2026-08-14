import os
import sys

# Agregar la ruta del backend al path para ejecuciones independientes
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from servicios.buscador_semantico import obtener_modelo

def contar_tokens(texto: str) -> int:
    """
    Cuenta el número exacto de tokens que componen un texto utilizando
    el tokenizador nativo del modelo transformer cargado en memoria.
    
    Parámetros:
        texto (str): Cadena de caracteres a analizar.
        
    Retorna:
        int: Cantidad de tokens calculados.
    """
    if not texto:
        return 0
        
    modelo = obtener_modelo()
    # Obtener los tokens del tokenizador HuggingFace subyacente
    tokens = modelo.tokenizer.tokenize(texto)
    
    return len(tokens)

if __name__ == "__main__":
    print("Prueba independiente del Tokenizador:")
    
    frases_prueba = [
        "I have not failed. I've just found 10,000 ways that won't work.",
        "It is impossible to live without failing at something...",
        "Hola mundo, esta es una frase en español de prueba."
    ]
    
    for f in frases_prueba:
        num_tokens = contar_tokens(f)
        print(f"\nTexto: \"{f}\"")
        print(f"Número de tokens: {num_tokens}")
