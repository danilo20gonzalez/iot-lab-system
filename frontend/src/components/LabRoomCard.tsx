import { motion } from 'framer-motion';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Edit3, Trash2 } from "lucide-react";

interface LabRoomCardProps {
  nombre: string;
  dispositivosConectados: number;
  temperatura: number;
  modulosActivos: number;
  status: "activo" | "inactivo" | "alerta";
  onDelete?: () => void;
  onEdit?: () => void;
}

const LabRoomCard = ({
  nombre,
  dispositivosConectados,
  temperatura,
  modulosActivos,
  status,
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

  // Calculate temperature percentage for the progress ring (assuming 0-50°C range)
  const tempPercentage = Math.min((temperatura / 50) * 100, 100);

  // Función para navegar directamente a la vista 3D estática para pruebas
  const handleViewDetails = (e: React.MouseEvent) => {
    // *** IMPORTANTE: Prevenir la propagación del evento ***
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
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-r from-green-100/30 to-green-100/30 opacity-50 pointer-events-none" />

      {/* Botones de acción superiores */}
      <div className="absolute top-4 right-4 z-10 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
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

      <div className="grid grid-cols-2 gap-6">
        <div className="space-y-1">
          <p className="text-gray-500 text-sm">Dispositivos conectados</p>
          <motion.p
            className="text-2xl font-bold text-gray-800"
            animate={{ color: isHovered ? '#0B750E' : '#1F2937' }}
            transition={{ duration: 0.3 }}
          >
            {dispositivosConectados}
          </motion.p>
        </div>
        <div className="space-y-1">
          <p className="text-gray-500 text-sm">Módulos activos</p>
          <motion.p
            className="text-2xl font-bold text-gray-800"
            animate={{ color: isHovered ? '#0B750E' : '#1F2937' }}
            transition={{ duration: 0.3 }}
          >
            {modulosActivos}
          </motion.p>
        </div>
        <div className="col-span-2 flex items-center space-x-4">
          <p className="text-gray-500 text-sm">Temperatura</p>
          <div className="relative w-16 h-16">
            <svg className="w-full h-full" viewBox="0 0 36 36">
              <path
                d="M18 2.0845
                  a 15.9155 15.9155 0 0 1 0 31.831
                  a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="#E5E7EB"
                strokeWidth="3"
              />
              <motion.path
                d="M18 2.0845
                  a 15.9155 15.9155 0 0 1 0 31.831
                  a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="#0B750E"
                strokeWidth="3"
                strokeDasharray={`${tempPercentage}, 100`}
                initial={{ strokeDasharray: '0, 100' }}
                animate={{ strokeDasharray: `${tempPercentage}, 100` }}
                transition={{ duration: 1, ease: 'easeInOut' }}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <p className="text-lg font-bold text-gray-800">{temperatura}°C</p>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive button - VERSIÓN CORREGIDA */}
      <motion.button
        className="mt-6 w-full bg-emerald-600 text-white py-2 rounded-lg font-medium hover:bg-emerald-700 transition-colors relative z-10" // Agregado relative z-10
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleViewDetails}
        // Agregar estas props para asegurar que el click funcione
        onMouseDown={(e) => e.stopPropagation()}
        onMouseUp={(e) => e.stopPropagation()}
      >
        Ver Detalles
      </motion.button>
    </motion.div>
  );
};

export default LabRoomCard;