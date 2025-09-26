import { Activity, Bell, User, Clock } from "lucide-react";
import { useState, useEffect } from "react";

export default function Navbar() {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date): string => {
    return date.toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const formatDate = (date: Date): string => {
    return date.toLocaleDateString('es-ES', {
      weekday: 'short',
      day: 'numeric',
      month: 'short'
    });
  };

  return (
    <nav className="w-full bg-[#367c29] text-white px-6 py-3 flex items-center justify-between shadow-lg sticky top-0 z-50 border-b-3 border-white"
         style={{ boxShadow: '0 5px 20px rgba(255, 255, 255, 0.15)' }}>
      
      {/* Usuario a la izquierda */}
      <div className="flex items-center gap-3">
          <div className="group flex items-center gap-2 bg-white rounded-xl px-4 py-2 shadow-sm border border-green-100 hover:bg-[#2e5c23] hover:shadow-md transition-shadow duration-200">
            <div className="p-1 bg-[#367c29] rounded-lg">
            <User size={18} className="text-white" />
            </div>
            <span className="font-semibold text-gray-900 text-sm group-hover:text-white transition-colors duration-200">
              Administrador
            </span>
          </div>
      </div>

      {/* Título centrado en blanco */}
      <div className="flex items-center gap-3">
        <div className="p-2 bg-white rounded-xl shadow-md">
          <Activity size={28} className="text-[#367c29]" />
        </div>
        <h1 className="text-2xl font-bold text-white">
          LabControl Pro
        </h1>
      </div>

      {/* Hora y notificaciones a la derecha */}
      <div className="flex items-center gap-4">
        {/* Reloj con acentos blancos */}
        <div className="bg-white rounded-xl px-4 py-2 shadow-sm border border-green-100">
          <div className="flex items-center gap-2">
            <Clock size={16} className="text-[#367c29]" />
            <div className="text-right">
              <div className="text-sm font-mono font-bold text-gray-800">
                {formatTime(currentTime)}
              </div>
              <div className="text-xs text-gray-600 font-medium">
                {formatDate(currentTime)}
              </div>
            </div>
          </div>
        </div>

        {/* Notificaciones */}
        <button className="group relative p-2 bg-white hover:bg-[#2e5c23] rounded-lg transition-all duration-200 shadow-sm border border-green-100 hover:shadow-md">
            <Bell size={20} className="text-[#367c29] group-hover:text-white transition-colors duration-200" />
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
        </button>
      </div>
    </nav>
  );
}