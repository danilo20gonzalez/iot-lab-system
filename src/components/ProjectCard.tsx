import { motion } from 'framer-motion';
import { useState } from 'react';

interface ProjectCardProps {
  nombre: string;
  estanteriasTotal: number;
  estanteriasUsadas: number;
  phAgua: number;
  modulosActivos: number;
  status: "activo" | "inactivo" | "alerta";
}

const ProjectCard = ({
  nombre,
  estanteriasTotal,
  estanteriasUsadas,
  phAgua,
  modulosActivos,
  status,
}: ProjectCardProps) => {
  const [isHovered, setIsHovered] = useState(false);

  const getStatusColor = () => {
    switch (status) {
      case "activo":
        return "bg-gradient-to-r from-blue-400 to-cyan-600";
      case "inactivo":
        return "bg-gradient-to-r from-gray-400 to-gray-600";
      case "alerta":
        return "bg-gradient-to-r from-yellow-400 to-orange-600";
      default:
        return "bg-gradient-to-r from-gray-400 to-gray-600";
    }
  };

  // Calcular porcentaje de uso de estanterías
  const usagePercentage = estanteriasTotal > 0 
    ? Math.min((estanteriasUsadas / estanteriasTotal) * 100, 100) 
    : 0;

  // Calcular porcentaje de pH (rango 0-14, donde 7 es neutro)
  const phPercentage = Math.min((phAgua / 14) * 100, 100);

  // Determinar color del pH según el valor
  const getPhColor = () => {
    if (phAgua < 6.5) return '#EF4444'; // Rojo - Ácido
    if (phAgua > 8.5) return '#3B82F6'; // Azul - Básico
    return '#10B981'; // Verde - Neutro/Óptimo
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
      <div className="absolute inset-0 bg-gradient-to-r from-blue-100/30 to-cyan-100/30 opacity-50" />
      
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
        {/* Estanterías */}
        <div className="space-y-1">
          <p className="text-gray-500 text-sm">Estanterías Usadas</p>
          <motion.p
            className="text-2xl font-bold text-gray-800"
            animate={{ color: isHovered ? '#0EA5E9' : '#1F2937' }}
            transition={{ duration: 0.3 }}
          >
            {estanteriasUsadas}/{estanteriasTotal}
          </motion.p>
          {/* Barra de progreso */}
          <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
            <motion.div
              className="bg-gradient-to-r from-blue-500 to-cyan-500 h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${usagePercentage}%` }}
              transition={{ duration: 1, ease: 'easeInOut' }}
            />
          </div>
        </div>

        {/* Módulos Activos */}
        <div className="space-y-1">
          <p className="text-gray-500 text-sm">Módulos activos</p>
          <motion.p
            className="text-2xl font-bold text-gray-800"
            animate={{ color: isHovered ? '#0EA5E9' : '#1F2937' }}
            transition={{ duration: 0.3 }}
          >
            {modulosActivos}
          </motion.p>
        </div>

        {/* pH del Agua con círculo de progreso */}
        <div className="col-span-2 flex items-center space-x-4">
          <p className="text-gray-500 text-sm">pH del Agua</p>
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
                stroke={getPhColor()}
                strokeWidth="3"
                strokeDasharray={`${phPercentage}, 100`}
                initial={{ strokeDasharray: '0, 100' }}
                animate={{ strokeDasharray: `${phPercentage}, 100` }}
                transition={{ duration: 1, ease: 'easeInOut' }}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <p className="text-lg font-bold text-gray-800">{phAgua.toFixed(1)}</p>
            </div>
          </div>
          <div className="flex-1">
            <div className="text-xs text-gray-500">
              {phAgua < 6.5 && <span className="text-red-500 font-semibold">⚠️ Ácido</span>}
              {phAgua >= 6.5 && phAgua <= 8.5 && <span className="text-green-500 font-semibold">✓ Óptimo</span>}
              {phAgua > 8.5 && <span className="text-blue-500 font-semibold">⚠️ Básico</span>}
            </div>
          </div>
        </div>
      </div>

      {/* Interactive button */}
      <motion.button
        className="mt-6 w-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white py-2 rounded-lg font-medium hover:from-blue-600 hover:to-cyan-600 transition-all"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        Ver Detalles
      </motion.button>
    </motion.div>
  );
};

export default ProjectCard;