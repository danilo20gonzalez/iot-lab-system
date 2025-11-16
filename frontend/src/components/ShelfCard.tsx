import { motion } from 'framer-motion';
import { useState } from 'react';

interface ShelfCardProps {
  nombre: string;
  proyectoNombre: string;
  filasTotal: number;
  filasUsadas: number;
  intensidadLuz: number;
  modulosActivos: number;
  status: "activo" | "inactivo" | "alerta";
}

const ShelfCard = ({
  nombre,
  proyectoNombre,
  filasTotal,
  filasUsadas,
  intensidadLuz,
  modulosActivos,
  status,
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

  // Calcular porcentaje de uso de filas
  const usagePercentage = filasTotal > 0 
    ? Math.min((filasUsadas / filasTotal) * 100, 100) 
    : 0;

  // Calcular porcentaje de intensidad de luz
  const lightPercentage = Math.min(intensidadLuz, 100);

  // Determinar color de la luz según intensidad
  const getLightColor = () => {
    if (intensidadLuz < 30) return '#EF4444'; // Rojo - Baja
    if (intensidadLuz < 60) return '#F59E0B'; // Naranja - Media
    return '#10B981'; // Verde - Alta/Óptima
  };

  // Determinar ícono según intensidad
  const getLightIcon = () => {
    if (intensidadLuz < 30) return '🔴';
    if (intensidadLuz < 60) return '🟡';
    return '🟢';
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
      <div className="absolute inset-0 bg-gradient-to-r from-purple-100/30 to-pink-100/30 opacity-50" />
      
      <div className="relative">
        {/* Header con nombre y status */}
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-xl font-bold text-gray-800 tracking-tight">{nombre}</h3>
          <motion.span
            className={`text-white px-3 py-1 rounded-full text-sm font-medium ${getStatusColor()}`}
            animate={{ scale: isHovered ? 1.1 : 1 }}
            transition={{ duration: 0.2 }}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </motion.span>
        </div>

        {/* Proyecto asignado */}
        <div className="mb-4 flex items-center gap-2">
          <span className="text-xs font-semibold text-purple-600 bg-purple-100 px-2 py-1 rounded-lg">
            📦 {proyectoNombre}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-6">
          {/* Filas Usadas */}
          <div className="space-y-1">
            <p className="text-gray-500 text-sm">Filas Usadas</p>
            <motion.p
              className="text-2xl font-bold text-gray-800"
              animate={{ color: isHovered ? '#A855F7' : '#1F2937' }}
              transition={{ duration: 0.3 }}
            >
              {filasUsadas}/{filasTotal}
            </motion.p>
            {/* Barra de progreso */}
            <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
              <motion.div
                className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full"
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
              animate={{ color: isHovered ? '#A855F7' : '#1F2937' }}
              transition={{ duration: 0.3 }}
            >
              {modulosActivos}
            </motion.p>
          </div>

          {/* Intensidad de Luz con círculo de progreso */}
          <div className="col-span-2 flex items-center space-x-4">
            <p className="text-gray-500 text-sm">Intensidad de Luz</p>
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
                  stroke={getLightColor()}
                  strokeWidth="3"
                  strokeDasharray={`${lightPercentage}, 100`}
                  initial={{ strokeDasharray: '0, 100' }}
                  animate={{ strokeDasharray: `${lightPercentage}, 100` }}
                  transition={{ duration: 1, ease: 'easeInOut' }}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <p className="text-lg font-bold text-gray-800">{intensidadLuz}%</p>
              </div>
            </div>
            <div className="flex-1">
              <div className="text-xs text-gray-500 flex items-center gap-1">
                <span className="text-base">{getLightIcon()}</span>
                {intensidadLuz < 30 && <span className="text-red-500 font-semibold">Baja</span>}
                {intensidadLuz >= 30 && intensidadLuz < 60 && <span className="text-orange-500 font-semibold">Media</span>}
                {intensidadLuz >= 60 && <span className="text-green-500 font-semibold">Óptima</span>}
              </div>
              {/* Barra de intensidad horizontal pequeña */}
              <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                <motion.div
                  className="h-1.5 rounded-full"
                  style={{ backgroundColor: getLightColor() }}
                  initial={{ width: 0 }}
                  animate={{ width: `${lightPercentage}%` }}
                  transition={{ duration: 1, ease: 'easeInOut' }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Interactive button */}
        <motion.button
          className="mt-6 w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-2 rounded-lg font-medium hover:from-purple-600 hover:to-pink-600 transition-all"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Ver Detalles
        </motion.button>
      </div>
    </motion.div>
  );
};

export default ShelfCard;