import React from 'react';

/**
 * Componente de Presentación (Landing Page / Hero Section) para Resonancia.
 * Diseñado con estética premium Gótica-Cyberpunk.
 * Explica el flujo del proyecto y da paso a los módulos con scroll suave.
 */
export default function Landing({ alHacerClickComenzar }) {
  
  const ejecutarScrollSiguiente = () => {
    if (alHacerClickComenzar) {
      alHacerClickComenzar();
    } else {
      const elementoDestino = document.getElementById('app-main-content');
      if (elementoDestino) {
        elementoDestino.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const pasosFlujo = [
    {
      numero: "I",
      titulo: "Extracción",
      descripcion: "Recolección digital de citas selectas provenientes de los filósofos, historiadores y pensadores más influyentes de la historia."
    },
    {
      numero: "II",
      titulo: "Análisis Semántico",
      descripcion: "Organización y procesamiento de las ideas en base a su afinidad emocional y existencial profunda mediante inteligencia artificial."
    },
    {
      numero: "III",
      titulo: "Resonancia",
      descripcion: "Interacción activa de las citas con tus propios dilemas e inquietudes a través de los tres módulos interactivos del portal."
    }
  ];

  const tarjetasModulos = [
    {
      nombre: "Espejo",
      tagline: "El reflejo del alma",
      descripcion: "Escribe cómo te sientes o qué piensas en este momento, y contempla tus emociones reflejadas en la sabiduría de las citas históricas más afines.",
      icono: (
        <svg className="w-8 h-8 text-[#e61919]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.114 5.636a9 9 0 010 12.728M16.463 8.288a5.25 5.25 0 010 7.424M6.75 8.25l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75z" />
        </svg>
      )
    },
    {
      nombre: "Tribuna",
      tagline: "El debate ilustrado",
      descripcion: "Expón dilemas morales o preguntas difíciles. El orador de la Tribuna redactará un ensayo argumentativo respaldado rigurosamente en citas de soporte reales.",
      icono: (
        <svg className="w-8 h-8 text-[#e61919]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
        </svg>
      )
    },
    {
      nombre: "Bitácora",
      tagline: "El archivo del pensamiento",
      descripcion: "Tu diario existencial. Colecciona reflexiones y pon a prueba su eficiencia sintáctica bajo un estricto límite de espacio e indicadores de color.",
      icono: (
        <svg className="w-8 h-8 text-[#e61919]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      )
    }
  ];

  return (
    <section className="w-full min-h-screen flex flex-col justify-center items-center px-4 py-16 relative overflow-hidden select-none">
      
      {/* Círculos flotantes de ambientación en el fondo */}
      <div className="absolute top-1/4 left-[10%] w-96 h-96 rounded-full bg-[#800a0a]/5 blur-[120px] pointer-events-none animate-float-slow"></div>
      <div className="absolute bottom-1/4 right-[10%] w-[450px] h-[450px] rounded-full bg-[#e61919]/3 blur-[150px] pointer-events-none animate-float-medium"></div>

      <div className="max-w-5xl w-full flex flex-col items-center text-center gap-12 relative z-10">
        
        {/* Cabecera Principal */}
        <div className="flex flex-col items-center gap-4">
          <h1 className="text-6xl md:text-8xl font-gothic tracking-[0.25em] text-slate-100 goth-glow-text uppercase">
            Resonancia
          </h1>
          <p className="text-base md:text-xl font-serif text-[#e61919] uppercase tracking-widest max-w-2xl px-4 mt-2">
            Donde las ideas del pasado resuenan en el debate del presente.
          </p>
          <div className="w-32 h-[1px] bg-gradient-to-r from-transparent via-[#e61919]/60 to-transparent mt-3"></div>
          <p className="text-sm md:text-base text-slate-400 font-serif leading-relaxed max-w-3xl px-6 mt-4">
            Un portal gótico e inteligente diseñado para cruzar la sabiduría atemporal de la literatura clásica con tus pensamientos y emociones del día a día. Refleja tu estado de ánimo, genera debates filosóficos respaldados y lleva tu diario introspectivo.
          </p>
        </div>

        {/* Botón Call to Action */}
        <div className="mt-2">
          <button
            onClick={ejecutarScrollSiguiente}
            className="group relative bg-transparent hover:bg-[#800a0a] text-slate-100 font-serif uppercase tracking-widest font-bold px-10 py-4 rounded-xl text-xs transition-all duration-500 border-2 border-[#800a0a] hover:border-[#e61919] shadow-[0_0_15px_rgba(128,10,10,0.3)] hover:shadow-[0_0_25px_rgba(230,25,25,0.5)] flex items-center gap-3 overflow-hidden cursor-pointer"
          >
            <span>Explorar Portal</span>
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

        {/* Diagrama de Flujo del Proyecto (Línea de tiempo simplificada) */}
        <div className="w-full mt-8">
          <h2 className="text-xs font-serif font-semibold uppercase tracking-[0.2em] text-slate-500 mb-10">
            Ciclo de Procesamiento
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Líneas conectoras en desktop */}
            <div className="hidden md:block absolute top-7 left-[16%] right-[16%] h-[1px] bg-gradient-to-r from-[#800a0a]/10 via-[#e61919]/30 to-[#800a0a]/10 z-0"></div>
            
            {pasosFlujo.map((paso, index) => (
              <div key={index} className="flex flex-col items-center gap-4 relative z-10 group">
                <div className="w-14 h-14 rounded-full bg-[#0c0202] border-2 border-[#800a0a]/60 group-hover:border-[#e61919] flex items-center justify-center text-[#e61919] font-serif font-bold text-lg shadow-[0_0_10px_rgba(128,10,10,0.3)] group-hover:shadow-[0_0_20px_rgba(230,25,25,0.6)] transition-all duration-500">
                  {paso.numero}
                </div>
                <h3 className="text-sm font-serif font-semibold uppercase tracking-widest text-slate-300 group-hover:text-slate-100 transition-colors duration-300">
                  {paso.titulo}
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed font-sans px-4">
                  {paso.descripcion}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Tarjetas Informativas de Módulos */}
        <div className="w-full mt-8 border-t border-[#800a0a]/10 pt-16">
          <h2 className="text-xs font-serif font-semibold uppercase tracking-[0.2em] text-slate-500 mb-10">
            Nuestros Módulos
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {tarjetasModulos.map((mod, index) => (
              <div 
                key={index}
                className="goth-card rounded-2xl p-6 flex flex-col items-center text-center gap-4 border border-[#800a0a]/20 hover:border-[#e61919]/40 hover:-translate-y-1.5 transition-all duration-300 relative overflow-hidden group"
              >
                <div className="p-3.5 bg-[#800a0a]/5 border border-[#800a0a]/30 rounded-2xl group-hover:bg-[#800a0a]/10 group-hover:border-[#e61919]/60 transition-all duration-300 mb-2">
                  {mod.icono}
                </div>
                <div>
                  <h3 className="text-lg font-gothic tracking-wider text-slate-200 group-hover:text-slate-100 uppercase transition-colors duration-300">
                    {mod.nombre}
                  </h3>
                  <span className="text-[10px] font-serif uppercase tracking-widest text-[#e61919] mt-0.5 block font-semibold">
                    {mod.tagline}
                  </span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed font-sans mt-1">
                  {mod.descripcion}
                </p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
