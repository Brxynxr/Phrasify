import React, { useState } from 'react';
import BuscadorVibras from './componentes/BuscadorVibras';
import OradorDebates from './componentes/OradorDebates';
import OptimizadorLotes from './componentes/OptimizadorLotes';

/**
 * Componente Principal de la SPA "Resonancia".
 * Maneja el enrutamiento interno mediante estados, la barra de navegación compartida
 * y la consistencia de estilos a través del layout base.
 */
function App() {
  // Estado para controlar la pestaña o módulo activo
  const [moduloActivo, setModuloActivo] = useState('buscador');

  // Función para renderizar el componente dinámicamente según el estado del enrutador
  const renderizarModulo = () => {
    switch (moduloActivo) {
      case 'buscador':
        return <BuscadorVibras />;
      case 'orador':
        return <OradorDebates />;
      case 'optimizador':
        return <OptimizadorLotes />;
      default:
        return <BuscadorVibras />;
    }
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-black text-slate-100 flex flex-col font-sans">
      
      {/* Barra de navegación superior con diseño Glassmorphism */}
      <header className="sticky top-0 z-50 bg-slate-950/70 backdrop-blur-md border-b border-slate-800/80">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          
          {/* Logotipo del proyecto con efecto de pulsación brillante */}
          <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => setModuloActivo('buscador')}>
            <div className="w-3.5 h-3.5 bg-gradient-to-tr from-violet-500 to-indigo-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(139,92,246,0.6)]"></div>
            <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-slate-100 to-slate-300 bg-clip-text text-transparent">
              Resonancia
            </span>
          </div>

          {/* Menú de pestañas de navegación */}
          <nav className="flex items-center gap-2">
            
            {/* Botón Buscador de Vibras */}
            <button
              onClick={() => setModuloActivo('buscador')}
              className={`relative px-4 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all duration-300 ${
                moduloActivo === 'buscador'
                  ? 'bg-violet-500/10 border border-violet-500/30 text-violet-400'
                  : 'border border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/50'
              }`}
            >
              Buscador
              {moduloActivo === 'buscador' && (
                <span className="absolute -bottom-[17px] left-0 right-0 h-[2px] bg-violet-500 shadow-[0_0_8px_#8b5cf6]"></span>
              )}
            </button>

            {/* Botón Orador de Debates */}
            <button
              onClick={() => setModuloActivo('orador')}
              className={`relative px-4 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all duration-300 ${
                moduloActivo === 'orador'
                  ? 'bg-indigo-500/10 border border-indigo-500/30 text-indigo-400'
                  : 'border border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/50'
              }`}
            >
              Orador
              {moduloActivo === 'orador' && (
                <span className="absolute -bottom-[17px] left-0 right-0 h-[2px] bg-indigo-500 shadow-[0_0_8px_#6366f1]"></span>
              )}
            </button>

            {/* Botón Optimizador de Lotes */}
            <button
              onClick={() => setModuloActivo('optimizador')}
              className={`relative px-4 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all duration-300 ${
                moduloActivo === 'optimizador'
                  ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400'
                  : 'border border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/50'
              }`}
            >
              Lotes
              {moduloActivo === 'optimizador' && (
                <span className="absolute -bottom-[17px] left-0 right-0 h-[2px] bg-emerald-500 shadow-[0_0_8px_#10b981]"></span>
              )}
            </button>

          </nav>

        </div>
      </header>

      {/* Contenedor principal de la SPA */}
      <main className="flex-grow max-w-6xl w-full mx-auto px-6 py-12 flex flex-col justify-center">
        {renderizarModulo()}
      </main>

      {/* Pie de página descriptivo */}
      <footer className="border-t border-slate-900 bg-black/20 py-6 text-center text-xs text-slate-600">
        <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>Resonancia &copy; 2026. Todos los derechos reservados.</p>
          <div className="flex gap-4">
            <span className="hover:text-slate-400 transition-colors">Buscador de Vibras</span>
            <span className="hover:text-slate-400 transition-colors">Orador de Debates</span>
            <span className="hover:text-slate-400 transition-colors">Optimizador</span>
          </div>
        </div>
      </footer>

    </div>
  );
}

export default App;
