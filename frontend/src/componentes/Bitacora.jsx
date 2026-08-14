import React, { useState } from 'react';

/**
 * Componente del Módulo 3: Bitácora.
 * Ofrece la interfaz para configurar y analizar la optimización de lotes y el recibo de tokens.
 * Implementa el recibo estilo factura física y exploración interactiva de lotes.
 */
export default function Bitacora() {
  // Estados reactivos en español
  const [limiteTokens, setLimiteTokens] = useState(250);
  const [estaCargando, setEstaCargando] = useState(false);
  const [resumen, setResumen] = useState(null);
  const [lotes, setLotes] = useState([]);
  const [errorMensaje, setErrorMensaje] = useState('');
  const [loteAbierto, setLoteAbierto] = useState(null); // ID del lote abierto en el acordeón

  // Fecha del recibo dinámica
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
    if (loteAbierto === id) {
      setLoteAbierto(null);
    } else {
      setLoteAbierto(id);
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto flex flex-col gap-8 animate-fade-in">
      
      {/* Panel Superior: Entrada de Límite de Tokens */}
      <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800/80 rounded-2xl p-8 shadow-2xl">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400">
              <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <div>
              <h2 className="text-2xl font-bold tracking-wide text-slate-100">Bitácora</h2>
              <p className="text-sm text-slate-400">Agrupa el dataset en lotes óptimos sin exceder el límite de tokens por lote.</p>
            </div>
          </div>

          {/* Formulario */}
          <form onSubmit={ejecutarOptimizacion} className="flex items-center gap-3 w-full md:w-auto">
            <div className="flex flex-col gap-1 w-full md:w-40">
              <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Límite de Tokens</label>
              <div className="flex items-center bg-slate-950/40 border border-slate-800 rounded-xl overflow-hidden focus-within:border-emerald-500/40 transition">
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
              className="h-[46px] mt-5 px-6 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-xl text-sm transition duration-300 shadow-[0_4px_15px_rgba(16,185,129,0.2)] disabled:opacity-50"
            >
              {estaCargando ? 'Empaquetando...' : 'Optimizar Lotes'}
            </button>
          </form>
        </div>
        {errorMensaje && (
          <p className="text-xs text-red-400 font-medium mt-3">{errorMensaje}</p>
        )}
      </div>

      {/* Grid de Resultados */}
      {resumen && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Columna Izquierda: Listado de Lotes (8 cols) */}
          <div className="lg:col-span-7 flex flex-col gap-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 px-1">
              Lotes Resultantes del Empaquetado ({lotes.length})
            </h3>
            
            <div className="flex flex-col gap-3">
              {lotes.map((lote) => {
                const estaAbierto = loteAbierto === lote.lote_id;
                
                return (
                  <div 
                    key={lote.lote_id}
                    className="bg-slate-900/40 border border-slate-800 rounded-xl overflow-hidden shadow-md transition-all duration-300 hover:border-slate-700/60"
                  >
                    {/* Cabecera del Acordeón */}
                    <button 
                      onClick={() => alternarLote(lote.lote_id)}
                      className="w-full flex items-center justify-between p-5 text-left focus:outline-none hover:bg-slate-900/20"
                    >
                      <div className="flex items-center gap-4">
                        <span className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-xs font-bold text-emerald-400 font-mono">
                          #{lote.lote_id}
                        </span>
                        <div>
                          <h4 className="text-sm font-semibold text-slate-200">
                            Lote {lote.lote_id}
                          </h4>
                          <p className="text-xs text-slate-400 font-mono mt-0.5">
                            {lote.tokens_utilizados} / {limiteTokens} tokens
                          </p>
                        </div>
                      </div>

                      {/* Barra de Progreso y Flecha */}
                      <div className="flex items-center gap-6">
                        <div className="hidden sm:flex flex-col items-end gap-1.5 w-24">
                          <span className="text-[10px] text-slate-500 font-bold uppercase">{lote.eficiencia.toFixed(0)}% Lleno</span>
                          <div className="w-full h-1.5 bg-slate-950 rounded-full overflow-hidden">
                            <div 
                              className={`h-full rounded-full transition-all duration-500 ${
                                lote.eficiencia > 90 ? 'bg-emerald-500' : lote.eficiencia > 60 ? 'bg-indigo-500' : 'bg-amber-500'
                              }`}
                              style={{ width: `${lote.eficiencia}%` }}
                            />
                          </div>
                        </div>
                        <svg 
                          className={`w-5 h-5 text-slate-500 transition-transform duration-300 ${estaAbierto ? 'rotate-180 text-emerald-400' : ''}`} 
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
                      <div className="border-t border-slate-900 bg-slate-950/30 p-5 flex flex-col gap-4 animate-slide-down">
                        <h5 className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Citas Contenidas ({lote.citas.length})</h5>
                        
                        <div className="flex flex-col gap-3">
                          {lote.citas.map((cita, cIdx) => (
                            <div 
                              key={cIdx} 
                              className="bg-slate-900/30 border border-slate-900/60 p-4 rounded-lg flex flex-col justify-between gap-3 hover:border-slate-800 transition"
                            >
                              <p className="text-xs text-slate-300 italic leading-relaxed">
                                “{cita.frase}”
                              </p>
                              <div className="flex items-center justify-between border-t border-slate-900/50 pt-2.5">
                                <span className="text-xs text-emerald-400 font-bold">
                                  — {cita.autor}
                                </span>
                                <span className="text-[10px] font-mono text-slate-500 font-bold bg-slate-950 px-2 py-0.5 rounded border border-slate-900">
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

          {/* Columna Derecha: Recibo de Facturación Físico (5 cols) */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 px-1">
              Recibo Financiero de Simulación
            </h3>

            {/* Tarjeta de Recibo Térmico */}
            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 shadow-2xl relative overflow-hidden text-slate-300 font-mono text-sm leading-relaxed border-t-[6px] border-t-emerald-500">
              
              {/* Encabezado del Recibo */}
              <div className="text-center pb-6 border-b border-dashed border-slate-800">
                <h4 className="text-base font-bold text-slate-100 tracking-wider">RESONANCE DATA CORP</h4>
                <p className="text-[10px] text-slate-500 mt-1 uppercase">Optimizador de Lotes / Simulación API</p>
                <p className="text-[10px] text-slate-500 font-semibold mt-0.5">{obtenerFechaFormateada()}</p>
                <p className="text-[10px] text-slate-600 font-semibold mt-1">RECIBO NO: #SB-{Math.floor(100000 + Math.random() * 900000)}</p>
              </div>

              {/* Cuerpo del Recibo */}
              <div className="py-6 border-b border-dashed border-slate-800 flex flex-col gap-4 text-xs">
                
                {/* Desglose de Lotes */}
                <div className="flex items-center justify-between">
                  <span>Lotes de Red Generados:</span>
                  <span className="font-bold text-slate-200">{resumen.total_lotes} x Lote</span>
                </div>
                
                <div className="flex items-center justify-between pl-4 text-[11px] text-slate-400">
                  <span>Cargo Fijo por Petición:</span>
                  <span>$0.0050 USD</span>
                </div>

                <div className="flex items-center justify-between border-t border-slate-900 pt-3">
                  <span>Tokens Totales Procesados:</span>
                  <span className="font-bold text-slate-200">{resumen.total_tokens} tokens</span>
                </div>

                <div className="flex items-center justify-between pl-4 text-[11px] text-slate-400">
                  <span>Tarifa por Token:</span>
                  <span>$0.000020 USD</span>
                </div>

                {/* Eficiencia */}
                <div className="flex items-center justify-between border-t border-slate-900 pt-3 text-[11px]">
                  <span>Eficiencia de Compactación:</span>
                  <span className="font-bold text-emerald-400">{resumen.eficiencia_promedio}%</span>
                </div>
              </div>

              {/* Subtotales */}
              <div className="py-6 border-b border-dashed border-slate-800 flex flex-col gap-2 text-xs text-slate-400">
                <div className="flex items-center justify-between">
                  <span>Subtotal Coste Fijo:</span>
                  <span className="text-slate-300">${resumen.coste_fijo_total.toFixed(4)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Subtotal Coste Variable:</span>
                  <span className="text-slate-300">${resumen.coste_tokens_total.toFixed(6)}</span>
                </div>
              </div>

              {/* Gran Total */}
              <div className="pt-6 pb-2 text-center">
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest block mb-2">Total Simulando</span>
                <span className="text-2xl font-bold text-emerald-400 tracking-wider">
                  ${resumen.coste_final_total.toFixed(6)} <span className="text-xs text-slate-500 font-normal">USD</span>
                </span>
                <span className="block text-[8px] text-slate-600 font-semibold uppercase mt-4 tracking-widest">
                  *** GRACIAS POR OPTIMIZAR CON BITACORA ***
                </span>
              </div>
              
              {/* Adornos del borde de corte de papel térmico en el pie */}
              <div className="absolute bottom-0 left-0 right-0 h-1.5 flex overflow-hidden select-none pointer-events-none">
                {Array.from({ length: 40 }).map((_, i) => (
                  <div 
                    key={i} 
                    className="w-4 h-4 bg-slate-900 border border-slate-950 rotate-45 transform origin-top-left -mt-2"
                  />
                ))}
              </div>

            </div>
          </div>

        </div>
      )}

      {/* Pantalla Informativa Inicial / Vacía */}
      {!estaCargando && !resumen && (
        <div className="bg-slate-900/10 border border-dashed border-slate-800/80 rounded-2xl p-16 text-center">
          <p className="text-slate-500 mb-6 max-w-md mx-auto text-sm">
            Ingresa el tamaño límite de tokens por lote (entre 50 y 1000) y presiona "Optimizar Lotes".
            Bitácora agrupará de forma inteligente las 100 citas y generará el recibo de cobro simulado.
          </p>
        </div>
      )}

      {/* Pantalla de Carga */}
      {estaCargando && (
        <div className="bg-slate-900/20 border border-slate-850 rounded-2xl p-16 flex flex-col items-center justify-center gap-4 text-center">
          <div className="w-10 h-10 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin"></div>
          <p className="text-sm font-semibold text-slate-300">Empaquetando dataset mediante First-Fit Decreasing...</p>
        </div>
      )}

    </div>
  );
}
