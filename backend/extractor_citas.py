import asyncio
from playwright.async_api import async_playwright

async def extraer_todas_las_citas():
    """
    Realiza el scraping del sitio https://quotes.toscrape.com.
    Extrae la frase, el autor y las etiquetas (tags) de cada cita recorriendo
    la paginación dinámicamente hasta que no existan más elementos.
    
    Retorna:
        list: Lista de diccionarios, donde cada diccionario contiene:
              'autor', 'frase' y 'tags' (lista de strings).
    """
    citas_extraidas = []
    
    # Inicialización de Playwright
    async with async_playwright() as p:
        # Se lanza el navegador Chromium en modo headless (seguro y portable para servidores)
        navegador = await p.chromium.launch(headless=True)
        contexto = await navegador.new_context()
        pagina = await contexto.new_page()
        
        estado_paginacion = True
        numero_pagina = 1
        
        print("Iniciando el proceso de scraping...")
        
        while estado_paginacion:
            # Corrección del bug de paginación: interpolación correcta del número de página
            url_destino = f"https://quotes.toscrape.com/page/{numero_pagina}/"
            print(f"Navegando a: {url_destino}")
            
            try:
                # Navegar a la página con un tiempo límite prudencial
                await pagina.goto(url_destino, timeout=30000)
                
                # Obtener todos los contenedores de citas en la página actual
                elementos_citas = await pagina.locator(".quote").all()
                
                if elementos_citas:
                    # Recorrer cada cita encontrada
                    for elemento in elementos_citas:
                        # Extraer el texto de la frase
                        texto_frase = await elemento.locator(".text").inner_text()
                        # Limpiar comillas tipográficas que puedan venir en el texto original
                        texto_frase = texto_frase.replace('“', '').replace('”', '').strip()
                        
                        # Extraer el nombre del autor
                        nombre_autor = await elemento.locator(".author").inner_text()
                        nombre_autor = nombre_autor.strip()
                        
                        # Extraer las etiquetas (tags) asociadas a la cita
                        elementos_tags = await elemento.locator(".tag").all()
                        lista_tags = []
                        for tag in elementos_tags:
                            texto_tag = await tag.inner_text()
                            lista_tags.append(texto_tag.strip())
                        
                        # Almacenar la información en nuestra lista estructurada
                        citas_extraidas.append({
                            "autor": nombre_autor,
                            "frase": texto_frase,
                            "tags": lista_tags
                        })
                    
                    print(f"Página {numero_pagina} procesada exitosamente. Citas totales acumuladas: {len(citas_extraidas)}")
                    numero_pagina += 1
                else:
                    # Si no hay más elementos .quote en la página, hemos terminado la paginación
                    print("No se encontraron más citas. Fin del scraping.")
                    estado_paginacion = False
            except Exception as e:
                print(f"Error al procesar la página {numero_pagina}: {e}")
                # En caso de error crítico, detenemos el proceso para no ciclar
                estado_paginacion = False
        
        # Cerrar el navegador de manera segura
        await navegador.close()
        
    return citas_extraidas

# Bloque de ejecución principal para testing del scraper independiente
if __name__ == "__main__":
    # Ejecutar la función asíncrona de manera independiente
    resultado = asyncio.run(extraer_todas_las_citas())
    print("\nResumen del Scraping:")
    print(f"Total de citas extraídas: {len(resultado)}")
    if resultado:
        print("Muestra de la primera cita:")
        print(resultado[0])
