import { motion } from 'framer-motion';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Edit3, Trash2 } from "lucide-react";
import TemperatureControl from './deviceControl/TemperatureControl';
import HumidityControl from './deviceControl/HumidityControl';

interface LabRoomCardProps {
  nombre: string;
  modulosActivos: number;
  status: "activo" | "inactivo" | "alerta";
  sensors?: { id: string; type: string; name: string }[];
  onDelete?: () => void;
  onEdit?: () => void;
}

const LabRoomCard = ({
  nombre,
  status,
  sensors = [],
  onDelete,
  onEdit,
}: LabRoomCardProps) => {
  const [isHovered, setIsHovered] = useState(false);

  const getStatusColor = () => {
    switch (status) {
      case "activo":
        return "bg-gradient-to-r from-emerald-600 to-emerald-700";
      case "inactivo":
        return "bg-gradient-to-r from-gray-400 to-gray-600";
      case "alerta":
        return "bg-gradient-to-r from-red-400 to-red-600";
      default:
        return "bg-gradient-to-r from-gray-400 to-gray-600";
    }
  };

  const navigate = useNavigate();

  const handleViewDetails = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();

    console.log(`Navigating from ${nombre} to /project`);
    navigate(`/project`);
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    if (onEdit) onEdit();
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    if (onDelete) onDelete();
  };

  return (
    <motion.div
      className="relative bg-gradient-to-br from-white to-gray-50 p-6 rounded-2xl shadow-lg border border-gray-100 overflow-hidden transform transition-all duration-300 hover:shadow-xl hover:-translate-y-1 group"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-green-100/30 to-green-100/30 opacity-50 pointer-events-none" />

      <div className="absolute top-4 right-4 z-10 flex items-center gap-1 opacity-100 group-hover:opacity-100 transition-opacity duration-300">
        {onEdit && (
          <button
            onClick={handleEdit}
            className="p-2 text-gray-400 hover:text-emerald-600 bg-white rounded-full transition-colors duration-300 ring-1 ring-gray-100 hover:ring-emerald-200 shadow-sm"
            title="Editar módulo"
          >
            <Edit3 size={16} />
          </button>
        )}
        {onDelete && (
          <button
            onClick={handleDelete}
            className="p-2 text-gray-400 hover:text-red-500 bg-white rounded-full transition-colors duration-300 ring-1 ring-gray-100 hover:ring-red-100 shadow-sm"
            title="Eliminar módulo"
          >
            <Trash2 size={16} />
          </button>
        )}
      </div>

      <div className="relative flex justify-between items-start mb-6 pr-20">
        <h3 className="text-xl font-bold text-gray-800 tracking-tight">{nombre}</h3>
        <motion.span
          className={`text-white px-3 py-1 rounded-full text-sm font-medium ${getStatusColor()}`}
          animate={{ scale: isHovered ? 1.1 : 1 }}
          transition={{ duration: 0.2 }}
        >
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </motion.span>
      </div>

      {/* --- Sensores Asignados --- */}
      {sensors && sensors.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4 z-10 relative">
            {sensors.map((sensor) => (
                <div key={sensor.id} className="h-[165px] relative overflow-hidden rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center">
                    <div className="absolute top-0 left-0 w-[115%] transform scale-[0.85] origin-top-left -ml-1 -mt-1">
                        {sensor.type === 'temperature' ? <TemperatureControl /> : <HumidityControl />}
                    </div>
                </div>
            ))}
        </div>
      )}

      <motion.button
        className="relative z-20 mt-6 w-full bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white py-2 rounded-lg font-medium transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-100 items-center gap-2 cursor-pointer"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleViewDetails}
        onMouseDown={(e) => e.stopPropagation()}
        onMouseUp={(e) => e.stopPropagation()}
      >
        Ver Detalles
      </motion.button>
    </motion.div>
  );
};

export default LabRoomCard;