import {
  Thermometer,
  Droplets,
  ChevronRight,
  Activity,
  Trash2,
  Users,
  Power,
  ShieldOff,
  Microscope,
  Wifi,
  Eye,
  Edit3,
} from "lucide-react";

import { useNavigate } from 'react-router-dom';


// NUEVAS PROPS BASADAS EN LOS REQUERIMIENTOS
interface LabCardProps {
  id: number;
  code?: string;
  name: string;
  temperature: number;
  humidity: number;
  activeSensors: number;
  associatedUsers: number;
  status: "activo" | "alerta" | "mantenimiento";
  automationStatus: "on" | "off";
  isZoneDisabled: boolean;
  onDelete?: () => void;
  onEdit?: () => void;
  onView?: () => void;
}

export default function LabCard({
  id,
  code,
  name,
  temperature,
  humidity,
  activeSensors,
  associatedUsers,
  status,
  automationStatus,
  isZoneDisabled,
  onDelete,
  onEdit,
  onView,
}: LabCardProps) {
  const navigate = useNavigate();
  const getStatusConfig = (status: string) => {
    switch (status) {
      case "activo":
        return {
          bg: "bg-emerald-50",
          text: "text-emerald-700",
          dot: "bg-emerald-400",
          border: "border-emerald-200",
        };
      case "alerta":
        return {
          bg: "bg-amber-50",
          text: "text-amber-700",
          dot: "bg-amber-400",
          border: "border-amber-200",
        };
      default:
        return {
          bg: "bg-gray-50",
          text: "text-gray-600",
          dot: "bg-gray-400",
          border: "border-gray-200",
        };
    }
  };

  const statusConfig = getStatusConfig(status);

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onDelete) onDelete();
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onEdit) onEdit();
  };

  const handleView = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onView) onView();
  };

  return (
    <div className="bg-white rounded-xl border border-gray-300 shadow-md hover:shadow-lg transition-all duration-300 p-5 flex flex-col gap-5 group hover:border-gray-600 relative">

      {/* Botones de acción superiores */}
      <div className="absolute top-4 right-4 z-10 flex items-center gap-1">
        {onView && (
          <button
            onClick={handleView}
            className="p-2 text-gray-400 hover:text-emerald-600 bg-white rounded-full transition-colors duration-300 ring-1 ring-gray-100 hover:ring-emerald-200"
            title="Ver detalles"
          >
            <Eye size={16} />
          </button>
        )}
        {onEdit && (
          <button
            onClick={handleEdit}
            className="p-2 text-gray-400 hover:text-blue-600 bg-white rounded-full transition-colors duration-300 ring-1 ring-gray-100 hover:ring-blue-200"
            title="Editar laboratorio"
          >
            <Edit3 size={16} />
          </button>
        )}
        {onDelete && (
          <button
            onClick={handleDelete}
            className="p-2 text-gray-400 hover:text-red-500 bg-white rounded-full transition-colors duration-300 ring-1 ring-gray-100 hover:ring-red-100"
            title="Eliminar laboratorio"
          >
            <Trash2 size={16} />
          </button>
        )}
      </div>

      {/* --- Encabezado y Título --- */}
      <div className="flex items-start gap-4 pr-28">
        <div className={`w-12 h-12 ${statusConfig.bg} rounded-lg flex items-center justify-center border ${statusConfig.border}`}>
          <Microscope size={22} className={statusConfig.text} />
        </div>

        <div>
          <h3 className="text-xl font-bold text-gray-900 leading-tight">
            {name}
          </h3>
          <p className="text-sm text-gray-500 font-medium mt-0.5">Código: {code || id}</p>
        </div>
      </div>

      {/* --- Panel de Estado y Habilitación --- */}
      <div className={`flex items-center justify-between p-3 rounded-lg border ${statusConfig.border} ${statusConfig.bg}`}>
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${statusConfig.dot} ${status === 'activo' ? 'animate-pulse' : ''}`}></div>
          <span className={`text-sm font-semibold uppercase ${statusConfig.text}`}>
            {status}
          </span>
        </div>

        {isZoneDisabled ? (
          <div className="flex items-center gap-2 px-2 py-0.5 rounded-md bg-red-100 text-red-600 border border-red-200">
            <ShieldOff size={14} />
            <span className="text-xs font-semibold">INHABILITADO</span>
          </div>
        ) : (
          <div className="flex items-center gap-1 text-emerald-500">
            <Wifi size={14} />
            <span className="text-xs font-semibold">Conectado</span>
          </div>
        )}
      </div>

      {/* --- Métricas clave (Temperatura y Humedad) --- */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white rounded-lg p-4 border border-gray-200 hover:border-red-300 transition-colors duration-300">
          <div className="flex items-center justify-between mb-2">
            <Thermometer className="text-red-500" size={18} />
            <span className="text-xs font-semibold text-red-600">TEMP</span>
          </div>
          <div className="text-2xl font-extrabold text-gray-900 mb-0.5">{temperature}°C</div>
          <div className="text-xs text-gray-500">Temperatura Amb.</div>
        </div>

        <div className="bg-white rounded-lg p-4 border border-gray-200 hover:border-blue-300 transition-colors duration-300">
          <div className="flex items-center justify-between mb-2">
            <Droplets className="text-blue-500" size={18} />
            <span className="text-xs font-semibold text-blue-600">HUM</span>
          </div>
          <div className="text-2xl font-extrabold text-gray-900 mb-0.5">{humidity}%</div>
          <div className="text-xs text-gray-500">Humedad Prom.</div>
        </div>
      </div>

      {/* --- Resumen de Gestión --- */}
      <div className="flex justify-between items-center text-sm pt-2 border-t border-gray-100">
        <div className="flex items-center gap-2 text-gray-600">
          <Users size={16} className="text-gray-400" />
          <span className="font-semibold">{associatedUsers}</span>
          <span className="text-xs text-gray-500">Usuarios Asoc.</span>
        </div>

        <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold capitalize ${automationStatus === 'on' ? 'bg-indigo-100 text-indigo-700' : 'bg-gray-100 text-gray-500'}`}>
          <Power size={14} />
          {automationStatus === 'on' ? 'Automatizado' : 'Manual'}
        </div>
      </div>

      {/* --- Botón de Acción --- */}
      <button
        onClick={() => navigate('/laboratory')}
        className="mt-1 w-full flex items-center justify-between p-3 text-sm font-semibold text-white bg-emerald-600 border border-gray-300 rounded-xl hover:bg-emerald-700 transition-colors duration-300 cursor-pointer"
      >
        <span className="flex items-center gap-2">
          <Activity size={16} />
          <span>Controlar Laboratorio ({activeSensors} Sensores)</span>
        </span>
        <ChevronRight className="group-hover:translate-x-0.5 transition-transform duration-300 text-white" size={16} />
      </button>
    </div>
  );
}
