import { Activity, User, Clock, Settings, LogOut, Menu, X, FileText, BarChart3 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Navbar() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isAdmin] = useState(true); // Simulado para demo
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('es-ES', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
    });
  };

  const handleLogout = () => {
    if (!window.confirm('¿Estás seguro de cerrar sesión?')) {
      return;
    }
    navigate('/');
  };

  const handleNavigation = (path: string) => {
    navigate(path);
    setIsMenuOpen(false);
  };

  return (
    <>
      <nav className="w-full relative overflow-visible sticky top-0 z-50">
        {/* Fondo con gradiente amazónico */}
        <div className="absolute inset-0 bg-gradient-to-br from-green-800 via-green-700 to-emerald-700"></div>
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `radial-gradient(circle at 25% 25%, rgba(255,255,255,0.2) 2px, transparent 2px),
                             radial-gradient(circle at 75% 75%, rgba(255,255,255,0.1) 1px, transparent 1px)`,
            backgroundSize: '50px 50px',
          }}
        ></div>

        <div className="relative z-10 px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
          {/* Desktop Layout CORREGIDO */}
          <div className="hidden lg:flex items-center justify-between">
            {/* Izquierda: Menú hamburguesa Y usuario juntos */}
            <div className="flex items-center gap-4 flex-1">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="group relative h-12 w-12 bg-white/10 backdrop-blur-sm hover:bg-white/20 rounded-2xl transition-all duration-300 border border-white/20 hover:border-white/40 shadow-xl hover:scale-105"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent rounded-2xl"></div>
                {isMenuOpen ? (
                  <X size={20} className="text-white m-auto transition-transform duration-300" />
                ) : (
                  <Menu size={20} className="text-white m-auto transition-transform duration-300" />
                )}
              </button>

              {/* Usuario - AHORA ESTÁ A LA IZQUIERDA */}
              <div className="group flex items-center gap-3 h-12 bg-white/10 backdrop-blur-sm rounded-2xl px-5 border border-white/20 hover:bg-white/20 hover:border-white/40 transition-all duration-300 shadow-xl">
                <div className="h-8 w-8 bg-gradient-to-br from-green-400 to-emerald-500 rounded-xl flex items-center justify-center shadow-lg flex-shrink-0">
                  <User size={16} className="text-white" />
                </div>
                <div>
                  <span className="font-bold text-white text-sm block truncate">
                    {isAdmin ? 'Administrador' : 'Operador'}
                  </span>
                </div>
              </div>
            </div>

            {/* Centro: Logo y título - ABSOLUTO CENTRADO */}
            <div className="flex items-center gap-4 flex-shrink-0 absolute left-1/2 transform -translate-x-1/2 cursor-pointer" onClick={() => handleNavigation('/dashboard')}>
              <div className="relative h-14 w-14">
                <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-white/5 rounded-2xl"></div>
                <div className="relative h-full w-full bg-white/15 backdrop-blur-md rounded-2xl border border-white/30 flex items-center justify-center shadow-2xl">
                  <Activity size={28} className="text-white filter drop-shadow-lg" />
                </div>
              </div>
              <div>
                <h1 className="text-2xl font-black text-white tracking-tight filter drop-shadow-lg">
                  LabControl Pro
                </h1>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse shadow-lg"></div>
                  <span className="text-xs font-semibold text-green-200 tracking-wider">
                    UNIVERSIDAD DE LA AMAZONIA
                  </span>
                </div>
              </div>
            </div>

            {/* Derecha: Controles */}
            <div className="flex items-center gap-3 flex-1 justify-end">
              <div className="h-12 bg-white/10 backdrop-blur-sm rounded-2xl px-4 border border-white/20 shadow-xl">
                <div className="flex items-center gap-3 h-full">
                  <Clock size={16} className="text-green-300 flex-shrink-0" />
                  <div className="text-right min-w-0">
                    <div className="text-sm font-bold text-white font-mono tracking-wider">
                      {formatTime(currentTime)}
                    </div>
                    <div className="text-xs text-green-200 font-medium">
                      {formatDate(currentTime)}
                    </div>
                  </div>
                </div>
              </div>

              <button
                onClick={handleLogout}
                className="group relative h-12 w-12 bg-white/10 backdrop-blur-sm hover:bg-red-500/80 rounded-2xl transition-all duration-300 border border-white/20 hover:border-red-400/50 shadow-xl hover:shadow-2xl hover:scale-105"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent rounded-2xl"></div>
                <LogOut size={20} className="text-white m-auto transition-all duration-300 group-hover:translate-x-1" />
              </button>
            </div>
          </div>

          {/* Mobile & Tablet Layout - SIN CAMBIOS */}
          <div className="lg:hidden">
            {/* Top Bar Mobile */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative h-10 w-10 sm:h-12 sm:w-12">
                  <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-white/5 rounded-xl sm:rounded-2xl"></div>
                  <div className="relative h-full w-full bg-white/15 backdrop-blur-md rounded-xl sm:rounded-2xl border border-white/30 flex items-center justify-center shadow-2xl">
                    <Activity size={20} className="sm:hidden text-white filter drop-shadow-lg" />
                    <Activity size={24} className="hidden sm:block text-white filter drop-shadow-lg" />
                  </div>
                </div>
                <div>
                  <h1 className="text-lg sm:text-xl font-black text-white tracking-tight filter drop-shadow-lg">
                    LabControl Pro
                  </h1>
                  <div className="flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse shadow-lg"></div>
                    <span className="text-[10px] sm:text-xs font-semibold text-green-200 tracking-wider">
                      UNIAMAZONIA
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 sm:gap-3">
                <div className="h-10 sm:h-12 bg-white/10 backdrop-blur-sm rounded-xl sm:rounded-2xl px-3 border border-white/20 shadow-xl">
                  <div className="flex items-center gap-2 h-full">
                    <Clock size={14} className="text-green-300 flex-shrink-0 sm:hidden" />
                    <Clock size={16} className="text-green-300 flex-shrink-0 hidden sm:block" />
                    <div className="text-right">
                      <div className="text-xs sm:text-sm font-bold text-white font-mono">
                        {formatTime(currentTime)}
                      </div>
                      <div className="text-[10px] sm:text-xs text-green-200 font-medium hidden sm:block">
                        {formatDate(currentTime)}
                      </div>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="group relative h-10 w-10 sm:h-12 sm:w-12 bg-white/10 backdrop-blur-sm hover:bg-white/20 rounded-xl sm:rounded-2xl transition-all duration-300 border border-white/20 hover:border-white/40 shadow-xl"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent rounded-xl sm:rounded-2xl"></div>
                  {isMenuOpen ? (
                    <>
                      <X size={18} className="sm:hidden text-white m-auto" />
                      <X size={20} className="hidden sm:block text-white m-auto" />
                    </>
                  ) : (
                    <>
                      <Menu size={18} className="sm:hidden text-white m-auto" />
                      <Menu size={20} className="hidden sm:block text-white m-auto" />
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-green-400 via-emerald-400 to-green-500 shadow-lg opacity-80"></div>
        <div className="absolute -bottom-4 left-0 right-0 h-4 bg-gradient-to-b from-black/20 to-transparent"></div>
      </nav>

      {/* Desktop Menu Dropdown - Flotante */}
      <div
        className={`hidden lg:block fixed left-4 top-20 z-40 transition-all duration-300 ease-in-out ${
          isMenuOpen
            ? 'opacity-100 translate-y-0 pointer-events-auto'
            : 'opacity-0 -translate-y-4 pointer-events-none'
        }`}
      >
        <div className="bg-gradient-to-br from-green-800/95 via-green-700/95 to-emerald-700/95 backdrop-blur-xl rounded-2xl border border-white/20 shadow-2xl p-4 w-72">
          <div className="flex items-center gap-3 p-3 bg-white/10 rounded-xl border border-white/20 mb-3">
            <div className="h-10 w-10 bg-gradient-to-br from-green-400 to-emerald-500 rounded-xl flex items-center justify-center shadow-lg flex-shrink-0">
              <User size={18} className="text-white" />
            </div>
            <div>
              <span className="font-bold text-white text-sm block">
                {isAdmin ? 'Administrador' : 'Operador'}
              </span>
              <span className="text-xs text-green-200">Sesión activa</span>
            </div>
          </div>

          <div className="space-y-2">
            {isAdmin && (
              <button
                className="w-full flex items-center gap-3 p-3 bg-white/10 hover:bg-white/20 rounded-xl border border-white/20 hover:border-white/40 transition-all duration-300"
                onClick={() => handleNavigation('/users')}
              >
                <User size={18} className="text-white" />
                <span className="text-white font-semibold text-sm">Configuración de Usuarios</span>
              </button>
            )}
            <button
              className="w-full flex items-center gap-3 p-3 bg-white/10 hover:bg-white/20 rounded-xl border border-white/20 hover:border-white/40 transition-all duration-300"
              onClick={() => handleNavigation('/sensors')}
            >
              <Activity size={18} className="text-white" />
              <span className="text-white font-semibold text-sm">Sensores</span>
            </button>
            <button
              className="w-full flex items-center gap-3 p-3 bg-white/10 hover:bg-white/20 rounded-xl border border-white/20 hover:border-white/40 transition-all duration-300"
              onClick={() => handleNavigation('/reports')}
            >
              <BarChart3 size={18} className="text-white" />
              <span className="text-white font-semibold text-sm">Reportes y Análisis</span>
            </button>
            <button
              className="w-full flex items-center gap-3 p-3 bg-white/10 hover:bg-white/20 rounded-xl border border-white/20 hover:border-white/40 transition-all duration-300"
              onClick={() => handleNavigation('/settings')}
            >
              <Settings size={18} className="text-white" />
              <span className="text-white font-semibold text-sm">Configuración General</span>
            </button>
            <button
              className="w-full flex items-center gap-3 p-3 bg-white/10 hover:bg-white/20 rounded-xl border border-white/20 hover:border-white/40 transition-all duration-300"
              onClick={() => window.open('/docs', '_blank')}
            >
              <FileText size={18} className="text-white" />
              <span className="text-white font-semibold text-sm">Documentación</span>
            </button>
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 p-3 bg-red-500/20 hover:bg-red-500/40 rounded-xl border border-red-400/30 hover:border-red-400/50 transition-all duration-300"
            >
              <LogOut size={18} className="text-white" />
              <span className="text-white font-semibold text-sm">Cerrar Sesión</span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown - Dentro del navbar */}
      <div
        className={`lg:hidden px-4 sm:px-6 transition-all duration-300 ease-in-out overflow-hidden ${
          isMenuOpen ? 'max-h-[32rem] opacity-100 pb-4' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 shadow-2xl p-4 space-y-3">
          <div className="flex items-center gap-3 p-3 bg-white/10 rounded-xl border border-white/20">
            <div className="h-10 w-10 bg-gradient-to-br from-green-400 to-emerald-500 rounded-xl flex items-center justify-center shadow-lg flex-shrink-0">
              <User size={18} className="text-white" />
            </div>
            <div>
              <span className="font-bold text-white text-sm block">
                {isAdmin ? 'Administrador' : 'Operador'}
              </span>
              <span className="text-xs text-green-200">Sesión activa</span>
            </div>
          </div>

          <div className="space-y-2">
            {isAdmin && (
              <button
                className="w-full flex items-center gap-3 p-3 bg-white/10 hover:bg-white/20 rounded-xl border border-white/20 hover:border-white/40 transition-all duration-300"
                onClick={() => handleNavigation('/users')}
              >
                <User size={18} className="text-white" />
                <span className="text-white font-semibold text-sm">Configuración de Usuarios</span>
              </button>
            )}
            <button
              className="w-full flex items-center gap-3 p-3 bg-white/10 hover:bg-white/20 rounded-xl border border-white/20 hover:border-white/40 transition-all duration-300"
              onClick={() => handleNavigation('/sensors')}
            >
              <Activity size={18} className="text-white" />
              <span className="text-white font-semibold text-sm">Sensores</span>
            </button>
            <button
              className="w-full flex items-center gap-3 p-3 bg-white/10 hover:bg-white/20 rounded-xl border border-white/20 hover:border-white/40 transition-all duration-300"
              onClick={() => handleNavigation('/reports')}
            >
              <BarChart3 size={18} className="text-white" />
              <span className="text-white font-semibold text-sm">Reportes y Análisis</span>
            </button>
            <button
              className="w-full flex items-center gap-3 p-3 bg-white/10 hover:bg-white/20 rounded-xl border border-white/20 hover:border-white/40 transition-all duration-300"
              onClick={() => handleNavigation('/settings')}
            >
              <Settings size={18} className="text-white" />
              <span className="text-white font-semibold text-sm">Configuración General</span>
            </button>
            <button
              className="w-full flex items-center gap-3 p-3 bg-white/10 hover:bg-white/20 rounded-xl border border-white/20 hover:border-white/40 transition-all duration-300"
              onClick={() => window.open('/docs', '_blank')}
            >
              <FileText size={18} className="text-white" />
              <span className="text-white font-semibold text-sm">Documentación</span>
            </button>
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 p-3 bg-red-500/20 hover:bg-red-500/40 rounded-xl border border-red-400/30 hover:border-red-400/50 transition-all duration-300"
            >
              <LogOut size={18} className="text-white" />
              <span className="text-white font-semibold text-sm">Cerrar Sesión</span>
            </button>
          </div>
        </div>
      </div>

      {/* Overlay para cerrar el menú al hacer clic fuera */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 bg-black/20 z-30 lg:block hidden"
          onClick={() => setIsMenuOpen(false)}
        ></div>
      )}
    </>
  );
}