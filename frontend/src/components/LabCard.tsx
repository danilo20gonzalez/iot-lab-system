import { Thermometer, Droplets, ChevronRight, Activity } from "lucide-react";
// import { Link } from "react-router-dom"; // Simulado como div clickeable

interface LabCardProps {
  id: number;
  name: string;
  temperature: number;
  humidity: number;
  devices: number;
  status: "activo" | "alerta" | "mantenimiento";
}

export default function LabCard({ id, name, temperature, humidity, devices, status }: LabCardProps) {
  const getStatusConfig = (status: string) => {
    switch (status) {
      case "activo":
        return {
          bg: "bg-gradient-to-r from-green-50 to-lime-50",
          text: "text-green-700",
          border: "border-green-200",
          dot: "#267e1b"
        };
      case "alerta":
        return {
          bg: "bg-gradient-to-r from-amber-50 to-yellow-50",
          text: "text-amber-700",
          border: "border-amber-200",
          dot: "#ff6b35"
        };
      default:
        return {
          bg: "bg-gradient-to-r from-gray-50 to-slate-50",
          text: "text-gray-600",
          border: "border-gray-200",
          dot: "#6b7280"
        };
    }
  };

  const statusConfig = getStatusConfig(status);

  return (
    <div className="bg-white rounded-2xl border-1 border-[#367c29] hover:border-gray-200 shadow-sm hover:shadow-xl transition-all duration-300 p-6 flex flex-col gap-5 group hover:-translate-y-1 relative overflow-hidden">
      {/* Decorative gradient overlay */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-600 via-emerald-600 to-lime-600" style={{background: 'linear-gradient(90deg, #267e1b 0%, #427a35 50%, #004e00 100%)'}}></div>
      
      {/* Header con título y estado */}
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br rounded-xl flex items-center justify-center border-2" style={{background: 'linear-gradient(135deg, #427a35 0%, #267e1b 100%)', borderColor: '#267e1b'}}>
            <Activity size={20} className="text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-800 group-hover:text-gray-900 transition-colors">{name}</h3>
            <p className="text-sm text-gray-500">Laboratorio #{id}</p>
          </div>
        </div>
        
        <div className={`px-4 py-2 rounded-xl border-2 ${statusConfig.bg} ${statusConfig.border} flex items-center gap-2`}>
          <div className="w-2 h-2 rounded-full animate-pulse" style={{backgroundColor: statusConfig.dot}}></div>
          <span className={`text-sm font-semibold capitalize ${statusConfig.text}`}>
            {status}
          </span>
        </div>
      </div>

      {/* Métricas con diseño mejorado */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-xl p-4 border-2 border-red-100 hover:border-red-200 transition-colors">
          <div className="flex items-center justify-between mb-2">
            <Thermometer className="text-red-500" size={22} />
            <span className="text-xs font-medium text-red-600 bg-red-100 px-2 py-1 rounded-full">TEMP</span>
          </div>
          <div className="text-2xl font-bold text-red-700">{temperature}°C</div>
          <div className="text-xs text-red-600 mt-1">Temperatura actual</div>
        </div>
        
        <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-4 border-2 border-blue-100 hover:border-blue-200 transition-colors">
          <div className="flex items-center justify-between mb-2">
            <Droplets className="text-blue-500" size={22} />
            <span className="text-xs font-medium text-blue-600 bg-blue-100 px-2 py-1 rounded-full">HUM</span>
          </div>
          <div className="text-2xl font-bold text-blue-700">{humidity}%</div>
          <div className="text-xs text-blue-600 mt-1">Humedad relativa</div>
        </div>
      </div>

      {/* Información adicional */}
      <div className="bg-gradient-to-r from-gray-50 to-slate-50 rounded-xl p-4 border-2 border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full" style={{backgroundColor: '#267e1b'}}></div>
            <span className="text-gray-700 font-medium">{devices} dispositivos conectados</span>
          </div>
          <div className="text-xs text-gray-500 bg-gray-200 px-2 py-1 rounded-full">
            ONLINE
          </div>
        </div>
      </div>

      {/* Botón Ver más mejorado */}
      <div
        className="flex justify-between items-center text-white rounded-xl p-4 cursor-pointer transition-all duration-300 group/button hover:shadow-lg"
        style={{
          background: 'linear-gradient(135deg, #267e1b 0%, #427a35 50%, #004e00 100%)',
          boxShadow: '0 4px 15px rgba(38, 126, 27, 0.25)'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = 'linear-gradient(135deg, #1e6b14 0%, #3a6b2d 50%, #003d00 100%)';
          e.currentTarget.style.boxShadow = '0 8px 25px rgba(38, 126, 27, 0.4)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'linear-gradient(135deg, #267e1b 0%, #427a35 50%, #004e00 100%)';
          e.currentTarget.style.boxShadow = '0 4px 15px rgba(38, 126, 27, 0.25)';
        }}
        onClick={() => console.log(`Navegando a laboratorio ${id}`)}
      >
        <span className="font-semibold">Ver detalles completos</span>
        <ChevronRight className="group-hover/button:translate-x-1 transition-transform duration-300" size={20} />
      </div>
    </div>
  );
}