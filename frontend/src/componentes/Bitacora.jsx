import React, { useState } from 'react';

/**
 * Componente del Módulo 3: Bitácora.
 * Rediseñado con la estética Gótica-Cyberpunk de la interfaz Liazid Oussama.
 */
export default function Bitacora() {
  const [limiteTokens, setLimiteTokens] = useState(250);
  const [estaCargando, setEstaCargando] = useState(false);
  const [resumen, setResumen] = useState(null);
  const [lotes, setLotes] = useState([]);
  const [errorMensaje, setErrorMensaje] = useState('');
  const [loteAbierto, setLoteAbierto] = useState(null);

  const obtenerFechaFormateada = () => {
    const fecha = new Date();
    return fecha.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const ejecutarOptimizacion = async (e) => {
    if (e) e.preventDefault();
    
    if (limiteTokens < 50 || limiteTokens > 1000) {
      setErrorMensaje('El límite de tokens debe estar entre 50 y 1000.');
      return;
    }

    setErrorMensaje('');
    setEstaCargando(true);
    setResumen(null);
    setLotes([]);
    setLoteAbierto(null);

    try {
      const respuesta = await fetch('http://localhost:8000/bitacora/optimizar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'accept': 'application/json'
        },
        body: JSON.stringify({
          limite_tokens: parseInt(limiteTokens, 10)
        })
      });

      if (!respuesta.ok) {
        throw new Error('Error al conectar con el optimizador del servidor. Inténtalo de nuevo.');
      }

      const datos = await respuesta.json();
      setResumen(datos.resumen_financiero);
      setLotes(datos.lotes || []);
      
    } catch (error) {
      console.error('Error en optimización:', error);
      setErrorMensaje(error.message || 'Error de conexión.');
    } finally {
      setEstaCargando(false);
    }
  };

  const alternarLote = (id) => {
    setLoteAbierto(loteAbierto === id ? null : id);
  };

  return (
    <div className="w-full max-w-5xl mx-auto flex flex-col gap-8 animate-fade-in">
      
      {/* Panel Superior: Entrada de Límite de Tokens */}
      <div className="goth-card rounded-2xl p-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-[#800a0a]/10 border border-[#800a0a]/40 rounded-xl text-[#e61919] goth-glow-text">
              <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <div>
              <h2 className="text-2xl font-gothic tracking-widest text-slate-100 goth-glow-text">BITÁCORA</h2>
              <p className="text-sm text-slate-400 font-serif">Agrupa el dataset en lotes óptimos sin exceder el límite de tokens por lote.</p>
            </div>
          </div>

          {/* Formulario */}
          <form onSubmit={ejecutarOptimizacion} className="flex items-center gap-3 w-full md:w-auto">
            <div className="flex flex-col gap-1 w-full md:w-40">
              <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider font-serif">Límite de Tokens</label>
              <div className="flex items-center bg-black/80 border-2 border-[#800a0a]/60 rounded-xl overflow-hidden focus-within:border-[#e61919] transition">
                <input 
                  type="number" 
                  min="50" 
                  max="1000"
                  value={limiteTokens}
                  onChange={(e) => setLimiteTokens(e.target.value)}
                  disabled={estaCargando}
                  className="w-full bg-transparent px-3 py-3 text-sm text-slate-200 focus:outline-none text-center font-mono font-bold"
                />
              </div>
            </div>
            
            <button 
              type="submit"
              disabled={estaCargando}
              className="h-[46px] mt-5 px-6 bg-[#800a0a] hover:bg-[#e61919] text-white font-serif uppercase tracking-widest font-semibold rounded-xl text-sm transition duration-300 border border-[#e61919]/30 shadow-[0_4px_15px_rgba(128,10,10,0.4)] disabled:opacity-50"
            >
              {estaCargando ? 'Procesando...' : 'Optimizar Lotes'}
            </button>
          </form>
        </div>
        {errorMensaje && (
          <p className="text-xs text-red-500 font-bold mt-3 font-mono">{errorMensaje}</p>
        )}
      </div>

      {/* Grid de Resultados */}
      {resumen && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Columna Izquierda: Listado de Lotes (7 cols) */}
          <div className="lg:col-span-7 flex flex-col gap-4">
            <h3 className="text-xs font-serif font-bold uppercase tracking-widest text-slate-500 px-1">
              ✠ Lotes Resultantes ({lotes.length}) ✠
            </h3>
            
            <div className="flex flex-col gap-3">
              {lotes.map((lote) => {
                const estaAbierto = loteAbierto === lote.lote_id;
                
                return (
                  <div 
                    key={lote.lote_id}
                    className="bg-[#0c0202]/80 border-2 border-[#800a0a]/60 rounded-xl overflow-hidden shadow-md transition-all duration-300 hover:border-[#800a0a]"
                  >
                    {/* Cabecera del Acordeón */}
                    <button 
                      onClick={() => alternarLote(lote.lote_id)}
                      className="w-full flex items-center justify-between p-5 text-left focus:outline-none hover:bg-[#800a0a]/10"
                    >
                      <div className="flex items-center gap-4">
                        <span className="w-8 h-8 rounded-lg bg-[#800a0a]/20 border border-[#800a0a]/50 flex items-center justify-center text-xs font-bold text-[#e61919] font-mono shadow-[0_0_8px_rgba(230,25,25,0.3)]">
                          #{lote.lote_id}
                        </span>
                        <div>
                          <h4 className="text-sm font-serif font-semibold text-slate-200 tracking-wide">
                            Lote {lote.lote_id}
                          </h4>
                          <p className="text-xs text-slate-500 font-mono mt-0.5">
                            {lote.tokens_utilizados} / {limiteTokens} tokens
                          </p>
                        </div>
                      </div>

                      {/* Barra de Progreso y Flecha */}
                      <div className="flex items-center gap-6">
                        <div className="hidden sm:flex flex-col items-end gap-1.5 w-24">
                          <span className="text-[10px] text-slate-500 font-bold uppercase font-serif">{lote.eficiencia.toFixed(0)}% Lleno</span>
                          <div className="w-full h-1.5 bg-[#0c0202] border border-[#800a0a]/30 rounded-full overflow-hidden">
                            <div 
                              className={`h-full rounded-full transition-all duration-500 ${
                                lote.eficiencia > 90 ? 'bg-[#e61919] shadow-[0_0_8px_#e61919]' : lote.eficiencia > 60 ? 'bg-[#9a4dff] shadow-[0_0_8px_#9a4dff]' : 'bg-amber-600'
                              }`}
                              style={{ width: `${lote.eficiencia}%` }}
                            />
                          </div>
                        </div>
                        <svg 
                          className={`w-5 h-5 text-slate-500 transition-transform duration-300 ${estaAbierto ? 'rotate-180 text-[#e61919]' : ''}`} 
                          fill="none" 
                          viewBox="0 0 24 24" 
                          stroke="currentColor" 
                          strokeWidth="2"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </button>

                    {/* Contenido Desplegable (Citas en el lote) */}
                    {estaAbierto && (
                      <div className="border-t border-[#800a0a]/40 bg-[#0c0202]/40 p-5 flex flex-col gap-4">
                        <h5 className="text-[10px] text-[#e61919] font-serif font-bold uppercase tracking-widest">Citas Contenidas ({lote.citas.length})</h5>
                        
                        <div className="flex flex-col gap-3">
                          {lote.citas.map((cita, cIdx) => (
                            <div 
                              key={cIdx} 
                              className="bg-black/60 border border-[#800a0a]/40 p-4 rounded-lg flex flex-col justify-between gap-3 hover:border-[#800a0a]/80 transition"
                            >
                              <p className="text-xs text-slate-300 italic leading-relaxed font-sans">
                                “{cita.frase}”
                              </p>
                              <div className="flex items-center justify-between border-t border-[#800a0a]/20 pt-2.5">
                                <span className="text-xs text-[#e61919] font-bold font-serif">
                                  — {cita.autor}
                                </span>
                                <span className="text-[10px] font-mono text-slate-500 font-bold bg-[#0c0202] px-2 py-0.5 rounded border border-[#800a0a]/40">
                                  {cita.tokens} tokens
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Columna Derecha: Recibo de Facturación Gótico (5 cols) */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            <h3 className="text-xs font-serif font-bold uppercase tracking-widest text-slate-500 px-1">
              ✠ Recibo de Simulación Gótico ✠
            </h3>

            {/* Recibo Gótico Térmico */}
            <div className="bg-[#0c0202]/90 border-2 border-[#800a0a] rounded-2xl p-6 shadow-2xl relative overflow-hidden text-slate-300 font-mono text-sm leading-relaxed border-t-[6px] border-t-[#e61919]">
              
              {/* Encabezado del Recibo */}
              <div className="text-center pb-6 border-b border-dashed border-[#800a0a]/40">
                <h4 className="text-base font-gothic tracking-widest text-slate-100 goth-glow-text">RESONANCE DATA CORP</h4>
                <p className="text-[10px] text-slate-500 mt-1 uppercase font-serif">Optimizador / Simulación de Lotes</p>
                <p className="text-[10px] text-slate-500 font-semibold mt-0.5">{obtenerFechaFormateada()}</p>
                <p className="text-[10px] text-slate-600 font-semibold mt-1">RECIBO NO: #GOTH-{Math.floor(100000 + Math.random() * 900000)}</p>
              </div>

              {/* Cuerpo del Recibo */}
              <div className="py-6 border-b border-dashed border-[#800a0a]/40 flex flex-col gap-4 text-xs">
                
                <div className="flex items-center justify-between">
                  <span>Lotes de Red Generados:</span>
                  <span className="font-bold text-slate-200">{resumen.total_lotes} x Lote</span>
                </div>
                
                <div className="flex items-center justify-between pl-4 text-[11px] text-slate-500">
                  <span>Cargo Fijo por Petición:</span>
                  <span>$0.0050 USD</span>
                </div>

                <div className="flex items-center justify-between border-t border-[#800a0a]/20 pt-3">
                  <span>Tokens Totales Procesados:</span>
                  <span className="font-bold text-slate-200">{resumen.total_tokens} tokens</span>
                </div>

                <div className="flex items-center justify-between pl-4 text-[11px] text-slate-500">
                  <span>Tarifa por Token:</span>
                  <span>$0.000020 USD</span>
                </div>

                <div className="flex items-center justify-between border-t border-[#800a0a]/20 pt-3 text-[11px]">
                  <span>Eficiencia de Compactación:</span>
                  <span className="font-bold text-[#e61919]">{resumen.eficiencia_promedio}%</span>
                </div>
              </div>

              {/* Subtotales */}
              <div className="py-6 border-b border-dashed border-[#800a0a]/40 flex flex-col gap-2 text-xs text-slate-500">
                <div className="flex items-center justify-between">
                  <span>Subtotal Coste Fijo:</span>
                  <span className="text-slate-400">${resumen.coste_fijo_total.toFixed(4)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Subtotal Coste Variable:</span>
                  <span className="text-slate-400">${resumen.coste_tokens_total.toFixed(6)}</span>
                </div>
              </div>

              {/* Gran Total */}
              <div className="pt-6 pb-2 text-center">
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest block mb-2 font-serif">Total de la Plegaria</span>
                <span className="text-2xl font-bold text-[#e61919] goth-glow-text tracking-wider">
                  ${resumen.coste_final_total.toFixed(6)} <span className="text-xs text-slate-500 font-normal">USD</span>
                </span>
                <span className="block text-[8px] text-slate-600 font-semibold uppercase mt-4 tracking-widest font-serif">
                  ✠ GRACIAS POR COBRAR CON BITACORA ✠
                </span>
              </div>
              
              {/* Adornos del borde de corte de papel térmico gótico */}
              <div className="absolute bottom-0 left-0 right-0 h-1.5 flex overflow-hidden select-none pointer-events-none">
                {Array.from({ length: 40 }).map((_, i) => (
                  <div 
                    key={i} 
                    className="w-4 h-4 bg-black border border-[#800a0a]/40 rotate-45 transform origin-top-left -mt-2"
                  />
                ))}
              </div>

            </div>
          </div>

        </div>
      )}

      {/* Pantalla Informativa Inicial */}
      {!estaCargando && !resumen && (
        <div className="text-center py-12 text-slate-600 font-serif tracking-widest text-sm bg-black/40 border border-[#800a0a]/20 rounded-2xl">
          ✠ Ingresa el límite de tokens para calcular el coste del lote gótico ✠
        </div>
      )}

      {/* Pantalla de Carga Gótica */}
      {estaCargando && (
        <div className="goth-card rounded-2xl p-12 flex flex-col items-center justify-center gap-4 text-center">
          <div className="w-10 h-10 border-4 border-[#800a0a]/20 border-t-[#e61919] rounded-full animate-spin shadow-[0_0_10px_rgba(230,25,25,0.4)]"></div>
          <p className="text-sm font-serif uppercase tracking-widest text-[#e61919] goth-glow-text">Empaquetando citas con First-Fit Decreasing...</p>
        </div>
      )}

    </div>
  );
}
