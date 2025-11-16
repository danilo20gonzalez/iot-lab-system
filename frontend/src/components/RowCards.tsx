import { motion } from 'framer-motion';
import { useState } from 'react';

interface RowCardProps {
  nombre: string;
  estanteriaNombre: string;
  espaciosTotal: number;
  espaciosUsados: number;
  intensidadLuz: number;
  temperatura: number;
  modulosActivos: number;
  status: "activo" | "inactivo" | "alerta";
}

const RowCard = ({
  nombre,
  estanteriaNombre,
  espaciosTotal,
  espaciosUsados,
  intensidadLuz,
  temperatura,
  modulosActivos,
  status,
}: RowCardProps) => {
  const [isHovered, setIsHovered] = useState(false);

  const getStatusColor = () => {
    switch (status) {
      case "activo":
        return "bg-gradient-to-r from-amber-400 to-orange-600";
      case "inactivo":
        return "bg-gradient-to-r from-gray-400 to-gray-600";
      case "alerta":
        return "bg-gradient-to-r from-red-400 to-red-600";
      default:
        return "bg-gradient-to-r from-gray-400 to-gray-600";
    }
  };

  // Calcular porcentaje de uso de espacios
  const usagePercentage = espaciosTotal > 0 
    ? Math.min((espaciosUsados / espaciosTotal) * 100, 100) 
    : 0;

  // Calcular porcentaje de intensidad de luz
  const lightPercentage = Math.min(intensidadLuz, 100);

  // Calcular porcentaje de temperatura (rango 0-50°C)
  const tempPercentage = Math.min((temperatura / 50) * 100, 100);

  // Determinar color de la luz según intensidad
  const getLightColor = () => {
    if (intensidadLuz < 30) return '#EF4444'; // Rojo - Baja
    if (intensidadLuz < 60) return '#F59E0B'; // Naranja - Media
    return '#10B981'; // Verde - Alta/Óptima
  };

  // Determinar color de temperatura
  const getTempColor = () => {
    if (temperatura < 18) return '#3B82F6'; // Azul - Frío
    if (temperatura > 28) return '#EF4444'; // Rojo - Caliente
    return '#10B981'; // Verde - Óptimo
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
      <div className="absolute inset-0 bg-gradient-to-r from-amber-100/30 to-orange-100/30 opacity-50" />
      
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

        {/* Estantería asignada */}
        <div className="mb-4 flex items-center gap-2">
          <span className="text-xs font-semibold text-amber-600 bg-amber-100 px-2 py-1 rounded-lg">
            📦 {estanteriaNombre}
          </span>
        </div>

        <div className="space-y-4">
          {/* Espacios Usados */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <p className="text-gray-500 text-sm">Espacios Usados</p>
              <motion.p
                className="text-xl font-bold text-gray-800"
                animate={{ color: isHovered ? '#D97706' : '#1F2937' }}
                transition={{ duration: 0.3 }}
              >
                {espaciosUsados}/{espaciosTotal}
              </motion.p>
            </div>
            {/* Barra de progreso */}
            <div className="w-full bg-gray-200 rounded-full h-2">
              <motion.div
                className="bg-gradient-to-r from-amber-500 to-orange-500 h-2 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${usagePercentage}%` }}
                transition={{ duration: 1, ease: 'easeInOut' }}
              />
            </div>
          </div>

          {/* Grid con Luz y Temperatura */}
          <div className="grid grid-cols-2 gap-4">
            {/* Intensidad de Luz */}
            <div className="space-y-2">
              <p className="text-gray-500 text-xs">Intensidad Luz</p>
              <div className="flex items-center gap-2">
                <div className="relative w-12 h-12">
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
                    <p className="text-xs font-bold text-gray-800">{intensidadLuz}%</p>
                  </div>
                </div>
                <div className="flex-1">
                  <div className="text-[10px] text-gray-500">
                    {intensidadLuz < 30 && <span className="text-red-500 font-semibold">🔴 Baja</span>}
                    {intensidadLuz >= 30 && intensidadLuz < 60 && <span className="text-orange-500 font-semibold">🟡 Media</span>}
                    {intensidadLuz >= 60 && <span className="text-green-500 font-semibold">🟢 Óptima</span>}
                  </div>
                </div>
              </div>
            </div>

            {/* Temperatura */}
            <div className="space-y-2">
              <p className="text-gray-500 text-xs">Temperatura</p>
              <div className="flex items-center gap-2">
                <div className="relative w-12 h-12">
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
                      stroke={getTempColor()}
                      strokeWidth="3"
                      strokeDasharray={`${tempPercentage}, 100`}
                      initial={{ strokeDasharray: '0, 100' }}
                      animate={{ strokeDasharray: `${tempPercentage}, 100` }}
                      transition={{ duration: 1, ease: 'easeInOut' }}
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <p className="text-xs font-bold text-gray-800">{temperatura}°</p>
                  </div>
                </div>
                <div className="flex-1">
                  <div className="text-[10px] text-gray-500">
                    {temperatura < 18 && <span className="text-blue-500 font-semibold">❄️ Frío</span>}
                    {temperatura >= 18 && temperatura <= 28 && <span className="text-green-500 font-semibold">✓ Óptimo</span>}
                    {temperatura > 28 && <span className="text-red-500 font-semibold">🔥 Caliente</span>}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Módulos Activos */}
          <div className="flex justify-between items-center p-3 bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl border border-amber-200">
            <p className="text-gray-600 text-sm font-medium">Módulos Activos</p>
            <motion.p
              className="text-2xl font-bold text-gray-800"
              animate={{ color: isHovered ? '#D97706' : '#1F2937' }}
              transition={{ duration: 0.3 }}
            >
              {modulosActivos}
            </motion.p>
          </div>
        </div>

        {/* Interactive button */}
        <motion.button
          className="mt-6 w-full bg-gradient-to-r from-amber-500 to-orange-500 text-white py-2 rounded-lg font-medium hover:from-amber-600 hover:to-orange-600 transition-all"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Ver Detalles
        </motion.button>
      </div>
    </motion.div>
  );
};

export default RowCard;