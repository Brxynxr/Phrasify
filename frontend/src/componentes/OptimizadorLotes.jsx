import React from 'react';

/**
 * Componente del Módulo 3: Optimizador de Presupuesto y Empaquetado.
 * Permite configurar límites de tokens y simular el bin-packing del dataset.
 */
export default function OptimizadorLotes() {
  return (
    <div className="w-full max-w-4xl mx-auto bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-2xl p-8 shadow-2xl animate-fade-in">
      <div className="flex items-center gap-4 mb-6">
        <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400">
          <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 14l2-2 4 4m0-7l-3-3-3 3m2 8h7a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2h3" />
          </svg>
        </div>
        <div>
          <h2 className="text-2xl font-bold text-slate-100 tracking-wide">Optimizador de Lotes</h2>
          <p className="text-sm text-slate-400">Algoritmo de bin-packing para empaquetamiento óptimo de frases por límites de tokens.</p>
        </div>
      </div>

      <div className="border border-dashed border-slate-800 rounded-xl p-12 text-center">
        <p className="text-slate-400 mb-6 max-w-md mx-auto">
          Configura un límite de tokens por lote y ejecuta el algoritmo para ordenar, agrupar y simular el procesamiento de todo el dataset maestro, estimando costos y número de peticiones.
        </p>

        {/* Simulación de interfaz del optimizador */}
        <div className="max-w-md mx-auto flex items-center justify-center gap-4">
          <div className="flex items-center gap-2">
            <label className="text-sm text-slate-500">Límite de Tokens:</label>
            <input 
              type="number" 
              placeholder="100"
              disabled
              className="w-24 bg-slate-950/50 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-500 placeholder-slate-600 focus:outline-none cursor-not-allowed text-center"
            />
          </div>
          <button 
            disabled 
            className="bg-emerald-600/50 text-emerald-300 font-medium px-5 py-2.5 rounded-lg text-sm cursor-not-allowed"
          >
            Optimizar Lotes
          </button>
        </div>
      </div>
    </div>
  );
}
