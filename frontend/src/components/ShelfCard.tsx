import { motion } from 'framer-motion';
import { Edit3, Trash2, Layers } from "lucide-react";
import { useState } from 'react';
import axios from 'axios';
import LightControl from './deviceControl/LightControl';

interface SensorItem {
  id: string;
  type: string;
  name: string;
  entityId?: string;
  haState?: string;
}

interface ShelfCardProps {
  nombre: string;
  status: "active" | "maintenance" | "inactive";
  sensors?: SensorItem[];
  onDelete?: () => void;
  onEdit?: () => void;
}

const API_URL = 'http://localhost:3000/api/lights'; // Ajusta la IP/Puerto de tu backend de Node

const ShelfCard = ({
  nombre,
  status,
  sensors = [],
  onDelete,
  onEdit,
}: ShelfCardProps) => {
  // Guardamos los sensores en un estado local para poder actualizar su 'haState' en tiempo real al hacer clic
  const [, setLocalSensors] = useState<SensorItem[]>(sensors);

  const getStatusConfig = (status: string) => {
    switch (status) {
      case "active":
        return { bg: "bg-slate-50", text: "text-slate-700", dot: "bg-slate-400", border: "border-slate-200" };
      case "maintenance":
        return { bg: "bg-amber-50", text: "text-amber-700", dot: "bg-amber-400", border: "border-amber-200" };
      case "inactive":
      default:
        return { bg: "bg-gray-50", text: "text-gray-600", dot: "bg-gray-400", border: "border-gray-200" };
    }
  };

  const statusConfig = getStatusConfig(status);

  // --- Función que maneja el encendido/apagado real mediante tu API ---
  const handleToggleLight = async (entityId: string, turnOn: boolean) => {
    const endpoint = turnOn ? 'turn-on' : 'turn-off';

    try {
      // Petición HTTP optimizada hacia tu backend: POST /api/lights/:entityId/turn-on
      const response = await axios.post(`${API_URL}/${entityId}/${endpoint}`);

      if (response.data.success) {
        // Si sale bien, modificamos el estado del sensor específico en la UI
        setLocalSensors(prevSensors =>
          prevSensors.map(sensor =>
            sensor.entityId === entityId
              ? { ...sensor, haState: turnOn ? 'on' : 'off' }
              : sensor
          )
        );
      }
    } catch (error) {
      console.error(`Error al controlar el dispositivo ${entityId}:`, error);
      // Lanzamos el error para que el componente hijo detenga su animación de carga (isLoading)
      throw error;
    }
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    if (onDelete) onDelete();
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    if (onEdit) onEdit();
  };

  return (
    <motion.div
      className="bg-white rounded-xl border border-gray-300 shadow-md hover:shadow-lg transition-all duration-300 p-5 flex flex-col gap-5 group hover:border-gray-600 relative cursor-pointer"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Botones de acción superiores */}
      <div className="absolute top-4 right-4 z-10 flex items-center gap-1">
        {onEdit && (
          <button
            onClick={handleEdit}
            className="p-2 text-gray-400 hover:text-gray-900 bg-white rounded-full transition-colors duration-300 ring-1 ring-gray-100 hover:ring-gray-200"
            title="Editar estantería"
          >
            <Edit3 size={16} />
          </button>
        )}
        {onDelete && (
          <button
            onClick={handleDelete}
            className="p-2 text-gray-400 hover:text-red-500 bg-white rounded-full transition-colors duration-300 ring-1 ring-gray-100 hover:ring-red-100"
            title="Eliminar estantería"
          >
            <Trash2 size={16} />
          </button>
        )}
      </div>

      <div className="flex items-start gap-4 pr-28">
        <div className={`w-12 h-12 ${statusConfig.bg} rounded-lg flex items-center justify-center border ${statusConfig.border}`}>
          <Layers size={22} className={statusConfig.text} />
        </div>

        <div className="min-w-0">
          <h3 className="text-xl font-bold text-gray-900 leading-tight break-words">
            {nombre}
          </h3>
          <p className="text-sm text-gray-500 font-medium mt-0.5">
            Zona de Actuadores de luz
          </p>
        </div>
      </div>

      {/* --- Sensores Asignados --- */}
      {sensors && sensors.length > 0 && (
        <div className="grid grid-cols-2 gap-2">
          {sensors.map((sensor) => (
            <div key={sensor.id} className="h-[140px] overflow-hidden rounded-lg border border-gray-100 bg-gray-50/50">
              <div className="w-[100%] transform scale-[1] origin-top-left">
                {sensor.type === 'light' ? (
                  <LightControl
                    entityId={sensor.entityId}
                    nombre={sensor.name}
                    haState={sensor.haState}
                    onToggle={handleToggleLight} // <- Inyectamos la función aquí
                  />
                ) : null}
              </div>
            </div>
          ))}
        </div>
      )}


    </motion.div>
  );
};

export default ShelfCard;

