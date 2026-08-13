import { useState } from 'react'

/**
 * Componente principal de la aplicación.
 * Representa la SPA "Resonancia" y sirve como contenedor principal.
 */
function App() {
  return (
    <div className="min-height-screen bg-slate-900 text-slate-100 flex flex-col items-center justify-center p-8 font-sans">
      <header className="text-center max-w-2xl">
        <h1 className="text-5xl font-extrabold tracking-tight mb-4 bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">
          Resonancia
        </h1>
        <p className="text-lg text-slate-400 mb-8">
          SPA que reúne 3 retos técnicos independientes (Buscador de Vibras, Orador de Debates y Optimizador de Presupuesto) compartiendo un dataset de citas.
        </p>
      </header>

      <main className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl w-full">
        {/* Módulo 1 */}
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 shadow-xl hover:border-violet-500 transition duration-300">
          <h2 className="text-xl font-bold text-violet-400 mb-2">Buscador de Vibras</h2>
          <p className="text-slate-400 text-sm">
            Búsqueda semántica de citas por emoción/situación sin keyword matching usando embeddings.
          </p>
        </div>

        {/* Módulo 2 */}
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 shadow-xl hover:border-indigo-500 transition duration-300">
          <h2 className="text-xl font-bold text-indigo-400 mb-2">Orador de Debates</h2>
          <p className="text-slate-400 text-sm">
            Mini-ensayo argumentativo condicionado estrictamente a citar frases reales recuperadas.
          </p>
        </div>

        {/* Módulo 3 */}
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 shadow-xl hover:border-emerald-500 transition duration-300">
          <h2 className="text-xl font-bold text-emerald-400 mb-2">Optimizador de Lotes</h2>
          <p className="text-slate-400 text-sm">
            Algoritmo de bin-packing para agrupar frases por límite de tokens y generar recibo de consumo.
          </p>
        </div>
      </main>

      <footer className="mt-12 text-slate-500 text-sm">
        Resonancia &copy; 2026 - Desarrollo en Curso
      </footer>
    </div>
  )
}

export default App
