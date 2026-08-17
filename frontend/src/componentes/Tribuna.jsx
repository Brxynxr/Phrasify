import React, { useState } from 'react';

/**
 * Componente del Módulo 2: Tribuna.
 * Rediseñado con la estética Gótica-Cyberpunk de la interfaz Liazid Oussama.
 */
export default function Tribuna() {
  const [preguntaTexto, setPreguntaTexto] = useState('');
  const [estaCargando, setEstaCargando] = useState(false);
  const [mensajeCarga, setMensajeCarga] = useState('');
  const [ensayoTextoVisible, setEnsayoTextoVisible] = useState('');
  const [citasUtilizadas, setCitasUtilizadas] = useState([]);
  const [suficientesFuentes, setSuficientesFuentes] = useState(true);
  const [errorMensaje, setErrorMensaje] = useState('');
  const [estaEscribiendo, setEstaEscribiendo] = useState(false);

  // Efecto máquina de escribir — palabra por palabra con cursor gótico
  const iniciarEfectoEscritura = (textoCompleto) => {
    setEnsayoTextoVisible('');
    setEstaEscribiendo(true);
    const palabras = textoCompleto.split(' ');
    let index = 0;
    let acumulado = '';
    const intervalo = setInterval(() => {
      if (index < palabras.length) {
        acumulado += (index === 0 ? '' : ' ') + palabras[index];
        setEnsayoTextoVisible(acumulado);
        index++;
      } else {
        clearInterval(intervalo);
        setEstaEscribiendo(false);
      }
    }, 45);
    return intervalo;
  };

  // Mensajes de progreso durante la carga
  const iniciarMensajesCarga = () => {
    const etapas = [
      'Recuperando citas afines del dataset maestro...',
      'Verificando umbral de similitud semántica...',
      'Orquestando argumento con IA local...',
      'Verificando atribuciones y fuentes...'
    ];
    let etapaActual = 0;
    setMensajeCarga(etapas[0]);
    const intervalo = setInterval(() => {
      etapaActual += 1;
      if (etapaActual < etapas.length) setMensajeCarga(etapas[etapaActual]);
      else clearInterval(intervalo);
    }, 1400);
    return intervalo;
  };

  const debatirTesis = async (evento) => {
    evento.preventDefault();
    if (preguntaTexto.trim().length < 5) {
      setErrorMensaje('Por favor, ingresa una pregunta de al menos 5 caracteres.');
      return;
    }
    setErrorMensaje('');
    setEstaCargando(true);
    setEnsayoTextoVisible('');
    setCitasUtilizadas([]);
    setSuficientesFuentes(true);

    const intervaloCarga = iniciarMensajesCarga();
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

    try {
      const respuesta = await fetch(`${API_URL}/tribuna/debatir`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'accept': 'application/json' },
        body: JSON.stringify({ pregunta: preguntaTexto, umbral: 0.42 })
      });

      if (!respuesta.ok) {
        let msg = 'No se pudo conectar con el orador de Tribuna.';
        try {
          const errData = await respuesta.json();
          if (errData?.detail) msg = errData.detail;
        } catch (e) {}
        throw new Error(msg);
      }

      const datos = await respuesta.json();
      clearInterval(intervaloCarga);
      setEstaCargando(false);

      setSuficientesFuentes(datos.suficientes_fuentes);
      setCitasUtilizadas(datos.citas_utilizadas || []);

      // Iniciar el typewriter effect en el ensayo completo
      iniciarEfectoEscritura(datos.ensayo || '');

    } catch (error) {
      clearInterval(intervaloCarga);
      console.error('Error al debatir tema filosófico:', error);
      setErrorMensaje(error.message || 'Error de conexión con el servidor.');
      setEstaCargando(false);
    }
  };

  // Resalta texto entre comillas con tooltip de fuente y select-none
  const renderizarEnsayoConResaltado = (texto) => {
    if (!texto) return null;
    // Captura comillas estándar ("), comillas tipográficas curvadas (“ y ”) y comillas angulares (« y »)
    const partes = texto.split(/(".*?"|“.*?”|«.*?»)/g);
    return partes.map((parte, idx) => {
      const esComilla =
        (parte.startsWith('"') && parte.endsWith('"')) ||
        (parte.startsWith('\u201c') && parte.endsWith('\u201d')) ||
        (parte.startsWith('\u00ab') && parte.endsWith('\u00bb'));
      if (esComilla) {
        const fraseLimpia = parte.replace(/["'«»“”]/g, '').trim().toLowerCase();
        const citaAsociada = citasUtilizadas.find(c => 
          c.frase.toLowerCase().includes(fraseLimpia) || 
          fraseLimpia.includes(c.frase.toLowerCase())
        ) || citasUtilizadas[0];
        
        return (
          <mark key={idx} className="bg-[#800a0a]/30 text-[#e61919] goth-glow-text font-semibold italic border-b border-[#e61919]/50 px-1 rounded transition duration-200 hover:bg-[#800a0a]/50 cursor-help relative group inline-block font-sans">
            {parte}
            {citaAsociada && (
              <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 bg-[#0c0202] border-2 border-[#800a0a] text-[11px] font-sans font-normal p-3 rounded-lg shadow-2xl opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100 pointer-events-none transition-all duration-200 z-50 leading-relaxed text-left select-none">
                <span className="block font-serif font-bold text-[#e61919] mb-1">Fuente real: {citaAsociada.autor}</span>
                "{citaAsociada.frase}"
                <span className="block text-[9px] text-slate-500 font-mono mt-1 text-right">Afinidad: {Math.round(citaAsociada.similitud * 100)}%</span>
              </span>
            )}
          </mark>
        );
      }
      return parte;
    });
  };

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col gap-8 animate-fade-in relative">

      {/* Panel de Formulario Gótico */}
      <div className="goth-card rounded-2xl p-8 relative overflow-hidden">
        <div className="flex items-center gap-4 mb-6">
          <div className="p-3 bg-[#800a0a]/10 border border-[#800a0a]/40 rounded-xl text-[#e61919] goth-glow-text">
            <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
          </div>
          <div>
            <h2 className="text-2xl font-gothic tracking-widest text-slate-100 goth-glow-text">TRIBUNA</h2>
            <p className="text-sm text-slate-400 font-serif">Expón tu dilema o tesis. Tribuna redactará un ensayo argumentativo respaldado en fuentes reales.</p>
          </div>
        </div>

        <form onSubmit={debatirTesis} className="flex flex-col gap-5">
          <textarea
            value={preguntaTexto}
            onChange={(e) => setPreguntaTexto(e.target.value)}
            placeholder="Ej: ¿Es el conocimiento o la imaginación más importante para entender el mundo?"
            rows="3"
            disabled={estaCargando}
            className="w-full bg-black/80 border-2 border-[#800a0a]/60 rounded-xl p-4 text-sm text-slate-200 placeholder-slate-700 focus:outline-none focus:border-[#e61919] focus:ring-1 focus:ring-[#e61919]/30 transition-all duration-300 resize-none font-sans"
          />

          <div className="flex justify-end border-t border-[#800a0a]/30 pt-4">
            <button
              type="submit"
              disabled={estaCargando}
              className="w-full sm:w-auto bg-[#800a0a] hover:bg-[#e61919] text-white font-serif uppercase tracking-widest font-semibold px-8 py-3.5 rounded-xl text-sm transition-all duration-300 border border-[#e61919]/30 shadow-[0_4px_15px_rgba(128,10,10,0.4)] hover:shadow-[0_4px_20px_rgba(230,25,25,0.6)] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Subir a la Tribuna
            </button>
          </div>

          {errorMensaje && (
            <p className="text-xs text-red-500 font-bold ml-1 font-mono">{errorMensaje}</p>
          )}
        </form>
      </div>

      {/* Pantalla de Carga Gótica */}
      {estaCargando && (
        <div className="goth-card rounded-2xl p-12 flex flex-col items-center justify-center gap-4 text-center">
          <div className="w-16 h-16 rounded-full border-4 border-[#800a0a]/20 border-t-[#e61919] animate-spin shadow-[0_0_15px_rgba(230,25,25,0.5)]"></div>
          <div className="flex flex-col gap-1.5 mt-2">
            <p className="text-sm font-serif uppercase tracking-widest text-[#e61919] goth-glow-text">{mensajeCarga}</p>
            <p className="text-xs text-slate-500 font-serif">Invocando el conocimiento de la IA local...</p>
          </div>
        </div>
      )}

      {/* Tarjeta de Fallback — sin fuentes suficientes */}
      {!estaCargando && ensayoTextoVisible && !suficientesFuentes && (
        <div className="bg-[#250505]/60 border-2 border-[#e61919]/60 rounded-2xl p-8 flex flex-col gap-4 shadow-[0_0_20px_rgba(230,25,25,0.2)]">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#e61919]/10 rounded-xl text-[#e61919] goth-glow-text">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
              </svg>
            </div>
            <h3 className="text-sm font-serif font-bold uppercase tracking-widest text-[#e61919] goth-glow-text">Sin fuentes suficientes para debatir</h3>
          </div>
          <p className="text-sm text-slate-300 leading-relaxed font-sans">{ensayoTextoVisible}</p>
        </div>
      )}

      {/* Resultado del Debate — ensayo con fuentes válidas */}
      {!estaCargando && ensayoTextoVisible && suficientesFuentes && (
        <div className="flex flex-col gap-6">
          {/* Tarjeta del Ensayo al Estilo Liazid Oussama */}
          <div className="goth-card rounded-2xl p-8 shadow-xl relative overflow-hidden">
            <div className="absolute -top-10 -left-6 text-[#800a0a]/15 text-[180px] font-serif select-none pointer-events-none">"</div>
            <h3 className="text-xs font-serif font-semibold uppercase tracking-widest text-[#e61919] goth-glow-text mb-6 relative z-10">Discurso Emitido</h3>
            
            {/* Cuerpo del ensayo con efecto de cursor parpadeante gótico al escribir */}
            <div className="text-slate-200 leading-loose text-base flex flex-col gap-6 relative z-10 text-justify font-sans">
              {ensayoTextoVisible ? (
                <>
                  <span className="whitespace-pre-line">{renderizarEnsayoConResaltado(ensayoTextoVisible)}</span>
                  {estaEscribiendo && <span className="goth-cursor inline-block w-[2px] h-[15px] bg-[#e61919] ml-1 animate-blink" />}
                </>
              ) : null}
            </div>
          </div>

          {/* Citas Utilizadas (Una debajo de la otra en columna) */}
          {citasUtilizadas.length > 0 && (
            <div className="flex flex-col gap-4">
              <h3 className="text-xs font-serif font-semibold uppercase tracking-widest text-slate-500 px-1">
                Fuentes de Soporte Verificadas ({citasUtilizadas.length})
              </h3>
              <div className="flex flex-col gap-4">
                {citasUtilizadas.map((c, index) => (
                  <div key={index} className="goth-card rounded-xl p-5 flex flex-col sm:flex-row justify-between gap-4 items-start sm:items-center animate-fade-in relative overflow-hidden">
                    <div className="flex-1 relative z-10">
                      <p className="text-xs text-slate-300 italic leading-relaxed font-sans">"{c.frase}"</p>
                      <span className="text-xs text-[#e61919] font-bold font-serif block mt-2">— {c.autor}</span>
                    </div>
                    
                    {/* Círculo de afinidad SVG brillante */}
                    <div className="flex flex-col justify-center items-center shrink-0 pt-2 sm:pt-0 sm:pl-6 text-center min-w-[100px] relative z-10">
                      <span className="text-[9px] text-slate-500 uppercase font-serif tracking-widest mb-2 block">
                        Afinidad
                      </span>
                      <div className="relative w-14 h-14 flex items-center justify-center">
                        <svg className="w-full h-full transform -rotate-90">
                          <circle
                            cx="28"
                            cy="28"
                            r="24"
                            className="stroke-[#0c0202] fill-transparent"
                            strokeWidth="3.5"
                          />
                          <circle
                            cx="28"
                            cy="28"
                            r="24"
                            className="stroke-[#800a0a]/40 fill-transparent"
                            strokeWidth="3.5"
                          />
                          <circle
                            cx="28"
                            cy="28"
                            r="24"
                            className="stroke-[#e61919] fill-transparent transition-all duration-1000 ease-out"
                            strokeWidth="3.5"
                            strokeDasharray={2 * Math.PI * 24}
                            strokeDashoffset={2 * Math.PI * 24 * (1 - c.similitud)}
                            style={{
                              filter: 'drop-shadow(0 0 4px rgba(230, 25, 25, 0.8))'
                            }}
                          />
                        </svg>
                        <span className="absolute text-xs font-extrabold text-[#e61919] goth-glow-text font-mono">
                          {Math.round(c.similitud * 100)}%
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Estado inicial */}
      {!estaCargando && !ensayoTextoVisible && (
        <div className="text-center py-12 text-slate-600 font-serif tracking-widest text-sm bg-black/40 border border-[#800a0a]/20 rounded-2xl">
          Pregunta algo a la Tribuna para invocar un discurso respaldado
        </div>
      )}

    </div>
  );
}
