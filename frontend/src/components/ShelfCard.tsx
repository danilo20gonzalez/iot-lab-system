import { motion } from 'framer-motion';
import { useState } from 'react';
import { Edit3, Trash2 } from "lucide-react";
import LightControl from './deviceControl/LightControl';

interface ShelfCardProps {
  nombre: string;
  status: "active" | "maintenance" | "inactive";
  sensors?: { id: string; type: string; name: string }[];
  onDelete?: () => void;
  onEdit?: () => void;
}

const ShelfCard = ({
  nombre,
  status,
  sensors = [],
  onDelete,
  onEdit,
}: ShelfCardProps) => {
  const [isHovered, setIsHovered] = useState(false);

  const getStatusColor = () => {
    switch (status) {
      case "active":
        return "bg-gradient-to-r from-gray-700 to-gray-800";
      case "maintenance":
        return "bg-gradient-to-r from-yellow-400 to-orange-600";
      case "inactive":
        return "bg-gradient-to-r from-gray-400 to-gray-600";
      default:
        return "bg-gradient-to-r from-gray-400 to-gray-600";
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
      className="relative bg-gradient-to-br from-white to-gray-50 p-6 rounded-2xl shadow-lg border border-gray-100 overflow-hidden transform transition-all duration-300 hover:shadow-xl hover:-translate-y-1 group"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-r from-gray-100/30 to-gray-200/30 opacity-50 pointer-events-none" />

      {/* Botones de acción superiores */}
      <div className="absolute top-4 right-4 z-10 flex items-center gap-1 opacity-100 transition-opacity duration-300">
        {onEdit && (
          <button
            onClick={handleEdit}
            className="p-2 text-gray-400 hover:text-gray-900 bg-white rounded-full transition-colors duration-300 ring-1 ring-gray-100 hover:ring-gray-200 shadow-sm"
            title="Editar estantería"
          >
            <Edit3 size={16} />
          </button>
        )}
        {onDelete && (
          <button
            onClick={handleDelete}
            className="p-2 text-gray-400 hover:text-red-500 bg-white rounded-full transition-colors duration-300 ring-1 ring-gray-100 hover:ring-red-100 shadow-sm"
            title="Eliminar estantería"
          >
            <Trash2 size={16} />
          </button>
        )}
      </div>

      <div className="relative flex justify-between items-start mb-6 pr-20">
        <h3 className="text-xl font-bold text-gray-800 tracking-tight leading-tight">{nombre}</h3>
        <motion.span
          className={`text-white px-3 py-1 rounded-full text-xs font-medium ${getStatusColor()}`}
          animate={{ scale: isHovered ? 1.1 : 1 }}
          transition={{ duration: 0.2 }}
        >
          {status === 'active' ? 'Activo' : status === 'maintenance' ? 'Mantenimiento' : 'Inactivo'}
        </motion.span>
      </div>

      {/* --- Sensores Asignados --- */}
      {sensors && sensors.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4 z-10 relative">
          {sensors.map((sensor) => (
            <div key={sensor.id} className="h-[165px] relative overflow-hidden rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center">
              <div className="absolute top-0 left-0 w-[115%] transform scale-[0.85] origin-top-left -ml-1 -mt-1">
                {sensor.type === 'light' ? <LightControl /> : null}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Interactive button */}
      <motion.button
        className="relative z-20 mt-6 w-full bg-gradient-to-r from-gray-700 to-gray-900 hover:from-gray-800 hover:to-black text-white py-2 rounded-lg font-medium transition-all duration-300 shadow-lg hover:shadow-xl items-center gap-2 cursor-pointer"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={(e) => {
          e.stopPropagation();
          // Navegación o acción adicional si se requiere
        }}
      >
        Gestionar Filas
      </motion.button>
    </motion.div>
  );
};


export default ShelfCard;

