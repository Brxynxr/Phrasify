import React from 'react';

/**
 * Componente de Presentación (Landing Page) para Resonancia.
 * Diseñado con estética premium Gótica-Cyberpunk "libre" (sin tarjetas encerradas).
 * Estructura de dos secciones:
 * 1. Hero (Portada a 100vh con centrado majestuoso y jerarquía tipográfica).
 * 2. Módulos y sus flujos con distribución alternada, iconos y espaciados consistentes.
 */
export default function Landing({ alSeleccionarModulo }) {
  
  const alHacerClickComenzar = () => {
    const elementoDestino = document.getElementById('landing-modules-container');
    if (elementoDestino) {
      elementoDestino.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const modulosInfo = [
    {
      id: "espejo",
      nombre: "Espejo",
      tagline: "El reflejo del alma",
      descripcion: "Explora la empatía semántica introduciendo tu estado de ánimo o situación emocional. El sistema buscará en la historia el eco de pensadores que sintieron lo mismo que tú.",
      icono: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.114 5.636a9 9 0 010 12.728M16.463 8.288a5.25 5.25 0 010 7.424M6.75 8.25l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75z" />
        </svg>
      ),
      flujo: [
        { paso: "▲", titulo: "Expresar", desc: "Escribes tu emoción actual en la barra de consulta." },
        { paso: "☉", titulo: "Buscar", desc: "El algoritmo analiza el significado profundo de tus palabras." },
        { paso: "✦", titulo: "Reflejar", desc: "Se te muestran las citas reales más afines en círculos de neón." }
      ],
      invertido: false, // Alineado a la izquierda
      glowClass: "goth-glow-text",
      iconClass: "text-[#e61919] bg-[#800a0a]/10 border-[#800a0a]/30",
      taglineClass: "text-[#e61919]",
      conectorClass: "via-[#e61919]/30",
      btnClass: "border-[#800a0a]/50 hover:border-[#e61919]/80 hover:bg-[#800a0a] shadow-[0_0_12px_rgba(128,10,10,0.25)] hover:shadow-[0_0_20px_rgba(230,25,25,0.45)]",
      circleClass: "border-[#800a0a]/60 group-hover:border-[#e61919] text-[#e61919] shadow-[0_0_10px_rgba(128,10,10,0.2)] group-hover:shadow-[0_0_15px_rgba(230,25,25,0.5)]",
      delayClass: "delay-150"
    },
    {
      id: "tribuna",
      nombre: "Tribuna",
      tagline: "El debate ilustrado",
      descripcion: "Formula preguntas existenciales o dilemas éticos. Una inteligencia artificial local responderá con un discurso de dos párrafos apoyado sólidamente en fuentes de citas maestras.",
      icono: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
        </svg>
      ),
      flujo: [
        { paso: "▼", titulo: "Plantear", desc: "Preguntas un dilema existencial en la barra de entrada." },
        { paso: "❖", titulo: "Respaldar", desc: "El orador comprueba la afinidad mínima con citas reales." },
        { paso: "⚡", titulo: "Discursar", desc: "Se genera un ensayo argumentativo con la cita resaltada en rojo." }
      ],
      invertido: true, // Invertido en desktop
      glowClass: "goth-glow-purple",
      iconClass: "text-[#9a4dff] bg-[#9a4dff]/10 border-[#9a4dff]/30",
      taglineClass: "text-[#9a4dff]",
      conectorClass: "via-[#9a4dff]/30",
      btnClass: "border-[#9a4dff]/40 hover:border-[#9a4dff]/80 hover:bg-[#9a4dff]/20 shadow-[0_0_12px_rgba(154,77,255,0.15)] hover:shadow-[0_0_20px_rgba(154,77,255,0.4)]",
      circleClass: "border-[#9a4dff]/40 group-hover:border-[#9a4dff] text-[#9a4dff] shadow-[0_0_10px_rgba(154,77,255,0.15)] group-hover:shadow-[0_0_15px_rgba(154,77,255,0.45)]",
      delayClass: "delay-300"
    },
    {
      id: "bitacora",
      nombre: "Bitácora",
      tagline: "El archivo del pensamiento",
      descripcion: "Tu diario íntimo de reflexiones. Registra notas de tu vida diaria y pon a prueba su eficiencia compacta bajo un estricto límite de espacio e indicadores de color.",
      icono: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      ),
      flujo: [
        { paso: "✒", titulo: "Anotar", desc: "Escribes reflexiones personales dentro de tu diario." },
        { paso: "⬢", titulo: "Empaquetar", desc: "El sistema agrupa los textos en bloques de tamaño limitado." },
        { paso: "⌛", titulo: "Medir", desc: "Se calcula la eficiencia con barras de color (rojo=lleno, amarillo=vacío)." }
      ],
      invertido: false, // Alineado a la izquierda
      glowClass: "goth-glow-amber",
      iconClass: "text-[#d97706] bg-[#d97706]/10 border-[#d97706]/30",
      taglineClass: "text-[#d97706]",
      conectorClass: "via-[#d97706]/30",
      btnClass: "border-[#d97706]/40 hover:border-[#d97706]/80 hover:bg-[#d97706]/20 shadow-[0_0_12px_rgba(217,119,6,0.15)] hover:shadow-[0_0_20px_rgba(217,119,6,0.4)]",
      circleClass: "border-[#d97706]/40 group-hover:border-[#d97706] text-[#d97706] shadow-[0_0_10px_rgba(217,119,6,0.15)] group-hover:shadow-[0_0_15px_rgba(217,119,6,0.45)]",
      delayClass: "delay-450"
    }
  ];

  return (
    <div className="w-full flex flex-col items-center select-none overflow-x-hidden">
      
      {/* 1. SECCIÓN HERO (Portada a pantalla completa 100vh) */}
      <section className="w-full h-screen flex flex-col justify-center items-center px-6 relative text-center z-10">
        <div className="max-w-4xl flex flex-col items-center gap-6 animate-fade-in">
          <h1 className="text-7xl md:text-9xl font-gothic tracking-[0.25em] text-slate-100 goth-glow-text uppercase">
            Resonancia
          </h1>
          <p className="text-base md:text-xl font-serif text-[#e61919] uppercase tracking-widest max-w-3xl mt-2 font-bold leading-relaxed">
            Donde las ideas del pasado resuenan en el debate del presente.
          </p>
          <div className="w-40 h-[2px] bg-gradient-to-r from-transparent via-[#e61919]/60 to-transparent mt-4"></div>
          <p className="text-sm md:text-base text-slate-400 font-serif leading-relaxed max-w-2xl px-4 mt-2">
            Un portal introspectivo y gótico diseñado para cruzar la sabiduría atemporal de los pensadores clásicos con tus reflexiones modernas mediante inteligencia artificial.
          </p>
          
          {/* Botón de Exploración (CTA) para bajar a los módulos */}
          <div className="mt-8">
            <button
              onClick={alHacerClickComenzar}
              className="group bg-transparent hover:bg-[#800a0a] text-slate-100 font-serif uppercase tracking-widest font-bold px-10 py-4 rounded-xl text-xs transition-all duration-500 border-2 border-[#800a0a] hover:border-[#e61919] shadow-[0_0_15px_rgba(128,10,10,0.3)] hover:shadow-[0_0_25px_rgba(230,25,25,0.5)] flex items-center gap-3 overflow-hidden cursor-pointer"
            >
              <span>Explorar Módulos</span>
              <svg 
                className="w-4 h-4 text-slate-400 group-hover:text-slate-100 group-hover:translate-y-0.5 transition-all duration-300" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor" 
                strokeWidth="2.5"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 13l-7 7-7-7m14-6l-7 7-7-7" />
              </svg>
            </button>
          </div>
        </div>
      </section>

      {/* 2. SECCIÓN DE MÓDULOS (Espaciados consistentes y libres de tarjetas) */}
      <section 
        id="landing-modules-container" 
        className="w-full max-w-7xl px-6 md:px-12 lg:px-16 py-28 flex flex-col gap-40 relative z-10 overflow-hidden"
      >
        {modulosInfo.map((mod, modIdx) => (
          <div 
            key={mod.id} 
            className="w-full flex flex-col md:grid md:grid-cols-12 gap-8 md:gap-16 items-center relative py-8"
          >
            {/* Separador entre módulos (salvo el primero) */}
            {modIdx > 0 && (
              <div className="absolute -top-20 left-1/4 right-1/4 h-[1px] bg-gradient-to-r from-transparent via-[#800a0a]/15 to-transparent pointer-events-none" />
            )}

            {/* Bloque de Información del Módulo con animación */}
            <div className={`flex flex-col gap-4 md:col-span-5 ${mod.invertido ? 'md:order-2 md:items-end md:text-right' : 'md:items-start md:text-left'} items-center text-center animate-fade-in opacity-0-init ${mod.delayClass}`}>
              <div className="flex items-center gap-3">
                <div className={`p-2.5 rounded-xl flex items-center justify-center shrink-0 ${mod.iconClass}`}>
                  {mod.icono}
                </div>
                <h2 className={`text-3xl md:text-4xl font-gothic tracking-widest uppercase ${mod.glowClass}`}>
                  {mod.nombre}
                </h2>
              </div>
              <span className={`text-[10px] md:text-xs font-serif uppercase tracking-widest font-bold block ${mod.taglineClass}`}>
                {mod.tagline}
              </span>
              <p className="text-sm md:text-base text-slate-400 leading-relaxed font-serif mt-2 max-w-md">
                {mod.descripcion}
              </p>
              <div className={`mt-3 animate-fade-in opacity-0-init ${mod.delayClass} delay-600`}>
                <button
                  onClick={() => alSeleccionarModulo(mod.id)}
                  className={`font-serif uppercase tracking-widest font-bold px-8 py-3.5 rounded-xl text-[10px] md:text-xs transition-all duration-300 border-2 cursor-pointer ${mod.btnClass}`}
                >
                  Explorar {mod.nombre}
                </button>
              </div>
            </div>

            {/* Bloque del Ciclo de Procedimiento */}
            <div className={`w-full md:col-span-7 relative px-4 ${mod.invertido ? 'md:order-1' : ''} overflow-hidden`}>
              {/* Línea conectora horizontal solo para desktop */}
              <div className={`hidden md:block absolute top-[24px] left-[15%] right-[15%] h-[1px] bg-gradient-to-r from-transparent ${mod.conectorClass} to-transparent z-0`} />
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-4 relative z-10">
                {mod.flujo.map((f, idx) => {
                  const delayPaso = idx === 0 ? 'delay-150' : idx === 1 ? 'delay-300' : 'delay-450';
                  return (
                    <div key={idx} className={`flex flex-col items-center text-center gap-3 group animate-fade-in opacity-0-init ${mod.delayClass} ${delayPaso}`}>
                      <div className={`w-12 h-12 rounded-full bg-[#0c0202] border-2 flex items-center justify-center font-serif font-bold text-sm transition-all duration-300 ${mod.circleClass}`}>
                        {f.paso}
                      </div>
                      <div className="flex flex-col gap-1">
                        <span className="text-xs md:text-sm font-serif text-slate-300 font-semibold uppercase tracking-wider">
                          {f.titulo}
                        </span>
                        <p className="text-[11px] md:text-xs text-slate-500 leading-relaxed font-sans px-2">
                          {f.desc}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>
        ))}
      </section>

    </div>
  );
}
