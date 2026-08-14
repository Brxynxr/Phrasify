# Resonancia 🌟

Resonancia es una SPA (Single Page Application) que reúne 3 retos técnicos independientes sobre un mismo dataset maestro de citas (frases, autores y tags) obtenido mediante scraping de https://quotes.toscrape.com. Cada reto representa un módulo con su propio diseño y lógica de negocio.

---

## 🛠️ Estructura del Proyecto (Monorepo)

```text
proyect/
├── backend/                  # Servidor de API en FastAPI (Python)
│   ├── datos/               # Directorio de almacenamiento de datos
│   │   └── citas_maestro.xlsx # Dataset maestro procesado
│   ├── servidor.py          # Punto de entrada de FastAPI
│   └── requirements.txt     # Dependencias de Python
├── frontend/                 # Aplicación de interfaz de usuario en React (Vite)
│   ├── src/                 # Código fuente de React
│   │   ├── App.jsx          # Componente principal
│   │   ├── index.css        # Configuración de Tailwind CSS v4
│   │   └── main.jsx         # Punto de entrada de React
│   ├── package.json         # Dependencias del frontend
│   └── vite.config.js       # Configuración de Vite con Tailwind v4
└── README.md                 # Documentación del proyecto (este archivo)
```

---

## 🚀 Módulos del Proyecto

1. **Espejo (Módulo 1 — Buscador de Vibras)**:
   - Búsqueda semántica de citas basada en emociones o situaciones abstractas sin keyword matching directo.
   - Refleja tu emoción en forma de cita ajena. Genera embeddings utilizando `sentence-transformers` y calcula similitud coseno.
   
2. **Tribuna (Módulo 2 — Orador de Debates Respaldado)**:
   - Generación de mini-ensayos filosóficos apoyados por IA (Gemini/Ollama) utilizando citas textuales del dataset como base.
   - El espacio para argumentar con fuentes reales sin invención ni alucinación de referencias.

3. **Bitácora (Módulo 3 — Optimizador de Presupuesto y Empaquetado)**:
   - Agrupación óptima de frases en lotes (bin-packing) respetando un límite estricto de tokens.
   - Registro de consumo simulado y desglose de tokens utilizados y lotes formados.

---

## 📦 Instalación y Configuración

### Backend

1. Navegar al directorio `backend`:
   ```bash
   cd backend
   ```
2. Crear un entorno virtual:
   ```bash
   python3 -m venv .venv
   source .venv/bin/activate
   ```
3. Instalar dependencias:
   ```bash
   pip install -r requirements.txt
   ```
4. Ejecutar el servidor de desarrollo:
   ```bash
   fastapi dev servidor.py
   ```

### Frontend

1. Navegar al directorio `frontend`:
   ```bash
   cd frontend
   ```
2. Instalar dependencias de Node:
   ```bash
   npm install
   ```
3. Ejecutar el servidor de desarrollo de Vite:
   ```bash
   npm run dev
   ```

---

## 📜 Historial de Cambios / Fases

### Módulo 0 — Cimientos compartidos
* **Fase 1**: Estructura del monorepo (`frontend/`, `backend/`), inicialización de Vite + Tailwind CSS v4, inicialización de FastAPI y README inicial.
* **Fase 2**: Migración y mejora del scraper de `main.ipynb` a un script reutilizable de Python ([extractor_citas.py](file:///home/bmanga/Escritorio/proyect/backend/extractor_citas.py)), corrigiendo el bug de la paginación y agregando la extracción dinámica de etiquetas (tags).
* **Fase 3**: Procesamiento de los datos obtenidos y exportación en formato de hoja de cálculo mediante pandas en el dataset maestro ([citas_maestro.xlsx](file:///home/bmanga/Escritorio/proyect/backend/datos/citas_maestro.xlsx)). Definiendo rutas relativas en [generar_dataset.py](file:///home/bmanga/Escritorio/proyect/backend/generar_dataset.py) para su consistencia.
* **Fase 4**: Diseño e implementación del Shell de Navegación de la SPA ([App.jsx](file:///home/bmanga/Escritorio/proyect/frontend/src/App.jsx)), creando las vistas contenedoras iniciales ([Espejo.jsx](file:///home/bmanga/Escritorio/proyect/frontend/src/componentes/Espejo.jsx), [Tribuna.jsx](file:///home/bmanga/Escritorio/proyect/frontend/src/componentes/Tribuna.jsx), [Bitacora.jsx](file:///home/bmanga/Escritorio/proyect/frontend/src/componentes/Bitacora.jsx)) e integrando tipografía y estilos consistentes en Tailwind CSS v4.
* **Fase 5**: Implementación de la estructura base de la API en FastAPI, organizando enrutadores independientes en [backend/rutas/](file:///home/bmanga/Escritorio/proyect/backend/rutas/) (`espejo.py`, `tribuna.py`, `bitacora.py`), e integrando la carga asíncrona del dataset en memoria al arranque del servidor con [cargador_datos.py](file:///home/bmanga/Escritorio/proyect/backend/cargador_datos.py).
