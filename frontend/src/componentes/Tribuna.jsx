import React from 'react';

/**
 * Componente del Módulo 2: Tribuna.
 * Ofrece el espacio donde se argumentan mini-ensayos con respaldo de fuentes reales.
 */
export default function Tribuna() {
  return (
    <div className="w-full max-w-4xl mx-auto bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-2xl p-8 shadow-2xl animate-fade-in">
      <div className="flex items-center gap-4 mb-6">
        <div className="p-3 bg-indigo-500/10 border border-indigo-500/30 rounded-xl text-indigo-400">
          <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
        </div>
        <div>
          <h2 className="text-2xl font-bold text-slate-100 tracking-wide">Tribuna</h2>
          <p className="text-sm text-slate-400">Orador de Debates: Discursos argumentados basados estrictamente en citas reales.</p>
        </div>
      </div>

      <div className="border border-dashed border-slate-800 rounded-xl p-12 text-center">
        <p className="text-slate-400 mb-6 max-w-md mx-auto">
          Expón una tesis o pregunta de debate. Tribuna construirá una respuesta argumentada que cita textualmente autores célebres del dataset maestro, garantizando la veracidad de las fuentes y evitando alucinaciones.
        </p>

        {/* Simulación de interfaz */}
        <div className="max-w-md mx-auto flex flex-col gap-3">
          <textarea 
            placeholder="Ej: ¿Es el fracaso indispensable para alcanzar el éxito?"
            disabled
            rows="2"
            className="w-full bg-slate-950/50 border border-slate-800 rounded-lg p-3 text-sm text-slate-500 placeholder-slate-600 focus:outline-none cursor-not-allowed resize-none"
          />
          <button 
            disabled 
            className="bg-indigo-600/50 text-indigo-300 font-medium py-2.5 rounded-lg text-sm cursor-not-allowed"
          >
            Subir a la Tribuna
          </button>
        </div>
      </div>
    </div>
  );
}
