import { motion } from 'framer-motion';
import { Edit3, Trash2, Layers, Eye } from "lucide-react";
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
  const getStatusConfig = (status: string) => {
    switch (status) {
      case "active":
        return {
          bg: "bg-slate-50",
          text: "text-slate-700",
          dot: "bg-slate-400",
          border: "border-slate-200",
        };
      case "maintenance":
        return {
          bg: "bg-amber-50",
          text: "text-amber-700",
          dot: "bg-amber-400",
          border: "border-amber-200",
        };
      case "inactive":
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
              <div className="w-[133%] transform scale-[0.75] origin-top-left">
                {sensor.type === 'light' ? <LightControl /> : null}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Interactive button */}
      <button
        className="mt-1 w-full flex items-center justify-center p-3 text-sm font-semibold text-white bg-gradient-to-r from-gray-700 to-gray-900 hover:from-gray-800 hover:to-black border border-gray-300 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-100 cursor-pointer"
        onClick={(e) => {
          e.stopPropagation();
          // Navegación o acción adicional si se requiere
        }}
      >
        <span className="flex justify-center gap-2">
          <Eye size={16} />
          <span>Gestionar Filas</span>
        </span>
      </button>
    </motion.div>
  );
};

export default ShelfCard;

