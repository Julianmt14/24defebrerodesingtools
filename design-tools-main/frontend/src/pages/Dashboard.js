import React from 'react';
import { useNavigate } from 'react-router-dom';

const directTools = [
  { name: 'Despiece de Vigas', icon: 'rebase_edit', color: 'text-primary', path: '/tools/despiece-de-vigas' },
  { name: 'Dimensionar Tornillos', icon: 'hardware', color: 'text-indigo-400', path: '/tools/dimensionar-tornillos' },
];



const bottomNavItems = [
  { label: 'Proyectos', icon: 'dashboard', active: true, path: '/' },
  { label: 'Sincronización', icon: 'sync', active: false, path: '/sincronizacion' },
  { label: 'Biblioteca', icon: 'library_books', active: false, path: '/biblioteca' },
  { label: 'Configuración', icon: 'settings', active: false, path: '/configuracion' },
];

const Dashboard = () => {
  const navigate = useNavigate();

  const goToTool = (path) => {
    navigate(path);
  };

  return (
    <div
      className="min-h-screen pb-24"
      style={{ backgroundColor: '#0b1120', color: '#e2e8f0' }}
    >
      <nav
        className="sticky top-0 z-50 backdrop-blur-md border-b border-[#1c2436]"
        style={{ backgroundColor: 'rgba(7, 12, 24, 0.95)' }}
      >
        <div className="flex items-center p-4 justify-between max-w-xl mx-auto">
          <div className="flex items-center gap-3">
            <div className="bg-primary p-1.5 rounded-lg flex items-center justify-center">
              <span className="material-symbols-outlined text-white text-[20px]">architecture</span>
            </div>
            <h2 className="text-white text-lg font-bold leading-tight tracking-tight">Panel de Control</h2>
          </div>
          <button
            type="button"
            className="flex items-center gap-2 px-4 h-10 rounded-full bg-primary text-white shadow-lg shadow-primary/20 active:scale-95 transition-transform"
            onClick={() => navigate('/studio')}
          >
            <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>
              add
            </span>
            <span className="text-sm font-semibold">Nuevo Proyecto</span>
          </button>
        </div>
      </nav>

      <div className="max-w-xl mx-auto px-4 py-3">
        <label className="flex flex-col min-w-40 h-12 w-full">
          <div className="flex w-full flex-1 items-stretch rounded-xl h-full shadow-sm">
            <div className="text-[#92a4c9] flex border-none bg-[#111a2b] items-center justify-center pl-4 rounded-l-xl">
              <span className="material-symbols-outlined">search</span>
            </div>
            <input
              className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-r-xl text-slate-100 focus:outline-0 focus:ring-0 border-none bg-[#111a2b] h-full placeholder:text-[#7f8fb5] px-4 pl-2 text-base font-normal leading-normal"
              placeholder="Buscar proyecto..."
            />
          </div>
        </label>

        <div className="mt-4 mb-2">
          <p className="text-[11px] font-bold uppercase tracking-[0.1em] text-[#8ea2d6] mb-3 px-1">Herramientas Disponibles</p>
          <div className="grid grid-cols-2 gap-3 pb-2">
            {directTools.map((tool) => (
              <button
                type="button"
                key={tool.name}
                className="flex flex-col h-28 items-center justify-center gap-y-3 rounded-2xl bg-[#111a2b] p-4 border border-[#1f2a3d] shadow-sm hover:border-[#2a3852] hover:bg-[#121b2d] active:scale-95 transition-all w-full group"
                onClick={() => goToTool(tool.path)}
              >
                <div className={`p-2 rounded-xl bg-[#0b1120] border border-[#1f2a3d] group-hover:border-[#2a3852] transition-colors`}>
                  <span className={`material-symbols-outlined ${tool.color} text-[28px] block`}>{tool.icon}</span>
                </div>
                <p className="text-slate-200 text-sm font-bold text-center leading-tight">{tool.name}</p>
              </button>
            ))}
          </div>
        </div>
      </div>



      <div className="fixed bottom-0 left-0 right-0 z-50 bg-[#141c2c]/90 backdrop-blur-xl border-t border-[#1f2a3d] pb-8 pt-2">
        <div className="max-w-xl mx-auto flex justify-around items-center px-4">
          {bottomNavItems.map((item) => (
            <button
              type="button"
              key={item.label}
              className={`flex flex-col items-center gap-1 ${item.active ? 'text-primary' : 'text-[#7b8dbb]'}`}
              onClick={() => navigate(item.path)}
            >
              <span
                className="material-symbols-outlined"
                style={{ fontVariationSettings: item.active ? "'FILL' 1" : "'FILL' 0" }}
              >
                {item.icon}
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider">{item.label}</span>
            </button>
          ))}
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap');

        .material-symbols-outlined {
          font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
        }

        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }

        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>

      <style>{`
        :root {
          --primary: #135bec;
          --background-light: #f6f6f8;
          --background-dark: #101622;
        }

        .bg-primary {
          background-color: var(--primary);
        }

        .text-primary {
          color: var(--primary);
        }

        .bg-background-light {
          background-color: var(--background-light);
        }

        .bg-background-dark {
          background-color: var(--background-dark);
        }

        .shadow-primary\/20 {
          box-shadow: 0 10px 15px -3px rgba(19, 91, 236, 0.2);
        }
      `}</style>
    </div>
  );
};

export default Dashboard;