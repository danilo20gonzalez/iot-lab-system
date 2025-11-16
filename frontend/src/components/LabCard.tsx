import { Thermometer, Droplets, ChevronRight, Activity, Wifi, Cctv, Trash2 } from "lucide-react";

interface LabCardProps {
  id: number;
  name: string;
  temperature: number;
  humidity: number;
  devices: number;
  status: "activo" | "alerta" | "mantenimiento";
  onDelete?: () => void;
}

export default function LabCard({ id, name, temperature, humidity, devices, status, onDelete }: LabCardProps) {
  const getStatusConfig = (status: string) => {
    switch (status) {
      case "activo":
        return {
          bg: "bg-gradient-to-r from-emerald-500 to-green-500",
          text: "text-white",
          border: "border-emerald-200",
          glow: "shadow-lg shadow-emerald-500/20",
          dot: "#10b981"
        };
      case "alerta":
        return {
          bg: "bg-gradient-to-r from-amber-500 to-orange-500",
          text: "text-white",
          border: "border-amber-200",
          glow: "shadow-lg shadow-amber-500/20",
          dot: "#f59e0b"
        };
      default:
        return {
          bg: "bg-gradient-to-r from-slate-500 to-gray-500",
          text: "text-white",
          border: "border-gray-200",
          glow: "shadow-lg shadow-gray-500/20",
          dot: "#6b7280"
        };
    }
  };

  const statusConfig = getStatusConfig(status);

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onDelete) {
      onDelete();
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-gray-100 hover:border-gray-200 shadow-xl hover:shadow-2xl transition-all duration-500 p-6 flex flex-col gap-6 group hover:-translate-y-2 relative overflow-hidden">
      
      {/* Background gradient effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-white to-emerald-50 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      {/* Status indicator line */}
      <div 
        className={`absolute top-0 left-0 w-1 h-full ${status === 'activo' ? 'bg-gradient-to-b from-emerald-500 to-green-500' : status === 'alerta' ? 'bg-gradient-to-b from-amber-500 to-orange-500' : 'bg-gradient-to-b from-gray-500 to-slate-500'}`}
      />
      
      {/* Botón de eliminar */}
      {onDelete && (
        <button
          onClick={handleDelete}
          className="absolute top-4 right-4 z-20 w-8 h-8 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-lg"
          title="Eliminar laboratorio"
        >
          <Trash2 size={14} />
        </button>
      )}
      
      {/* Header section */}
      <div className="flex justify-between items-start relative z-10">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-green-600 rounded-2xl flex items-center justify-center shadow-lg">
              <Activity size={24} className="text-white" />
            </div>
            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-white rounded-full border-2 border-white flex items-center justify-center">
              <Wifi size={12} className="text-emerald-600" />
            </div>
          </div>
          <div>
            <h3 className="text-2xl font-bold text-gray-900 group-hover:text-gray-800 transition-colors">
              {name}
            </h3>
            <p className="text-sm text-gray-500 font-medium">Lab #{id.toString().padStart(2, '0')}</p>
          </div>
        </div>
        
        <div className={`px-4 py-2 rounded-2xl ${statusConfig.bg} ${statusConfig.glow} flex items-center gap-2 backdrop-blur-sm`}>
          <div className="w-2 h-2 rounded-full bg-white animate-pulse"></div>
          <span className={`text-sm font-semibold capitalize ${statusConfig.text}`}>
            {status}
          </span>
        </div>
      </div>

      {/* Metrics grid */}
      <div className="grid grid-cols-2 gap-4 relative z-10">
        {/* Temperature Card */}
        <div className="bg-gradient-to-br from-white to-red-50 rounded-2xl p-4 border border-red-100 hover:border-red-200 transition-all duration-300 group/metric hover:shadow-lg">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center">
              <Thermometer className="text-red-600" size={20} />
            </div>
            <span className="text-xs font-semibold text-red-600 bg-red-50 px-2 py-1 rounded-full border border-red-200">
              TEMP
            </span>
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-1">{temperature}°C</div>
          <div className="text-xs text-gray-600 font-medium">Temperatura</div>
          
          {/* Temperature indicator */}
          <div className="mt-3 w-full bg-gray-200 rounded-full h-1.5">
            <div 
              className={`h-1.5 rounded-full ${
                temperature > 30 ? 'bg-red-500' : 
                temperature > 25 ? 'bg-orange-500' : 'bg-green-500'
              }`}
              style={{ width: `${Math.min((temperature / 40) * 100, 100)}%` }}
            />
          </div>
        </div>
        
        {/* Humidity Card */}
        <div className="bg-gradient-to-br from-white to-blue-50 rounded-2xl p-4 border border-blue-100 hover:border-blue-200 transition-all duration-300 group/metric hover:shadow-lg">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
              <Droplets className="text-blue-600" size={20} />
            </div>
            <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-1 rounded-full border border-blue-200">
              HUM
            </span>
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-1">{humidity}%</div>
          <div className="text-xs text-gray-600 font-medium">Humedad</div>
          
          {/* Humidity indicator */}
          <div className="mt-3 w-full bg-gray-200 rounded-full h-1.5">
            <div 
              className={`h-1.5 rounded-full ${
                humidity > 80 ? 'bg-blue-600' : 
                humidity > 60 ? 'bg-blue-500' : 'bg-blue-400'
              }`}
              style={{ width: `${humidity}%` }}
            />
          </div>
        </div>
      </div>

      {/* Devices info */}
      <div className="bg-gradient-to-r from-gray-50 to-slate-50 rounded-2xl p-4 border border-gray-100 relative z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <Cctv size={16} className="text-emerald-600" />
              <span className="text-gray-700 font-semibold text-sm">
                {devices} dispositivos
              </span>
            </div>
            <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
            <span className="text-xs text-gray-500 font-medium">Conectados</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
            <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full border border-emerald-200">
              ONLINE
            </span>
          </div>
        </div>
      </div>

      {/* Action button */}
      <div
        className="relative z-10 flex justify-between items-center text-white rounded-2xl p-4 cursor-pointer transition-all duration-500 group/button hover:shadow-2xl overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #10b981 0%, #059669 50%, #047857 100%)',
        }}
        onClick={() => console.log(`Navegando a laboratorio ${id}`)}
      >
        {/* Hover effect background */}
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-green-600 opacity-0 group-hover/button:opacity-100 transition-opacity duration-500" />
        
        <span className="font-semibold text-sm relative z-10">Controlar laboratorio</span>
        <div className="relative z-10 flex items-center gap-1">
          <span className="text-sm font-medium opacity-90">Ver detalles</span>
          <ChevronRight className="group-hover/button:translate-x-1 transition-transform duration-300" size={18} />
        </div>
      </div>
    </div>
  );
}