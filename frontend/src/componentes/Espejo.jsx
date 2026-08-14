import React from 'react';

/**
 * Componente del Módulo 1: Espejo.
 * Ofrece la interfaz para realizar búsquedas semánticas de citas (Buscador de Vibras).
 * Refleja tu emoción en forma de cita ajena, sin que compartan ni una palabra.
 */
export default function Espejo() {
  return (
    <div className="w-full max-w-4xl mx-auto bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-2xl p-8 shadow-2xl animate-fade-in">
      <div className="flex items-center gap-4 mb-6">
        <div className="p-3 bg-violet-500/10 border border-violet-500/30 rounded-xl text-violet-400">
          <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.114 5.636a9 9 0 010 12.728M16.463 8.288a5.25 5.25 0 010 7.424M6.75 8.25l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75z" />
          </svg>
        </div>
        <div>
          <h2 className="text-2xl font-bold text-slate-100 tracking-wide">Espejo</h2>
          <p className="text-sm text-slate-400">Buscador de Vibras: Refleja tu emoción en citas afines.</p>
        </div>
      </div>

      <div className="border border-dashed border-slate-800 rounded-xl p-12 text-center">
        <p className="text-slate-400 mb-6 max-w-md mx-auto">
          Escribe tu situación actual, emoción o pensamiento. Este módulo te devolverá citas que reflejen exactamente tu estado de ánimo mediante similitud semántica, sin coincidencia literal de palabras.
        </p>
        
        {/* Simulación de interfaz de búsqueda */}
        <div className="max-w-md mx-auto flex gap-3">
          <input 
            type="text" 
            placeholder="Ej: Me siento nostálgico recordando viejos tiempos..."
            disabled
            className="flex-1 bg-slate-950/50 border border-slate-800 rounded-lg px-4 py-2.5 text-sm text-slate-500 placeholder-slate-600 focus:outline-none cursor-not-allowed"
          />
          <button 
            disabled 
            className="bg-violet-600/50 text-violet-300 font-medium px-5 py-2.5 rounded-lg text-sm cursor-not-allowed"
          >
            Reflejar
          </button>
        </div>
      </div>
    </div>
  );
}
