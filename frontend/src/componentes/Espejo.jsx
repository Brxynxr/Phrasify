import React, { useState } from 'react';

/**
 * Componente del Módulo 1: Espejo (Buscador de Vibras).
 * Interfaz interactiva de búsqueda semántica.
 */
export default function Espejo() {
  // Estados reactivos con nomenclatura descriptiva en español
  const [consultaTexto, setConsultaTexto] = useState('');
  const [estaCargando, setEstaCargando] = useState(false);
  const [citasResultados, setCitasResultados] = useState([]);
  const [errorMensaje, setErrorMensaje] = useState('');

  // Simulación de búsqueda semántica con retardo para testing visual (Fase 4)
  const ejecutarBusquedaMock = (evento) => {
    evento.preventDefault();
    
    // Validación de longitud mínima (coincidiendo con las reglas del backend)
    if (consultaTexto.trim().length < 3) {
      setErrorMensaje('Por favor, escribe una situación o emoción de al menos 3 caracteres.');
      return;
    }

    setErrorMensaje('');
    setEstaCargando(true);
    setCitasResultados([]);

    // Simular retraso de red de 1.2 segundos para ver el skeleton loader
    setTimeout(() => {
      const citasFicticias = [
        {
          frase: "I have not failed. I've just found 10,000 ways that won't work.",
          autor: "Thomas A. Edison",
          tags: ["edison", "failure", "inspirational", "paraphrased"],
          similitud: 0.5806
        },
        {
          frase: "It is impossible to live without failing at something, unless you live so cautiously that you might as well not have lived at all - in which case, you fail by default.",
          autor: "J.K. Rowling",
          tags: ["failure", "inspirational", "life"],
          similitud: 0.5296
        },
        {
          frase: "Try not to become a man of success. Rather become a man of value.",
          autor: "Albert Einstein",
          tags: ["adulthood", "success", "value"],
          similitud: 0.4236
        }
      ];

      setCitasResultados(citasFicticias);
      setEstaCargando(false);
    }, 1200);
  };

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col gap-8 animate-fade-in">
      
      {/* Tarjeta de control de búsqueda */}
      <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800/80 rounded-2xl p-8 shadow-2xl">
        <div className="flex items-center gap-4 mb-6">
          <div className="p-3 bg-violet-500/10 border border-violet-500/30 rounded-xl text-violet-400">
            {/* Icono de Espejo / Ondas Sonoras */}
            <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.114 5.636a9 9 0 010 12.728M16.463 8.288a5.25 5.25 0 010 7.424M6.75 8.25l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75z" />
            </svg>
          </div>
          <div>
            <h2 className="text-2xl font-bold tracking-wide text-slate-100">Espejo</h2>
            <p className="text-sm text-slate-400">Introduce tu emoción o estado mental para reflejarlo en pensamientos célebres.</p>
          </div>
        </div>

        {/* Formulario de Consulta */}
        <form onSubmit={ejecutarBusquedaMock} className="flex flex-col gap-3">
          <div className="flex flex-col sm:flex-row gap-3">
            <input 
              type="text" 
              value={consultaTexto}
              onChange={(e) => setConsultaTexto(e.target.value)}
              placeholder="Ej: Me siento abrumado por los retos cotidianos..."
              className="flex-1 bg-slate-950/40 border border-slate-800 rounded-xl px-5 py-3.5 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/30 transition-all duration-300"
            />
            <button 
              type="submit"
              disabled={estaCargando}
              className="bg-violet-600 hover:bg-violet-500 text-white font-semibold px-8 py-3.5 rounded-xl text-sm transition-all duration-300 shadow-[0_4px_20px_rgba(139,92,246,0.3)] hover:shadow-[0_4px_25px_rgba(139,92,246,0.5)] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Reflejar
            </button>
          </div>
          
          {/* Mensaje de error de validación */}
          {errorMensaje && (
            <p className="text-xs text-red-400 ml-1 mt-1 font-medium">{errorMensaje}</p>
          )}
        </form>
      </div>

      {/* Renderizado Condicional: Skeleton Loader de Carga */}
      {estaCargando && (
        <div className="grid grid-cols-1 gap-4">
          {[1, 2, 3].map((num) => (
            <div 
              key={num} 
              className="animate-pulse bg-slate-900/30 border border-slate-850 rounded-2xl p-6 flex flex-col gap-3"
            >
              <div className="h-5 bg-slate-800/80 rounded-md w-3/4"></div>
              <div className="h-4 bg-slate-800/50 rounded-md w-1/4"></div>
              <div className="flex gap-2 mt-2">
                <div className="h-6 bg-slate-800/40 rounded-full w-16"></div>
                <div className="h-6 bg-slate-800/40 rounded-full w-20"></div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Renderizado Condicional: Lista de Resultados */}
      {!estaCargando && citasResultados.length > 0 && (
        <div className="flex flex-col gap-5">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-violet-400 px-1">
            Pensamientos Reflejados
          </h3>
          
          <div className="grid grid-cols-1 gap-5">
            {citasResultados.map((c, indice) => {
              // Convertir el score de similitud coseno (-1 a 1) en un porcentaje legible
              const afinidadPorcentaje = (c.similitud * 100).toFixed(1);
              
              return (
                <div 
                  key={indice}
                  className="bg-slate-900/40 border border-slate-800/80 hover:border-violet-500/40 rounded-2xl p-6 shadow-lg transition-all duration-300 group flex flex-col md:flex-row justify-between gap-4"
                >
                  <div className="flex-1 flex flex-col gap-3">
                    {/* Cuerpo de la frase */}
                    <p className="text-base text-slate-100 italic leading-relaxed font-medium">
                      “{c.frase}”
                    </p>
                    
                    <div className="flex flex-wrap items-center gap-3">
                      {/* Autor */}
                      <span className="text-sm text-violet-400 font-bold">
                        — {c.autor}
                      </span>
                      
                      <div className="flex flex-wrap gap-1.5">
                        {/* Etiquetas */}
                        {c.tags.map((tag, tagIdx) => (
                          <span 
                            key={tagIdx} 
                            className="bg-slate-950/80 text-violet-300/80 border border-violet-950 px-2 py-0.5 rounded-md text-[10px] font-semibold"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Indicador de Afinidad Semántica */}
                  <div className="flex flex-col justify-center items-end shrink-0 border-t md:border-t-0 md:border-l border-slate-800/60 pt-3 md:pt-0 md:pl-6 text-right">
                    <span className="text-xs text-slate-500 uppercase font-bold tracking-wider mb-1">
                      Afinidad Semántica
                    </span>
                    <span className="text-2xl font-extrabold text-violet-400 font-mono">
                      {afinidadPorcentaje}%
                    </span>
                  </div>

                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Mensaje Informativo Inicial */}
      {!estaCargando && citasResultados.length === 0 && (
        <div className="text-center py-8 text-slate-500 text-sm">
          Ingresa una vibración o emoción arriba para reflejarla en la citas célebres.
        </div>
      )}

    </div>
  );
}
