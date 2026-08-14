import React, { useState } from 'react';

/**
 * Componente del Módulo 2: Tribuna.
 * Ofrece una interfaz para formular preguntas y recibir ensayos respaldados
 * por las citas reales más afines, con control de rigor semántico y typewriter effect.
 */
export default function Tribuna() {
  const [preguntaTexto, setPreguntaTexto] = useState('');
  const [estaCargando, setEstaCargando] = useState(false);
  const [mensajeCarga, setMensajeCarga] = useState('');
  const [ensayoTextoVisible, setEnsayoTextoVisible] = useState('');
  const [citasUtilizadas, setCitasUtilizadas] = useState([]);
  const [suficientesFuentes, setSuficientesFuentes] = useState(true);
  const [errorMensaje, setErrorMensaje] = useState('');

  // Efecto máquina de escribir — palabra por palabra
  const iniciarEfectoEscritura = (textoCompleto) => {
    setEnsayoTextoVisible('');
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

    try {
      const respuesta = await fetch('http://localhost:8000/tribuna/debatir', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'accept': 'application/json' },
        body: JSON.stringify({ pregunta: preguntaTexto, umbral: 0.30 })
      });

      if (!respuesta.ok) {
        throw new Error(respuesta.status === 422
          ? 'La pregunta no cumple con las reglas del servidor (mínimo 5 caracteres).'
          : 'No se pudo conectar con el orador de Tribuna.');
      }

      const datos = await respuesta.json();
      setSuficientesFuentes(datos.suficientes_fuentes);
      setCitasUtilizadas(datos.citas_utilizadas || []);
      clearInterval(intervaloCarga);
      setEstaCargando(false);
      iniciarEfectoEscritura(datos.ensayo);

    } catch (error) {
      setErrorMensaje(error.message || 'Error de conexión con el servidor.');
      clearInterval(intervaloCarga);
      setEstaCargando(false);
    }
  };

  // Resalta texto entre comillas con tooltip de fuente
  const renderizarEnsayoConResaltado = (texto) => {
    if (!texto) return null;
    const partes = texto.split(/(".*?"|".*?"|«.*?»)/g);
    return partes.map((parte, idx) => {
      const esComilla =
        (parte.startsWith('"') && parte.endsWith('"')) ||
        (parte.startsWith('\u201c') && parte.endsWith('\u201d')) ||
        (parte.startsWith('\u00ab') && parte.endsWith('\u00bb'));
      if (esComilla) {
        const citaAsociada = citasUtilizadas[0];
        return (
          <mark key={idx} className="bg-indigo-500/20 text-indigo-300 font-semibold italic border-b border-indigo-500/30 px-1 rounded transition duration-200 hover:bg-indigo-500/30 cursor-help relative group inline-block">
            {parte}
            {citaAsociada && (
              <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 bg-slate-950 border border-slate-800 text-[11px] font-sans font-normal p-3 rounded-lg shadow-2xl opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100 pointer-events-none transition-all duration-200 z-50 leading-relaxed text-left">
                <span className="block font-bold text-indigo-400 mb-1">Fuente real: {citaAsociada.autor}</span>
                "{citaAsociada.frase}"
                <span className="block text-[9px] text-slate-500 font-mono mt-1 text-right">Afinidad: {(citaAsociada.similitud * 100).toFixed(0)}%</span>
              </span>
            )}
          </mark>
        );
      }
      return parte;
    });
  };



  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col gap-8 animate-fade-in">

      {/* Panel de Formulario */}
      <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800/80 rounded-2xl p-8 shadow-2xl">
        <div className="flex items-center gap-4 mb-6">
          <div className="p-3 bg-indigo-500/10 border border-indigo-500/30 rounded-xl text-indigo-400">
            <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
          </div>
          <div>
            <h2 className="text-2xl font-bold tracking-wide text-slate-100">Tribuna</h2>
            <p className="text-sm text-slate-400">Expón tu dilema o tesis. Tribuna redactará un ensayo argumentativo respaldado en fuentes reales.</p>
          </div>
        </div>

        <form onSubmit={debatirTesis} className="flex flex-col gap-5">
          <textarea
            value={preguntaTexto}
            onChange={(e) => setPreguntaTexto(e.target.value)}
            placeholder="Ej: ¿Qué valor tiene persistir después de fallar repetidamente?"
            rows="3"
            disabled={estaCargando}
            className="w-full bg-slate-950/40 border border-slate-800 rounded-xl p-4 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/30 transition-all duration-300 resize-none"
          />



          <div className="flex justify-end border-t border-slate-800/60 pt-4">
            <button
              type="submit"
              disabled={estaCargando}
              className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-8 py-3 rounded-xl text-sm transition-all duration-300 shadow-[0_4px_20px_rgba(99,102,241,0.3)] hover:shadow-[0_4px_25px_rgba(99,102,241,0.5)] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Subir a la Tribuna
            </button>
          </div>

          {errorMensaje && (
            <p className="text-xs text-red-400 font-medium ml-1">{errorMensaje}</p>
          )}
        </form>
      </div>

      {/* Pantalla de Carga */}
      {estaCargando && (
        <div className="bg-slate-900/20 border border-slate-800 rounded-2xl p-12 flex flex-col items-center justify-center gap-5 text-center">
          <div className="w-10 h-10 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin"></div>
          <div className="flex flex-col gap-1">
            <h4 className="text-sm font-semibold text-slate-300">Construyendo Argumento</h4>
            <p className="text-xs text-slate-500 font-mono italic animate-pulse">{mensajeCarga}</p>
          </div>
        </div>
      )}

      {/* Tarjeta de Fallback — sin fuentes suficientes */}
      {!estaCargando && ensayoTextoVisible && !suficientesFuentes && (
        <div className="bg-amber-500/5 border border-amber-500/30 rounded-2xl p-8 flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-500/10 rounded-xl text-amber-400">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
              </svg>
            </div>
            <h3 className="text-sm font-bold text-amber-400">Sin fuentes suficientes para debatir</h3>
          </div>
          <p className="text-sm text-slate-300 leading-relaxed">{ensayoTextoVisible}</p>
          {citasUtilizadas.length > 0 && (
            <div className="mt-2">
              <p className="text-xs text-slate-500 mb-3">Las citas más cercanas encontradas (por debajo del umbral {umbral.toFixed(2)}):</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {citasUtilizadas.map((c, i) => (
                  <div key={i} className="bg-slate-950/40 border border-slate-900 rounded-xl p-4 flex flex-col gap-2">
                    <p className="text-xs text-slate-400 italic">"{c.frase}"</p>
                    <div className="flex items-center justify-between border-t border-slate-900 pt-2">
                      <span className="text-xs text-amber-400 font-bold">— {c.autor}</span>
                      <span className="text-[10px] text-slate-500 font-mono">Afinidad: {(c.similitud * 100).toFixed(0)}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Resultado del Debate — ensayo con fuentes válidas */}
      {!estaCargando && ensayoTextoVisible && suficientesFuentes && (
        <div className="flex flex-col gap-6">
          {/* Tarjeta del Ensayo */}
          <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-8 shadow-xl relative overflow-hidden">
            <div className="absolute -top-10 -left-6 text-slate-800/20 text-[180px] font-serif select-none pointer-events-none">"</div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-indigo-400 mb-6 relative z-10">Discurso Emitido</h3>
            <div className="text-slate-200 leading-loose text-base flex flex-col gap-6 relative z-10 text-justify font-sans">
              {renderizarEnsayoConResaltado(ensayoTextoVisible)}
            </div>
          </div>

          {/* Citas Utilizadas */}
          {citasUtilizadas.length > 0 && (
            <div className="flex flex-col gap-4">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 px-1">
                Fuentes de Soporte Verificadas ({citasUtilizadas.length})
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {citasUtilizadas.map((c, index) => (
                  <div key={index} className="bg-slate-950/40 border border-slate-900 rounded-xl p-5 hover:border-slate-800 transition duration-300 flex flex-col justify-between gap-3 animate-fade-in">
                    <p className="text-xs text-slate-300 italic leading-relaxed">"{c.frase}"</p>
                    <div className="flex items-center justify-between gap-2 border-t border-slate-900/60 pt-3">
                      <span className="text-xs text-indigo-400 font-bold">— {c.autor}</span>
                      <span className="text-[10px] font-mono font-bold text-slate-500">Afinidad: {(c.similitud * 100).toFixed(0)}%</span>
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
        <div className="text-center py-8 text-slate-500 text-sm">
          Pregunta algo sobre el éxito, fracaso, amor o la vida para activar la oratoria de la Tribuna.
        </div>
      )}
    </div>
  );
}
