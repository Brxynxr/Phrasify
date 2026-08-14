import httpx

# Cliente HTTP asíncrono global reutilizable (evita el overhead de reconexión TCP/TLS en cada llamada)
cliente_http_global = httpx.AsyncClient()

async def cerrar_cliente_http():
    """
    Cierra la conexión del pool del cliente HTTP al apagar el servidor.
    """
    await cliente_http_global.aclose()
    print("Cliente HTTP global cerrado correctamente.")
