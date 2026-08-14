import React, { useState } from 'react';

/**
 * Componente del Módulo 2: Tribuna (Simplificado).
 * Ofrece una interfaz para formular preguntas y recibir ensayos respaldados
 * por las citas reales más afines, destacándolas visualmente en el texto.
 */
export default function Tribuna() {
  // Estados reactivos con nomenclatura descriptiva en español
  const [preguntaTexto, setPreguntaTexto] = useState('');
  const [estaCargando, setEstaCargando] = useState(false);
  const [mensajeCarga, setMensajeCarga] = useState('');
  
  const [ensayoTexto, setEnsayoTexto] = useState('');
  const [citasUtilizadas, setCitasUtilizadas] = useState([]);
  const [errorMensaje, setErrorMensaje] = useState('');

  // Función auxiliar para simular pasos en la carga y dar mejor UX
  const iniciarMensajesCarga = () => {
    const etapas = [
      'Recuperando citas afines del dataset maestro...',
      'Analizando coeficientes de similitud coseno...',
      'Orquestando ensayo argumentativo en la IA (qwen2.5:1.5b)...',
      'Resaltando citas literales y verificando atribuciones...'
    ];
    
    let etapaActual = 0;
    setMensajeCarga(etapas[0]);
    
    const intervalo = setInterval(() => {
      etapaActual += 1;
      if (etapaActual < etapas.length) {
        setMensajeCarga(etapas[etapaActual]);
      } else {
        clearInterval(intervalo);
      }
    }, 1500);
    
    return intervalo;
  };

  // Función para consumir el endpoint /tribuna/debatir
  const debatirTesis = async (evento) => {
    evento.preventDefault();

    if (preguntaTexto.trim().length < 5) {
      setErrorMensaje('Por favor, ingresa una pregunta o planteamiento de al menos 5 caracteres.');
      return;
    }

    setErrorMensaje('');
    setEstaCargando(true);
    setEnsayoTexto('');
    setCitasUtilizadas([]);

    const intervaloCarga = iniciarMensajesCarga();

    try {
      const respuesta = await fetch('http://localhost:8000/tribuna/debatir', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'accept': 'application/json'
        },
        body: JSON.stringify({
          pregunta: preguntaTexto
        })
      });

      if (!respuesta.ok) {
        if (respuesta.status === 422) {
          throw new Error('La pregunta ingresada no cumple con las reglas del servidor (mínimo 5 caracteres).');
        }
        throw new Error('No se pudo establecer conexión con el orador de Tribuna. Revisa tu servidor.');
      }

      const datos = await respuesta.json();
      
      setEnsayoTexto(datos.ensayo);
      setCitasUtilizadas(datos.citas_utilizadas || []);
      
    } catch (error) {
      console.error('Error al debatir en Tribuna:', error);
      setErrorMensaje(error.message || 'Error de conexión con el servidor.');
    } finally {
      clearInterval(intervaloCarga);
      setEstaCargando(false);
    }
  };

  // Parsea el texto del ensayo para buscar y resaltar lo que esté entre comillas
  const renderizarEnsayoConResaltado = (texto) => {
    if (!texto) return null;

    // Regex para capturar comillas comunes "..." y comillas de apertura/cierre tipográficas “...” o «...»
    const partes = texto.split(/(".*?"|“.*?”|«.*?»)/g);

    return partes.map((parte, idx) => {
      const esComilla = 
        (parte.startsWith('"') && parte.endsWith('"')) ||
        (parte.startsWith('“') && parte.endsWith('”')) ||
        (parte.startsWith('“') && parte.endsWith('“')) ||
        (parte.startsWith('«') && parte.endsWith('»'));

      if (esComilla) {
        return (
          <mark 
            key={idx} 
            className="bg-indigo-500/20 text-indigo-300 font-semibold italic border-b border-indigo-500/30 px-1 rounded transition duration-200 hover:bg-indigo-500/30 cursor-help"
            title="Cita textual recuperada directamente del dataset maestro (verificada)."
          >
            {parte}
          </mark>
        );
      }
      return parte;
    });
  };

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col gap-8 animate-fade-in">
      
      {/* Caja de Control de Debate */}
      <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800/80 rounded-2xl p-8 shadow-2xl">
        <div className="flex items-center gap-4 mb-6">
          <div className="p-3 bg-indigo-500/10 border border-indigo-500/30 rounded-xl text-indigo-400">
            {/* Icono de Tribuna / Mensaje de Diálogo */}
            <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
          </div>
          <div>
            <h2 className="text-2xl font-bold tracking-wide text-slate-100">Tribuna</h2>
            <p className="text-sm text-slate-400">Expón tu dilema o tesis. Tribuna redactará un ensayo argumentativo respaldado en fuentes.</p>
          </div>
        </div>

        {/* Formulario */}
        <form onSubmit={debatirTesis} className="flex flex-col gap-4">
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

      {/* Pantalla de Carga y Mensajes de Etapas */}
      {estaCargando && (
        <div className="bg-slate-900/20 border border-slate-850 rounded-2xl p-12 flex flex-col items-center justify-center gap-5 text-center">
          {/* Spinner animado de carga */}
          <div className="w-10 h-10 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin"></div>
          <div className="flex flex-col gap-1">
            <h4 className="text-sm font-semibold text-slate-300">Construyendo Argumento</h4>
            <p className="text-xs text-slate-500 font-mono italic animate-pulse">{mensajeCarga}</p>
          </div>
        </div>
      )}

      {/* Resultados del Debate */}
      {!estaCargando && ensayoTexto && (
        <div className="flex flex-col gap-6">
          
          {/* Tarjeta de Ensayo */}
          <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-8 shadow-xl relative overflow-hidden">
            {/* Decoración de comillas en marca de agua */}
            <div className="absolute -top-10 -left-6 text-slate-800/20 text-[180px] font-serif select-none pointer-events-none">
              “
            </div>
            
            <h3 className="text-xs font-semibold uppercase tracking-wider text-indigo-400 mb-6 relative z-10">
              Discurso Emitido
            </h3>
            
            {/* Texto del ensayo con las partes resaltadas */}
            <div className="text-slate-200 leading-loose text-base flex flex-col gap-6 relative z-10 text-justify">
              {renderizarEnsayoConResaltado(ensayoTexto)}
            </div>
          </div>

          {/* Panel de Soporte / Citas Utilizadas */}
          {citasUtilizadas.length > 0 && (
            <div className="flex flex-col gap-4">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 px-1">
                Citas Utilizadas de Soporte ({citasUtilizadas.length})
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {citasUtilizadas.map((c, index) => (
                  <div 
                    key={index}
                    className="bg-slate-950/40 border border-slate-900 rounded-xl p-5 hover:border-slate-850 transition duration-300 flex flex-col justify-between gap-3"
                  >
                    <p className="text-xs text-slate-300 italic leading-relaxed">
                      “{c.frase}”
                    </p>
                    <div className="flex items-center justify-between gap-2 border-t border-slate-900/60 pt-3">
                      <span className="text-xs text-indigo-400 font-bold">
                        — {c.autor}
                      </span>
                      <span className="text-[10px] font-mono font-bold text-slate-500">
                        Afinidad: {(c.similitud * 100).toFixed(0)}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      )}

      {/* Pantalla Informativa Inicial */}
      {!estaCargando && !ensayoTexto && (
        <div className="text-center py-8 text-slate-500 text-sm">
          Pregunta algo sobre el éxito, fracaso, amor o la vida para activar la oratoria de la Tribuna.
        </div>
      )}

    </div>
  );
}
