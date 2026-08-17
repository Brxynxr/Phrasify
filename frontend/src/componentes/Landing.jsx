import React from 'react';

/**
 * Componente de Presentación (Landing Page) para Resonancia.
 * Diseñado con estética premium Gótica-Cyberpunk "libre" (sin tarjetas encerradas).
 * Muestra el flujo de pasos alternando la distribución y usando colores de acento
 * únicos para cada módulo (rojo, púrpura y ámbar) con animaciones en cascada.
 */
export default function Landing({ alSeleccionarModulo }) {
  
  const modulosInfo = [
    {
      id: "espejo",
      nombre: "Espejo",
      tagline: "El reflejo del alma",
      descripcion: "Explora la empatía semántica introduciendo tu estado de ánimo o situación emocional. El sistema buscará en la historia el eco de pensadores que sintieron lo mismo que tú.",
      icono: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.114 5.636a9 9 0 010 12.728M16.463 8.288a5.25 5.25 0 010 7.424M6.75 8.25l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75z" />
        </svg>
      ),
      flujo: [
        { paso: "I", titulo: "Expresar", desc: "Escribes tu emoción actual en la barra de consulta." },
        { paso: "II", titulo: "Buscar", desc: "El algoritmo analiza el significado profundo de tus palabras." },
        { paso: "III", titulo: "Reflejar", desc: "Se te muestran las citas reales más afines en círculos de neón." }
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
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
        </svg>
      ),
      flujo: [
        { paso: "I", titulo: "Plantear", desc: "Preguntas un dilema existencial en la barra de entrada." },
        { paso: "II", titulo: "Respaldar", desc: "El orador comprueba la afinidad mínima con citas reales." },
        { paso: "III", titulo: "Discursar", desc: "Se genera un ensayo argumentativo con la cita resaltada en rojo." }
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
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      ),
      flujo: [
        { paso: "I", titulo: "Anotar", desc: "Escribes reflexiones personales dentro de tu diario." },
        { paso: "II", titulo: "Empaquetar", desc: "El sistema agrupa los textos en bloques de tamaño limitado." },
        { paso: "III", titulo: "Medir", desc: "Se calcula la eficiencia con barras de color (rojo=lleno, amarillo=vacío)." }
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
    <section className="w-full min-h-screen flex flex-col justify-center items-center px-6 py-24 relative overflow-x-hidden select-none">
      
      {/* Luces neón en el fondo */}
      <div className="absolute top-[15%] left-[5%] w-96 h-96 rounded-full bg-[#800a0a]/5 blur-[130px] pointer-events-none animate-float-slow"></div>
      <div className="absolute bottom-[20%] right-[5%] w-[450px] h-[450px] rounded-full bg-[#e61919]/3 blur-[160px] pointer-events-none animate-float-medium"></div>

      <div className="max-w-5xl w-full flex flex-col items-center gap-20 relative z-10">
        
        {/* Cabecera de la Landing */}
        <div className="flex flex-col items-center gap-4 text-center animate-fade-in">
          <h1 className="text-6xl md:text-8xl font-gothic tracking-[0.25em] text-slate-100 goth-glow-text uppercase">
            Resonancia
          </h1>
          <p className="text-sm md:text-base font-serif text-[#e61919] uppercase tracking-widest max-w-2xl px-4 mt-2 font-bold">
            Donde las ideas del pasado resuenan en el debate del presente.
          </p>
          <div className="w-32 h-[1px] bg-gradient-to-r from-transparent via-[#e61919]/60 to-transparent mt-3"></div>
          <p className="text-sm md:text-base text-slate-400 font-serif leading-relaxed max-w-2xl px-6 mt-4">
            Un espacio interactivo que une la literatura clásica y el pensamiento moderno mediante inteligencia artificial. Explora los módulos y sus flujos de procesamiento a continuación.
          </p>
        </div>

        {/* Módulos en Estructura Libre Vertical con distribución alternada */}
        <div className="w-full flex flex-col gap-28 mt-8">
          {modulosInfo.map((mod, modIdx) => (
            <div 
              key={mod.id} 
              className={`w-full flex flex-col md:grid md:grid-cols-12 gap-8 md:gap-12 items-center relative animate-fade-in opacity-0-init ${mod.delayClass}`}
            >
              {/* Separador entre módulos (salvo el primero) */}
              {modIdx > 0 && (
                <div className="absolute -top-14 left-1/4 right-1/4 h-[1px] bg-gradient-to-r from-transparent via-[#800a0a]/15 to-transparent pointer-events-none" />
              )}

              {/* Bloque de Información del Módulo */}
              <div className={`flex flex-col gap-4 md:col-span-5 ${mod.invertido ? 'md:order-2 md:items-end md:text-right' : 'md:items-start md:text-left'} items-center text-center`}>
                <div className="flex items-center gap-3">
                  <div className={`p-2.5 rounded-xl ${mod.iconClass}`}>
                    {mod.icono}
                  </div>
                  <h2 className={`text-3xl font-gothic tracking-widest uppercase ${mod.glowClass}`}>
                    {mod.nombre}
                  </h2>
                </div>
                <span className={`text-[10px] font-serif uppercase tracking-widest font-bold block ${mod.taglineClass}`}>
                  {mod.tagline}
                </span>
                <p className="text-sm text-slate-400 leading-relaxed font-serif mt-2 max-w-md">
                  {mod.descripcion}
                </p>
                <div className="mt-3">
                  <button
                    onClick={() => alSeleccionarModulo(mod.id)}
                    className={`font-serif uppercase tracking-widest font-bold px-8 py-3.5 rounded-xl text-[10px] transition-all duration-300 border-2 cursor-pointer ${mod.btnClass}`}
                  >
                    Explorar {mod.nombre}
                  </button>
                </div>
              </div>

              {/* Bloque del Ciclo de Procedimiento */}
              <div className={`w-full md:col-span-7 relative px-4 ${mod.invertido ? 'md:order-1' : ''}`}>
                {/* Línea conectora horizontal solo para desktop */}
                <div className={`hidden md:block absolute top-[22px] left-[15%] right-[15%] h-[1px] bg-gradient-to-r from-transparent ${mod.conectorClass} to-transparent z-0`} />
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-4 relative z-10">
                  {mod.flujo.map((f, idx) => (
                    <div key={idx} className="flex flex-col items-center text-center gap-3 group">
                      <div className={`w-11 h-11 rounded-full bg-[#0c0202] border-2 flex items-center justify-center font-serif font-bold text-xs transition-all duration-300 ${mod.circleClass}`}>
                        {f.paso}
                      </div>
                      <div className="flex flex-col gap-1">
                        <span className="text-xs font-serif text-slate-300 font-semibold uppercase tracking-wider">
                          {f.titulo}
                        </span>
                        <p className="text-[11px] text-slate-500 leading-relaxed font-sans px-2">
                          {f.desc}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
