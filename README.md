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

1. **Buscador de Vibras (Módulo 1)**:
   - Búsqueda semántica de citas basada en emociones o situaciones abstractas sin keyword matching directo.
   - Generación de embeddings utilizando `sentence-transformers` y cálculo de similitud coseno.
   
2. **Orador de Debates Respaldado (Módulo 2)**:
   - Generación de mini-ensayos filosóficos apoyados por IA (Gemini/Ollama) utilizando citas textuales del dataset como base.
   - Restricción de contenido para evitar la invención de fuentes si no se alcanzan umbrales mínimos de relevancia.

3. **Optimizador de Presupuesto y Empaquetado (Módulo 3)**:
   - Agrupación óptima de frases en lotes (bin-packing) respetando un límite estricto de tokens.
   - Simulación de peticiones y generación de un "recibo" de consumo detallado.

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
