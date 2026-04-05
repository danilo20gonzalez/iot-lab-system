import { motion } from 'framer-motion';
import { useState } from 'react';
import { Eye, Edit3, Trash2 } from "lucide-react";
import LightControl from './deviceControl/LightControl';

interface ShelfCardProps {
  nombre: string;
  proyectoNombre: string;
  filasTotal: number;
  filasUsadas: number;
  modulosActivos: number;
  status: "activo" | "inactivo" | "alerta";
  onDelete?: () => void;
  onEdit?: () => void;
  onView?: () => void;
}

const ShelfCard = ({
  nombre,
  proyectoNombre,
  filasTotal,
  filasUsadas,
  modulosActivos,
  status,
  onDelete,
  onEdit,
  onView,
}: ShelfCardProps) => {
  const [isHovered, setIsHovered] = useState(false);

  const getStatusColor = () => {
    switch (status) {
      case "activo":
        return "bg-gradient-to-r from-purple-400 to-pink-600";
      case "inactivo":
        return "bg-gradient-to-r from-gray-400 to-gray-600";
      case "alerta":
        return "bg-gradient-to-r from-yellow-400 to-orange-600";
      default:
        return "bg-gradient-to-r from-gray-400 to-gray-600";
    }
  };

  const usagePercentage = filasTotal > 0 
    ? Math.min((filasUsadas / filasTotal) * 100, 100) 
    : 0;

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
    <motion.div
      className="relative bg-gradient-to-br from-white to-gray-50 p-6 rounded-2xl shadow-lg border border-gray-100 overflow-hidden transform transition-all duration-300 hover:shadow-xl hover:-translate-y-1 flex flex-col gap-4 group"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-r from-purple-100/30 to-pink-100/30 opacity-50 pointer-events-none" />

      {/* Botones de acción superiores */}
      <div className="absolute top-4 right-4 z-10 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <button
          onClick={handleView}
          className="p-2 text-gray-400 hover:text-purple-600 bg-white rounded-full transition-colors duration-300 ring-1 ring-gray-100 hover:ring-purple-200 shadow-sm"
          title="Ver detalles"
        >
          <Eye size={16} />
        </button>
        <button
          onClick={handleEdit}
          className="p-2 text-gray-400 hover:text-blue-600 bg-white rounded-full transition-colors duration-300 ring-1 ring-gray-100 hover:ring-blue-200 shadow-sm"
          title="Editar estantería"
        >
          <Edit3 size={16} />
        </button>
        <button
          onClick={handleDelete}
          className="p-2 text-gray-400 hover:text-red-500 bg-white rounded-full transition-colors duration-300 ring-1 ring-gray-100 hover:ring-red-100 shadow-sm"
          title="Eliminar estantería"
        >
          <Trash2 size={16} />
        </button>
      </div>
      
      <div className="relative z-0">
        {/* Header con nombre y status */}
        <div className="flex justify-between items-start mb-3 pr-28">
          <div>
            <h3 className="text-xl font-bold text-gray-800 tracking-tight leading-tight">{nombre}</h3>
            {/* Proyecto asignado alineado debajo del nombre */}
            <div className="mt-2 flex items-center">
              <span className="text-xs font-semibold text-purple-600 bg-purple-100 px-2 py-1 rounded-lg">
                📦 {proyectoNombre}
              </span>
            </div>
          </div>
          <span
            className={`text-white px-3 py-1 rounded-full text-xs font-bold uppercase transition-transform duration-300 ${getStatusColor()}`}
            style={{ transform: isHovered ? 'scale(1.05)' : 'scale(1)' }}
          >
            {status}
          </span>
        </div>

        {/* Módulos Activos (como badge o info pequeña adicional) */}
        <div className="flex items-center gap-2 mb-4">
           <span className="text-xs font-semibold text-gray-500 bg-gray-100 px-2 py-1 rounded-md">
              Módulos activos: {modulosActivos}
           </span>
        </div>

        {/* Filas Usadas - Rediseño Horizontal */}
        <div className="mb-6">
          <div className="flex justify-between items-end mb-1">
            <span className="text-gray-600 text-sm font-semibold">Filas</span>
            <span className="text-gray-800 text-sm font-bold">{filasUsadas} / {filasTotal}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-1.5 overflow-hidden">
            <motion.div
              className="bg-gradient-to-r from-purple-500 to-pink-500 h-1.5 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${usagePercentage}%` }}
              transition={{ duration: 1, ease: 'easeInOut' }}
            />
          </div>
        </div>

        {/* Light Control dentro de la card */}
        <div className="flex justify-center border-t border-gray-100 pt-5">
           <LightControl />
        </div>
      </div>
    </motion.div>
  );
};

export default ShelfCard;