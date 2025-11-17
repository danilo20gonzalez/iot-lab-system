import { motion } from 'framer-motion';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface LabRoomCardProps {
  nombre: string;
  dispositivosConectados: number;
  temperatura: number;
  modulosActivos: number;
  status: "activo" | "inactivo" | "alerta";
}

const LabRoomCard = ({
  nombre,
  dispositivosConectados,
  temperatura,
  modulosActivos,
  status,
}: LabRoomCardProps) => {
  const [isHovered, setIsHovered] = useState(false);

  const getStatusColor = () => {
    switch (status) {
      case "activo":
        return "bg-gradient-to-r from-green-400 to-green-600";
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
    
    console.log(`Navigating from ${nombre} to /estante-3d`);
    navigate(`/estante-3d`);
  };

  return (
    <motion.div
      className="relative bg-gradient-to-br from-white to-gray-50 p-6 rounded-2xl shadow-lg border border-gray-100 overflow-hidden transform transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-100/30 to-purple-100/30 opacity-50" />
      
      <div className="relative flex justify-between items-center mb-6">
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
            animate={{ color: isHovered ? '#3B82F6' : '#1F2937' }}
            transition={{ duration: 0.3 }}
          >
            {dispositivosConectados}
          </motion.p>
        </div>
        <div className="space-y-1">
          <p className="text-gray-500 text-sm">Módulos activos</p>
          <motion.p
            className="text-2xl font-bold text-gray-800"
            animate={{ color: isHovered ? '#3B82F6' : '#1F2937' }}
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
                stroke="#3B82F6"
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
        className="mt-6 w-full bg-blue-500 text-white py-2 rounded-lg font-medium hover:bg-blue-600 transition-colors relative z-10" // Agregado relative z-10
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