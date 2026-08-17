import React, { useState, useEffect, useRef } from 'react';
import Espejo from './componentes/Espejo';
import Tribuna from './componentes/Tribuna';
import Bitacora from './componentes/Bitacora';
import Landing from './componentes/Landing';

/**
 * Componente Principal de la SPA "Resonancia".
 * Rediseñado con estética Gótica-Cyberpunk inspirada en la colorimetría,
 * bordes y tipografías del estilo Liazid Oussama.
 * Incluye un efecto dinámico de partículas global a pantalla completa visible sobre el fondo.
 */
function App() {
  // Estado para controlar si vemos la Landing de presentación o el Portal interactivo
  const [vistaActiva, setVistaActiva] = useState('landing');
  // Estado para controlar la pestaña o módulo activo en el Portal
  const [moduloActivo, setModuloActivo] = useState('espejo');
  const canvasRef = useRef(null);

  // Efecto dinámico de partículas global (Cenizas Góticas Flotantes)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const numParticulas = 80; // Cantidad visible
    const particulas = [];
    for (let i = 0; i < numParticulas; i++) {
      particulas.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 2.5 + 1.0, // Partículas más grandes y notorias
        vx: (Math.random() - 0.5) * 0.2,
        vy: -(Math.random() * 0.6 + 0.25), // Movimiento ascendente notable
        alpha: Math.random() * 0.5 + 0.45 // Más opacas para mayor contraste
      });
    }

    const animar = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      particulas.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;

        // Si sale por arriba, renace abajo con dispersión
        if (p.y < -10) {
          p.y = canvas.height + Math.random() * 20;
          p.x = Math.random() * canvas.width;
          p.vy = -(Math.random() * 0.6 + 0.25);
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(230, 25, 25, ${p.alpha})`;
        ctx.shadowBlur = 6;
        ctx.shadowColor = 'rgba(230, 25, 25, 0.9)'; // Brillo rojo gótico intenso
        ctx.fill();
        ctx.shadowBlur = 0; // Reset
      });

      animationFrameId = requestAnimationFrame(animar);
    };
    animar();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  const alSeleccionarModulo = (idModulo) => {
    setModuloActivo(idModulo);
    setVistaActiva('app');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Función para renderizar el componente dinámicamente según el estado del enrutador
  const renderizarModulo = () => {
    switch (moduloActivo) {
      case 'espejo':
        return <Espejo />;
      case 'tribuna':
        return <Tribuna />;
      case 'bitacora':
        return <Bitacora />;
      default:
        return <Espejo />;
    }
  };

  // Renderizado del layout principal con fondo y canvas a nivel raíz
  return (
    <div className="min-h-screen text-slate-100 flex flex-col font-sans relative bg-transparent">
      
      {/* 1. Fondo Gótico Fijo Global (fuera de cualquier transform) */}
      <div className="fixed inset-0 goth-bg-main -z-20 pointer-events-none" />

      {/* 2. Canvas Partículas Fijo Global (fuera de cualquier transform) */}
      <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none -z-10 opacity-90" />

      {/* 3. Renderizado Condicional de Vistas */}
      {vistaActiva === 'landing' ? (
        <div className="w-full flex-grow animate-fade-in">
          <Landing alSeleccionarModulo={alSeleccionarModulo} />
        </div>
      ) : (
        <div className="flex flex-col min-h-screen animate-fade-in">
          {/* Barra de navegación superior con diseño gótico-cyberpunk */}
          <header className="sticky top-0 z-50 bg-[#0c0202]/90 border-b-2 border-[#800a0a]/80 shadow-[0_4px_25px_rgba(128,10,10,0.5)]">
            <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
              
              {/* Logotipo del proyecto al estilo Gótico */}
              <div className="flex items-center gap-3 cursor-pointer" onClick={() => setVistaActiva('landing')}>
                {/* Gema Gótica Roja con Pulso de Luz */}
                <div className="w-4 h-4 bg-gradient-to-br from-[#e61919] to-[#800a0a] rounded-full animate-pulse shadow-[0_0_15px_#e61919] border border-[#e61919]/50"></div>
                <span className="text-3xl font-gothic tracking-widest text-slate-100 goth-glow-text">
                  RESONANCIA
                </span>
              </div>

              {/* Menú de pestañas de navegación góticas */}
              <nav className="flex items-center gap-3">
                
                {/* Botón Volver al Inicio (Landing) */}
                <button
                  onClick={() => setVistaActiva('landing')}
                  className="px-4 py-2.5 rounded-lg text-xs font-serif uppercase tracking-widest transition-all duration-300 border-2 bg-black/60 border-[#800a0a]/40 text-[#e61919]/80 hover:text-[#e61919] hover:border-[#e61919] flex items-center gap-1.5 cursor-pointer"
                >
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  <span>Inicio</span>
                </button>

                {/* Divisor vertical */}
                <div className="w-[1px] h-6 bg-[#800a0a]/40 mx-1"></div>
                
                {/* Botón Espejo (Módulo 1) */}
                <button
                  onClick={() => setModuloActivo('espejo')}
                  className={`px-5 py-2.5 rounded-lg text-xs font-serif uppercase tracking-widest transition-all duration-300 border-2 ${
                    moduloActivo === 'espejo'
                      ? 'bg-[#250505] border-[#e61919] text-[#e61919] goth-glow-text shadow-[0_0_15px_rgba(230,25,25,0.4)]'
                      : 'bg-[#0c0202] border-[#800a0a]/60 text-slate-400 hover:text-slate-200 hover:border-[#800a0a]'
                  }`}
                >
                  Espejo
                </button>

                {/* Botón Tribuna (Módulo 2) */}
                <button
                  onClick={() => setModuloActivo('tribuna')}
                  className={`px-5 py-2.5 rounded-lg text-xs font-serif uppercase tracking-widest transition-all duration-300 border-2 ${
                    moduloActivo === 'tribuna'
                      ? 'bg-[#250505] border-[#e61919] text-[#e61919] goth-glow-text shadow-[0_0_15px_rgba(230,25,25,0.4)]'
                      : 'bg-[#0c0202] border-[#800a0a]/60 text-slate-400 hover:text-slate-200 hover:border-[#800a0a]'
                  }`}
                >
                  Tribuna
                </button>

                {/* Botón Bitácora (Módulo 3) */}
                <button
                  onClick={() => setModuloActivo('bitacora')}
                  className={`px-5 py-2.5 rounded-lg text-xs font-serif uppercase tracking-widest transition-all duration-300 border-2 ${
                    moduloActivo === 'bitacora'
                      ? 'bg-[#250505] border-[#e61919] text-[#e61919] goth-glow-text shadow-[0_0_15px_rgba(230,25,25,0.4)]'
                      : 'bg-[#0c0202] border-[#800a0a]/60 text-slate-400 hover:text-slate-200 hover:border-[#800a0a]'
                  }`}
                >
                  Bitácora
                </button>

              </nav>

            </div>
          </header>

          {/* Contenedor principal de la SPA con animación de cambio de pestaña */}
          <main className="flex-grow max-w-6xl w-full mx-auto px-6 py-12 flex flex-col justify-center overflow-hidden">
            <div key={moduloActivo} className="animate-slide-up-fade">
              {renderizarModulo()}
            </div>
          </main>

          {/* Pie de página gótico */}
          <footer className="border-t-2 border-[#800a0a]/80 bg-[#0c0202] py-6 text-center text-xs text-slate-500 font-serif tracking-widest">
            <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
              <p>RESONANCIA &copy; 2026. GRABADO EN EL MONSTER-REPOSITORIO.</p>
              <div className="flex gap-6 text-[#800a0a]">
                <span className="hover:text-[#e61919] transition-colors cursor-pointer" onClick={() => setModuloActivo('espejo')}>ESPEJO</span>
                <span className="hover:text-[#e61919] transition-colors cursor-pointer" onClick={() => setModuloActivo('tribuna')}>TRIBUNA</span>
                <span className="hover:text-[#e61919] transition-colors cursor-pointer" onClick={() => setModuloActivo('bitacora')}>BITÁCORA</span>
              </div>
            </div>
          </footer>
        </div>
      )}
    </div>
  );
}

export default App;
