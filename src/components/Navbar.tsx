// components/Navbar.tsx
import { Activity, User, Clock, Settings, LogOut, Menu, X, FileText, BarChart3 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import ComponentPanel from './ComponentPanel';

export default function Navbar() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isAdmin] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isComponentsPanelOpen, setIsComponentsPanelOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

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
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
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

  const handleOpenComponentsPanel = () => {
    setIsComponentsPanelOpen(true);
    setIsMenuOpen(false);
  };

  const handleCloseComponentsPanel = () => {
    setIsComponentsPanelOpen(false);
  };

  return (
    <>
      <nav className="w-full bg-gray-900 border-b border-gray-700 sticky top-0 z-50 shadow-2xl">
        {/* Container principal */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Desktop Layout */}
          <div className="hidden lg:flex items-center h-16 w-full">
            {/* Logo y título a la izquierda */}
            <div className="flex items-center gap-4 flex-shrink-0">
              <div
                className="flex items-center gap-3 cursor-pointer group"
                onClick={() => handleNavigation('/dashboard')}
              >
                <div className="relative h-10 w-10">
                  <div className="absolute inset-0 bg-gradient-to-br from-emerald-500 to-green-600 rounded-xl shadow-lg"></div>
                  <div className="relative h-full w-full bg-white/10 backdrop-blur-sm rounded-xl border border-emerald-400/30 flex items-center justify-center">
                    <Activity size={22} className="text-white filter drop-shadow" />
                  </div>
                </div>
                <div>
                  <h1 className="text-xl font-bold text-white tracking-tight">
                    LabControl Pro
                  </h1>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="text-xs text-emerald-300 font-medium">
                      Sistema Activo
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Centro: Navegación principal */}
            <div className="flex gap-1 ml-8">
              <button
                onClick={() => handleNavigation('/dashboard')}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                  location.pathname === '/dashboard'
                    ? 'text-white bg-gray-800 shadow-lg shadow-emerald-500/20 border border-emerald-500/30'
                    : 'text-gray-300 hover:text-white hover:bg-gray-800'
                }`}
              >
                Dashboard
              </button>
              <button
                onClick={() => handleNavigation('/laboratories-management')}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                  location.pathname === '/laboratories-management'
                    ? 'text-white bg-gray-800 shadow-lg shadow-emerald-500/20 border border-emerald-500/30'
                    : 'text-gray-300 hover:text-white hover:bg-gray-800'
                }`}
              >
                Laboratorios
              </button>
              <button
                onClick={() => handleNavigation('/sensors')}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                  location.pathname === '/sensors'
                    ? 'text-white bg-gray-800 shadow-lg shadow-emerald-500/20 border border-emerald-500/30'
                    : 'text-gray-300 hover:text-white hover:bg-gray-800'
                }`}
              >
                Sensores
              </button>
              <button
                onClick={() => handleNavigation('/reports')}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                  location.pathname === '/reports'
                    ? 'text-white bg-gray-800 shadow-lg shadow-emerald-500/20 border border-emerald-500/30'
                    : 'text-gray-300 hover:text-white hover:bg-gray-800'
                }`}
              >
                Reportes
              </button>
            </div>

            {/* Derecha: Controles de usuario - empuja todo a la derecha con ml-auto */}
            <div className="flex items-center gap-4 ml-auto">
              {/* Hora y fecha */}
              <div className="bg-gray-800 rounded-lg px-4 py-2 border border-gray-700 relative group cursor-pointer">
                <div className="flex items-center gap-2">
                  <Clock size={16} className="text-emerald-400" />
                  <div className="text-right">
                    <div className="text-sm font-semibold text-white font-mono">
                      {formatTime(currentTime)}
                    </div>
                  </div>
                </div>
                {/* Tooltip */}
                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 px-3 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none z-50">
                  {formatDate(currentTime)}
                </div>
              </div>

              {/* Usuario con tooltip */}
              <div className="relative group cursor-pointer">
                
                  <div className="h-9 w-9 bg-gradient-to-br from-emerald-500 to-green-600 rounded-lg flex items-center justify-center shadow">
                    <User size={16} className="text-white" />
                  </div>
                
                {/* Tooltip */}
                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 px-3 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none z-50">
                  {isAdmin ? 'Administrador' : 'Operador'}
                </div>
              </div>

              {/* Menú hamburguesa */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg border border-gray-700 hover:border-gray-600 transition-all duration-200"
              >
                {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>

              {/* Cerrar sesión */}
            </div>
          </div>

          {/* Mobile Layout */}
          <div className="lg:hidden">
            <div className="flex items-center justify-between h-16">
              {/* Logo y título */}
              <div className="flex items-center gap-3">
                <div
                  className="flex items-center gap-2 cursor-pointer"
                  onClick={() => handleNavigation('/dashboard')}
                >
                  <div className="relative h-8 w-8">
                    <div className="absolute inset-0 bg-gradient-to-br from-emerald-500 to-green-600 rounded-lg"></div>
                    <div className="relative h-full w-full bg-white/10 backdrop-blur-sm rounded-lg border border-emerald-400/30 flex items-center justify-center">
                      <Activity size={16} className="text-white" />
                    </div>
                  </div>
                  <div>
                    <h1 className="text-lg font-bold text-white">LabControl</h1>
                  </div>
                </div>
              </div>

              {/* Controles móviles */}
              <div className="flex items-center gap-2">
                {/* Hora */}
                <div className="bg-gray-800 rounded-lg px-3 py-1.5 border border-gray-700">
                  <div className="flex items-center gap-1.5">
                    <Clock size={14} className="text-emerald-400" />
                    <div className="text-xs font-semibold text-white font-mono">
                      {formatTime(currentTime)}
                    </div>
                  </div>
                </div>

                {/* Menú hamburguesa */}
                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg border border-gray-700 hover:border-gray-600 transition-all duration-200"
                >
                  {isMenuOpen ? <X size={18} /> : <Menu size={18} />}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Línea decorativa inferior */}
        <div className="h-1 bg-gradient-to-r from-emerald-500 via-green-500 to-emerald-500"></div>
      </nav>

      {/* Desktop Menu Dropdown */}
      <div
        className={`hidden lg:block fixed right-4 top-20 z-40 transition-all duration-300 ease-in-out ${isMenuOpen
            ? 'opacity-100 translate-y-0 pointer-events-auto'
            : 'opacity-0 -translate-y-4 pointer-events-none'
          }`}
      >
        <div className="bg-gray-800 rounded-xl border border-gray-700 shadow-2xl p-4 w-64 backdrop-blur-sm">
          {/* Información del usuario */}
          <div className="flex items-center gap-3 p-3 bg-gray-700/50 rounded-lg border border-gray-600 mb-3">
            <div className="h-10 w-10 bg-gradient-to-br from-emerald-500 to-green-600 rounded-lg flex items-center justify-center shadow">
              <User size={18} className="text-white" />
            </div>
            <div>
              <span className="font-semibold text-white text-sm block">
                {isAdmin ? 'Administrador' : 'Operador'}
              </span>
              <span className="text-xs text-emerald-400">Sesión activa</span>
            </div>
          </div>

          {/* Menú de opciones */}
          <div className="space-y-2">
            {isAdmin && (
              <button
                className="w-full flex items-center gap-3 p-3 text-gray-300 hover:text-white hover:bg-gray-700 rounded-lg border border-transparent hover:border-gray-600 transition-all duration-200"
                onClick={() => handleNavigation('/users')}
              >
                <User size={18} className="text-emerald-400" />
                <span className="font-medium text-sm">Gestión de Usuarios</span>
              </button>
            )}

            <button
              className="w-full flex items-center gap-3 p-3 text-gray-300 hover:text-white hover:bg-gray-700 rounded-lg border border-transparent hover:border-gray-600 transition-all duration-200"
              onClick={handleOpenComponentsPanel}
            >
              <Activity size={18} className="text-emerald-400" />
              <span className="font-medium text-sm">Componentes</span>
            </button>

            <button
              className="w-full flex items-center gap-3 p-3 text-gray-300 hover:text-white hover:bg-gray-700 rounded-lg border border-transparent hover:border-gray-600 transition-all duration-200"
              onClick={() => handleNavigation('/reports')}
            >
              <BarChart3 size={18} className="text-emerald-400" />
              <span className="font-medium text-sm">Reportes y Análisis</span>
            </button>

            <button
              className="w-full flex items-center gap-3 p-3 text-gray-300 hover:text-white hover:bg-gray-700 rounded-lg border border-transparent hover:border-gray-600 transition-all duration-200"
              onClick={() => handleNavigation('/settings')}
            >
              <Settings size={18} className="text-emerald-400" />
              <span className="font-medium text-sm">Configuración</span>
            </button>

            <button
              className="w-full flex items-center gap-3 p-3 text-gray-300 hover:text-white hover:bg-gray-700 rounded-lg border border-transparent hover:border-gray-600 transition-all duration-200"
              onClick={() => window.open('/docs', '_blank')}
            >
              <FileText size={18} className="text-emerald-400" />
              <span className="font-medium text-sm">Documentación</span>
            </button>

            {/* Separador */}
            <div className="border-t border-gray-700 my-2"></div>

            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 p-3 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg border border-transparent hover:border-red-400/30 transition-all duration-200"
            >
              <LogOut size={18} />
              <span className="font-medium text-sm">Cerrar Sesión</span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      <div
        className={`lg:hidden transition-all duration-300 ease-in-out overflow-hidden ${isMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
          }`}
      >
        <div className="bg-gray-800 border-b border-gray-700 shadow-xl">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 space-y-3">
            {/* Información del usuario móvil */}
            <div className="flex items-center gap-3 p-3 bg-gray-700/50 rounded-lg border border-gray-600">
              <div className="h-10 w-10 bg-gradient-to-br from-emerald-500 to-green-600 rounded-lg flex items-center justify-center">
                <User size={18} className="text-white" />
              </div>
              <div>
                <span className="font-semibold text-white text-sm block">
                  {isAdmin ? 'Administrador' : 'Operador'}
                </span>
                <span className="text-xs text-emerald-400">Sesión activa</span>
              </div>
            </div>

            {/* Menú móvil */}
            <div className="grid grid-cols-2 gap-2">
              <button
                className="flex items-center gap-2 p-3 text-gray-300 hover:text-white hover:bg-gray-700 rounded-lg border border-gray-600 transition-all duration-200"
                onClick={() => handleNavigation('/dashboard')}
              >
                <Activity size={16} className="text-emerald-400" />
                <span className="text-sm font-medium">Dashboard</span>
              </button>

              <button
                className="flex items-center gap-2 p-3 text-gray-300 hover:text-white hover:bg-gray-700 rounded-lg border border-gray-600 transition-all duration-200"
                onClick={() => handleNavigation('/laboratories')}
              >
                <Activity size={16} className="text-emerald-400" />
                <span className="text-sm font-medium">Laboratorios</span>
              </button>

              <button
                className="flex items-center gap-2 p-3 text-gray-300 hover:text-white hover:bg-gray-700 rounded-lg border border-gray-600 transition-all duration-200"
                onClick={handleOpenComponentsPanel}
              >
                <Activity size={16} className="text-emerald-400" />
                <span className="text-sm font-medium">Componentes</span>
              </button>

              <button
                className="flex items-center gap-2 p-3 text-gray-300 hover:text-white hover:bg-gray-700 rounded-lg border border-gray-600 transition-all duration-200"
                onClick={() => handleNavigation('/reports')}
              >
                <BarChart3 size={16} className="text-emerald-400" />
                <span className="text-sm font-medium">Reportes</span>
              </button>

              {isAdmin && (
                <button
                  className="flex items-center gap-2 p-3 text-gray-300 hover:text-white hover:bg-gray-700 rounded-lg border border-gray-600 transition-all duration-200"
                  onClick={() => handleNavigation('/users')}
                >
                  <User size={16} className="text-emerald-400" />
                  <span className="text-sm font-medium">Usuarios</span>
                </button>
              )}

              <button
                className="flex items-center gap-2 p-3 text-gray-300 hover:text-white hover:bg-gray-700 rounded-lg border border-gray-600 transition-all duration-200"
                onClick={() => handleNavigation('/settings')}
              >
                <Settings size={16} className="text-emerald-400" />
                <span className="text-sm font-medium">Configuración</span>
              </button>
            </div>

            {/* Cerrar sesión móvil */}
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-2 p-3 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg border border-red-400/30 transition-all duration-200 mt-2"
            >
              <LogOut size={16} />
              <span className="text-sm font-medium">Cerrar Sesión</span>
            </button>
          </div>
        </div>
      </div>

      {/* Panel de Componentes */}
      <ComponentPanel
        isOpen={isComponentsPanelOpen}
        onClose={handleCloseComponentsPanel}
      />

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