import React, { useState } from 'react';

/**
 * Componente del Módulo 1: Espejo (Buscador de Vibras).
 * Rediseñado con la estética Gótica-Cyberpunk de la interfaz Liazid Oussama.
 */
export default function Espejo() {
  const [consultaTexto, setConsultaTexto] = useState('');
  const [estaCargando, setEstaCargando] = useState(false);
  const [citasResultados, setCitasResultados] = useState([]);
  const [errorMensaje, setErrorMensaje] = useState('');

  const ejecutarBusqueda = async (evento) => {
    evento.preventDefault();
    
    if (consultaTexto.trim().length < 3) {
      setErrorMensaje('Por favor, escribe una situación o emoción de al menos 3 caracteres.');
      return;
    }

    setErrorMensaje('');
    setEstaCargando(true);
    setCitasResultados([]);

    try {
      const respuesta = await fetch('http://localhost:8000/espejo/buscar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'accept': 'application/json'
        },
        body: JSON.stringify({
          consulta: consultaTexto,
          limite: 3
        })
      });

      if (!respuesta.ok) {
        if (respuesta.status === 422) {
          throw new Error('La consulta ingresada no cumple con las reglas del servidor (mínimo 3 caracteres).');
        }
        throw new Error('Hubo un problema al obtener las citas del servidor. Por favor, inténtalo de nuevo.');
      }

      const datos = await respuesta.json();
      setCitasResultados(datos.resultados || []);
    } catch (error) {
      console.error('Error en búsqueda semántica:', error);
      setErrorMensaje(error.message || 'Error de conexión con el servidor. Asegúrate de que el backend está corriendo.');
    } finally {
      setEstaCargando(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col gap-8 animate-fade-in">
      
      {/* Tarjeta de control de búsqueda Gótica */}
      <div className="goth-card rounded-2xl p-8">
        <div className="flex items-center gap-4 mb-6">
          <div className="p-3 bg-[#800a0a]/10 border border-[#800a0a]/40 rounded-xl text-[#e61919] goth-glow-text">
            {/* Icono de Espejo Gótico */}
            <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.114 5.636a9 9 0 010 12.728M16.463 8.288a5.25 5.25 0 010 7.424M6.75 8.25l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75z" />
            </svg>
          </div>
          <div>
            <h2 className="text-2xl font-gothic tracking-widest text-slate-100 goth-glow-text">ESPEJO</h2>
            <p className="text-sm text-slate-400 font-serif">Introduce tu emoción o estado mental para reflejarlo en pensamientos célebres.</p>
          </div>
        </div>

        {/* Formulario de Consulta */}
        <form onSubmit={ejecutarBusqueda} className="flex flex-col gap-3">
          <div className="flex flex-col sm:flex-row gap-3">
            <input 
              type="text" 
              value={consultaTexto}
              onChange={(e) => setConsultaTexto(e.target.value)}
              placeholder="Ej: Siento que el tiempo vuela y no he logrado mis metas..."
              className="flex-1 bg-black/80 border-2 border-[#800a0a]/60 rounded-xl px-5 py-3.5 text-sm text-slate-200 placeholder-slate-700 focus:outline-none focus:border-[#e61919] focus:ring-1 focus:ring-[#e61919]/30 transition-all duration-300 font-sans"
            />
            <button 
              type="submit"
              disabled={estaCargando}
              className="bg-[#800a0a] hover:bg-[#e61919] text-white font-serif uppercase tracking-widest font-semibold px-8 py-3.5 rounded-xl text-sm transition-all duration-300 border border-[#e61919]/30 shadow-[0_4px_15px_rgba(128,10,10,0.4)] hover:shadow-[0_4px_20px_rgba(230,25,25,0.6)] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Reflejar
            </button>
          </div>
          
          {errorMensaje && (
            <p className="text-xs text-red-500 font-bold ml-1 mt-1 font-mono">{errorMensaje}</p>
          )}
        </form>
      </div>

      {/* Skeleton Loader de Carga al estilo Gótico */}
      {estaCargando && (
        <div className="grid grid-cols-1 gap-4">
          {[1, 2, 3].map((num) => (
            <div 
              key={num} 
              className="animate-pulse bg-[#0c0202]/80 border-2 border-[#800a0a]/30 rounded-2xl p-6 flex flex-col gap-3 shadow-[inset_0_0_10px_rgba(128,10,10,0.15)]"
            >
              <div className="h-5 bg-[#800a0a]/20 rounded-md w-3/4"></div>
              <div className="h-4 bg-[#800a0a]/10 rounded-md w-1/4"></div>
              <div className="flex gap-2 mt-2">
                <div className="h-6 bg-[#800a0a]/10 rounded-full w-16"></div>
                <div className="h-6 bg-[#800a0a]/10 rounded-full w-20"></div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Resultados de Citas Reflejadas */}
      {!estaCargando && citasResultados.length > 0 && (
        <div className="flex flex-col gap-5">
          <h3 className="text-xs font-serif uppercase tracking-widest text-[#e61919] goth-glow-text px-1">
            ✠ Pensamientos Reflejados ✠
          </h3>
          
          <div className="grid grid-cols-1 gap-5">
            {citasResultados.map((c, indice) => {
              const afinidadPorcentaje = (c.similitud * 100).toFixed(1);
              
              return (
                <div 
                  key={indice}
                  className="goth-card rounded-2xl p-6 shadow-lg transition-all duration-300 flex flex-col md:flex-row justify-between gap-4"
                >
                  <div className="flex-1 flex flex-col gap-3">
                    <p className="text-base text-slate-100 italic leading-relaxed font-sans">
                      "{c.frase}"
                    </p>
                    
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="text-sm text-[#e61919] font-bold font-serif">
                        — {c.autor}
                      </span>
                      
                      <div className="flex flex-wrap gap-1.5">
                        {c.tags.map((tag, tagIdx) => (
                          <span 
                            key={tagIdx} 
                            className="bg-[#250505] text-slate-300 border border-[#800a0a]/50 px-2 py-0.5 rounded-md text-[10px] font-mono font-semibold"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Indicador de Afinidad Semántica con círculo brillante */}
                  <div className="flex flex-col justify-center items-center shrink-0 border-t md:border-t-0 md:border-l border-[#800a0a]/50 pt-3 md:pt-0 md:pl-8 text-center min-w-[120px]">
                    <span className="text-[10px] text-slate-500 uppercase font-serif tracking-widest mb-1.5 block">
                      Afinidad
                    </span>
                    <span className="text-2xl font-extrabold text-[#e61919] goth-glow-text font-mono">
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
        <div className="text-center py-12 text-slate-600 font-serif tracking-widest text-sm bg-black/40 border border-[#800a0a]/20 rounded-2xl">
          ✠ Ingresa tu sentir en la barra para reflejarlo en las citas célebres ✠
        </div>
      )}

    </div>
  );
}
