import React from 'react';

/**
 * Componente del Módulo 1: Buscador de Vibras.
 * Ofrece la interfaz para realizar búsquedas semánticas de citas.
 */
export default function BuscadorVibras() {
  return (
    <div className="w-full max-w-4xl mx-auto bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-2xl p-8 shadow-2xl animate-fade-in">
      <div className="flex items-center gap-4 mb-6">
        <div className="p-3 bg-violet-500/10 border border-violet-500/30 rounded-xl text-violet-400">
          <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.114 5.636a9 9 0 010 12.728M16.463 8.288a5.25 5.25 0 010 7.424M6.75 8.25l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75z" />
          </svg>
        </div>
        <div>
          <h2 className="text-2xl font-bold text-slate-100 tracking-wide">Buscador de Vibras</h2>
          <p className="text-sm text-slate-400">Búsqueda semántica por emoción o situación conceptual.</p>
        </div>
      </div>

      <div className="border border-dashed border-slate-800 rounded-xl p-12 text-center">
        <p className="text-slate-400 mb-6 max-w-md mx-auto">
          Este módulo procesa tu entrada de texto libre y busca las frases con mayor afinidad conceptual sin realizar coincidencia de palabras clave.
        </p>
        
        {/* Simulación de interfaz del buscador */}
        <div className="max-w-md mx-auto flex gap-3">
          <input 
            type="text" 
            placeholder="Ej: Me siento melancólico un domingo por la tarde..."
            disabled
            className="flex-1 bg-slate-950/50 border border-slate-800 rounded-lg px-4 py-2.5 text-sm text-slate-500 placeholder-slate-600 focus:outline-none cursor-not-allowed"
          />
          <button 
            disabled 
            className="bg-violet-600/50 text-violet-300 font-medium px-5 py-2.5 rounded-lg text-sm cursor-not-allowed"
          >
            Buscar
          </button>
        </div>
      </div>
    </div>
  );
}
