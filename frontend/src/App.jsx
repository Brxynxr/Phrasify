import React, { useState } from 'react';
import Espejo from './componentes/Espejo';
import Tribuna from './componentes/Tribuna';
import Bitacora from './componentes/Bitacora';

/**
 * Componente Principal de la SPA "Resonancia".
 * Rediseñado con estética Gótica-Cyberpunk inspirada en la colorimetría,
 * bordes y tipografías del estilo Liazid Oussama.
 */
function App() {
  // Estado para controlar la pestaña o módulo activo
  const [moduloActivo, setModuloActivo] = useState('espejo');

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

  return (
    <div className="min-h-screen goth-bg-main text-slate-100 flex flex-col font-sans select-none">
      
      {/* Barra de navegación superior con diseño gótico-cyberpunk */}
      <header className="sticky top-0 z-50 bg-[#0c0202]/90 border-b-2 border-[#800a0a]/80 shadow-[0_4px_25px_rgba(128,10,10,0.5)]">
        <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
          
          {/* Logotipo del proyecto al estilo Gótico */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setModuloActivo('espejo')}>
            {/* Gema Gótica Roja con Pulso de Luz */}
            <div className="w-4 h-4 bg-gradient-to-br from-[#e61919] to-[#800a0a] rounded-full animate-pulse shadow-[0_0_15px_#e61919] border border-[#e61919]/50"></div>
            <span className="text-3xl font-gothic tracking-widest text-[#slate-100] goth-glow-text">
              RESONANCIA
            </span>
          </div>

          {/* Menú de pestañas de navegación góticas */}
          <nav className="flex items-center gap-3">
            
            {/* Botón Espejo (Módulo 1) */}
            <button
              onClick={() => setModuloActivo('espejo')}
              className={`px-5 py-2.5 rounded-lg text-xs font-serif uppercase tracking-widest transition-all duration-300 border-2 ${
                moduloActivo === 'espejo'
                  ? 'bg-[#250505] border-[#e61919] text-[#e61919] goth-glow-text shadow-[0_0_15px_rgba(230,25,25,0.4)]'
                  : 'bg-[#0c0202] border-[#800a0a]/60 text-slate-400 hover:text-slate-200 hover:border-[#800a0a]'
              }`}
            >
              ✠ Espejo ✠
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
              ✠ Tribuna ✠
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
              ✠ Bitácora ✠
            </button>

          </nav>

        </div>
      </header>

      {/* Contenedor principal de la SPA */}
      <main className="flex-grow max-w-6xl w-full mx-auto px-6 py-12 flex flex-col justify-center">
        {renderizarModulo()}
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
  );
}

export default App;
