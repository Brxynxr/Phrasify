import sys
import os
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# Asegurar que el directorio raíz del backend esté en el PYTHONPATH para importes locales consistentes
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from cargador_datos import cargar_dataset_maestro
from servicios.buscador_semantico import obtener_modelo
from servicios.cliente_http import cerrar_cliente_http
from rutas.espejo import enrutador_espejo
from rutas.tribuna import enrutador_tribuna
from rutas.bitacora import enrutador_bitacora

@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Context Manager para el ciclo de vida de la aplicación FastAPI.
    Al arrancar:
      1. Carga el dataset maestro (.xlsx) y embeddings en memoria.
      2. Pre-carga el modelo SentenceTransformer para que la primera
         consulta del usuario sea tan rápida como las siguientes.
    Al apagar:
      3. Cierra el cliente HTTP global reutilizable.
    """
    try:
        cargar_dataset_maestro()
        print("Servidor: Pre-cargando modelo de embeddings en memoria...")
        obtener_modelo()
        print("Servidor: Modelo de embeddings listo.")
    except Exception as e:
        print(f"ERROR CRÍTICO durante el arranque del servidor: {e}")
    yield
    # Apagado limpio: cerrar el pool de conexiones HTTP
    await cerrar_cliente_http()
    print("Servidor apagándose...")

# Inicialización de la aplicación FastAPI asociando el ciclo de vida lifespan
aplicacion = FastAPI(
    title="Resonancia API",
    description="Servidor Backend modular para la SPA Resonancia, conectando Espejo, Tribuna y Bitácora.",
    version="1.0.0",
    lifespan=lifespan
)

# Configuración de CORS para permitir peticiones desde el frontend (Vite por defecto en puerto 5173)
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

# Incluir los enrutadores específicos de cada módulo
aplicacion.include_router(enrutador_espejo)
aplicacion.include_router(enrutador_tribuna)
aplicacion.include_router(enrutador_bitacora)

# Ruta base para verificar el estado del servidor
@aplicacion.get("/", tags=["Estado"])
def verificar_estado():
    """
    Endpoint simple para verificar que el servidor de Resonancia y todos sus routers estén activos.
    """
    return {
        "estado": "activo",
        "mensaje": "Servidor de Resonancia funcionando correctamente",
        "modulos": {
            "Modulo 1": "Espejo (Buscador de Vibras)",
            "Modulo 2": "Tribuna (Orador de Debates Respaldado)",
            "Modulo 3": "Bitácora (Optimizador de Presupuesto y Empaquetado)"
        }
    }
