import React from 'react';

/**
 * Componente de Presentación (Landing Page / Hero Section) para Resonancia.
 * Diseñado con estética premium Gótica-Cyberpunk.
 * Explica el flujo específico de cada módulo y permite ingresar directamente a ellos.
 */
export default function Landing({ alSeleccionarModulo }) {
  
  const modulosInfo = [
    {
      id: "espejo",
      nombre: "Espejo",
      tagline: "El reflejo del alma",
      descripcion: "Explora la empatía semántica introduciendo tu estado de ánimo o situación emocional. El sistema buscará en la historia el eco de pensadores que sintieron lo mismo que tú.",
      icono: (
        <svg className="w-6 h-6 text-[#e61919]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.114 5.636a9 9 0 010 12.728M16.463 8.288a5.25 5.25 0 010 7.424M6.75 8.25l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75z" />
        </svg>
      ),
      flujo: [
        { paso: "1", titulo: "Expresar", desc: "Escribes tu emoción actual en la barra de consulta." },
        { paso: "2", titulo: "Buscar", desc: "El algoritmo analiza el significado profundo de tus palabras." },
        { paso: "3", titulo: "Reflejar", desc: "Se te muestran las citas reales más afines con su porcentaje de afinidad." }
      ]
    },
    {
      id: "tribuna",
      nombre: "Tribuna",
      tagline: "El debate ilustrado",
      descripcion: "Formula preguntas existenciales o dilemas éticos. Una inteligencia artificial local responderá con un discurso de dos párrafos apoyado sólidamente en fuentes de citas maestras.",
      icono: (
        <svg className="w-6 h-6 text-[#e61919]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
        </svg>
      ),
      flujo: [
        { paso: "1", titulo: "Plantear", desc: "Preguntas un dilema existencial en la barra de entrada." },
        { paso: "2", titulo: "Respaldar", desc: "El orador extrae citas reales y verifica el umbral de rigor." },
        { paso: "3", titulo: "Discursar", desc: "Se escribe un ensayo argumentativo con la cita resaltada en rojo." }
      ]
    },
    {
      id: "bitacora",
      nombre: "Bitácora",
      tagline: "El archivo del pensamiento",
      descripcion: "Tu diario íntimo de reflexiones. Registra notas de tu vida diaria y pon a prueba su eficiencia compacta bajo un estricto límite de espacio e indicadores de color.",
      icono: (
        <svg className="w-6 h-6 text-[#e61919]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      ),
      flujo: [
        { paso: "1", titulo: "Anotar", desc: "Escribes reflexiones personales dentro de tu diario." },
        { paso: "2", titulo: "Empaquetar", desc: "El sistema agrupa los textos en bloques de tamaño limitado." },
        { paso: "3", titulo: "Medir", desc: "Se calcula la eficiencia con barras de color (rojo=lleno, amarillo=vacío)." }
      ]
    }
  ];

  return (
    <section className="w-full min-h-screen flex flex-col justify-center items-center px-6 py-16 relative overflow-hidden select-none">
      
      {/* Luces neón en el fondo */}
      <div className="absolute top-1/4 left-[10%] w-96 h-96 rounded-full bg-[#800a0a]/5 blur-[120px] pointer-events-none animate-float-slow"></div>
      <div className="absolute bottom-1/4 right-[10%] w-[450px] h-[450px] rounded-full bg-[#e61919]/3 blur-[150px] pointer-events-none animate-float-medium"></div>

      <div className="max-w-6xl w-full flex flex-col items-center text-center gap-14 relative z-10">
        
        {/* Cabecera de la Landing */}
        <div className="flex flex-col items-center gap-4">
          <h1 className="text-6xl md:text-8xl font-gothic tracking-[0.25em] text-slate-100 goth-glow-text uppercase">
            Resonancia
          </h1>
          <p className="text-sm md:text-base font-serif text-[#e61919] uppercase tracking-widest max-w-2xl px-4 mt-2 font-bold">
            Donde las ideas del pasado resuenan en el debate del presente.
          </p>
          <div className="w-32 h-[1px] bg-gradient-to-r from-transparent via-[#e61919]/60 to-transparent mt-3"></div>
          <p className="text-sm md:text-base text-slate-400 font-serif leading-relaxed max-w-3xl px-6 mt-4">
            Un portal interactivo donde la literatura clásica y el pensamiento moderno se unifican mediante inteligencia artificial. Selecciona uno de nuestros módulos a continuación para comenzar tu exploración.
          </p>
        </div>

        {/* Módulos de Información con Título, Descripción y Flujo Individual */}
        <div className="w-full grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch mt-4">
          {modulosInfo.map((mod) => (
            <div 
              key={mod.id} 
              className="goth-card rounded-2xl p-6 flex flex-col justify-between border border-[#800a0a]/30 hover:border-[#e61919]/55 transition-all duration-300 relative overflow-hidden group gap-6 text-left"
            >
              {/* Encabezado del Módulo */}
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-[#800a0a]/10 border border-[#800a0a]/30 rounded-xl">
                    {mod.icono}
                  </div>
                  <div>
                    <h3 className="text-xl font-gothic tracking-wider text-slate-200 uppercase">
                      {mod.nombre}
                    </h3>
                    <span className="text-[9px] font-serif uppercase tracking-widest text-[#e61919] font-bold block">
                      {mod.tagline}
                    </span>
                  </div>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed font-sans mt-1">
                  {mod.descripcion}
                </p>
              </div>

              {/* Ciclo de Procedimiento del Módulo */}
              <div className="border-t border-[#800a0a]/20 pt-4 flex flex-col gap-3.5">
                <span className="text-[10px] font-serif uppercase tracking-widest text-slate-500 font-bold block mb-1">
                  Flujo de Funcionamiento:
                </span>
                <div className="flex flex-col gap-3">
                  {mod.flujo.map((f, i) => (
                    <div key={i} className="flex gap-3 items-start">
                      <span className="w-5 h-5 rounded-full bg-[#0c0202] border border-[#800a0a] flex items-center justify-center text-[10px] text-[#e61919] font-bold shrink-0 mt-0.5">
                        {f.paso}
                      </span>
                      <div>
                        <span className="text-xs font-serif text-slate-300 font-semibold block">{f.titulo}</span>
                        <p className="text-[10px] text-slate-500 leading-normal font-sans mt-0.5">{f.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Botón de Entrada Directa */}
              <div className="pt-2 border-t border-[#800a0a]/10">
                <button
                  onClick={() => alSeleccionarModulo(mod.id)}
                  className="w-full bg-[#800a0a] hover:bg-[#e61919] text-slate-100 font-serif uppercase tracking-widest font-bold py-3 rounded-xl text-[10px] transition-all duration-300 border border-[#e61919]/30 shadow-[0_2px_10px_rgba(128,10,10,0.3)] hover:shadow-[0_4px_15px_rgba(230,25,25,0.5)] cursor-pointer text-center"
                >
                  Entrar a {mod.nombre}
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
