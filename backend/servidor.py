from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# Inicialización de la aplicación FastAPI
aplicacion = FastAPI(
    title="Resonancia API",
    description="Servidor Backend para la SPA Resonancia que conecta los 3 retos técnicos.",
    version="1.0.0"
)

# Configuración de CORS para permitir peticiones desde el frontend (Vite por defecto usa el puerto 5173)
origenes_permitidos = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]

aplicacion.add_middleware(
    CORSMiddleware,
    allow_origins=origenes_permitidos,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Ruta base para verificar el estado del servidor
@aplicacion.get("/", tags=["Estado"])
def verificar_estado():
    """
    Endpoint simple para verificar que el servidor de Resonancia esté activo y respondiendo.
    """
    return {
        "estado": "activo",
        "mensaje": "Servidor de Resonancia funcionando correctamente",
        "modulos": [
            "Buscador de Vibras",
            "Orador de Debates Respaldado",
            "Optimizador de Presupuesto y Empaquetado"
        ]
    }
