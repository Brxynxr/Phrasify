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
