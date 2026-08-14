import tiktoken

# Codificación estándar compatible con OpenAI/Gemini (cl100k_base)
# Ligera, rápida y sin necesidad de cargar modelos de ML pesados
_ENCODING = tiktoken.get_encoding("cl100k_base")

def contar_tokens(texto: str) -> int:
    """
    Cuenta el número exacto de tokens que componen un texto utilizando
    tiktoken (cl100k_base), la misma codificación usada por GPT-4 y Gemini.
    
    Es significativamente más rápido que usar el tokenizador de BERT de
    sentence-transformers, ya que no requiere cargar un modelo de ML.
    
    Parámetros:
        texto (str): Cadena de caracteres a analizar.
        
    Retorna:
        int: Cantidad de tokens calculados.
    """
    if not texto:
        return 0
    return len(_ENCODING.encode(texto))

if __name__ == "__main__":
    print("Prueba independiente del Tokenizador (tiktoken cl100k_base):")
    
    frases_prueba = [
        "I have not failed. I've just found 10,000 ways that won't work.",
        "It is impossible to live without failing at something...",
        "Hola mundo, esta es una frase en español de prueba."
    ]
    
    for f in frases_prueba:
        num_tokens = contar_tokens(f)
        print(f"\nTexto: \"{f}\"")
        print(f"Número de tokens (tiktoken): {num_tokens}")
