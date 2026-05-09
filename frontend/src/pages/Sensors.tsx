// src/pages/Sensors.tsx
import { useState, useMemo, useEffect } from 'react';
import Navbar from '../components/Navbar';
import AirConditionerControl from '../components/deviceControl/AirConditionerControl';
import LightControl from '../components/deviceControl/LightControl';
import RealTimeCamera from '../components/deviceControl/RealTimeCamera';
import WaterValveControl from '../components/deviceControl/WaterValveControl';
import TemperatureControl from '../components/deviceControl/TemperatureControl';
import HumidityControl from '../components/deviceControl/HumidityControl';
import PhControl from '../components/deviceControl/PhControl';
import CreateSensorModal from '../modals/CreateSensorModal';
import type { SensorFormData } from '../modals/CreateSensorModal';
import { obtenerSensoresHA, obtenerSwitchesHA } from '../api/api';
import {
  Wind, Lightbulb, Camera, Droplets, Plus, Search,
  Filter, Cpu, Trash2, MapPin, ChevronDown, Thermometer, Beaker
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

/* ─── Tipos de sensor base ─── */
const SENSOR_TYPE_META: Record<string, {
  name: string;
  icon: typeof Wind;
  gradient: string;
  dot: string;
  badge: string;
}> = {
  'air-conditioner': {
    name: 'Aire Acondicionado',
    icon: Wind,
    gradient: 'from-cyan-500 to-blue-600',
    dot: 'bg-cyan-400',
    badge: 'bg-cyan-500/10 text-cyan-600 border-cyan-200',
  },
  light: {
    name: 'Control de Luces',
    icon: Lightbulb,
    gradient: 'from-yellow-400 to-amber-500',
    dot: 'bg-yellow-400',
    badge: 'bg-yellow-500/10 text-yellow-700 border-yellow-200',
  },
  camera: {
    name: 'Cámara de Seguridad',
    icon: Camera,
    gradient: 'from-emerald-500 to-green-600',
    dot: 'bg-emerald-400',
    badge: 'bg-emerald-500/10 text-emerald-600 border-emerald-200',
  },
  valve: {
    name: 'Válvula de Agua',
    icon: Droplets,
    gradient: 'from-blue-500 to-indigo-600',
    dot: 'bg-blue-400',
    badge: 'bg-blue-500/10 text-blue-600 border-blue-200',
  },
  temperature: {
    name: 'Sensor Temperatura',
    icon: Thermometer,
    gradient: 'from-orange-500 to-red-500',
    dot: 'bg-red-400',
    badge: 'bg-red-500/10 text-red-600 border-red-200',
  },
  humidity: {
    name: 'Sensor Humedad',
    icon: Droplets,
    gradient: 'from-indigo-500 to-purple-600',
    dot: 'bg-indigo-400',
    badge: 'bg-indigo-500/10 text-indigo-600 border-indigo-200',
  },
  ph: {
    name: 'Sensor pH',
    icon: Beaker,
    gradient: 'from-blue-600 to-cyan-600',
    dot: 'bg-blue-400',
    badge: 'bg-blue-500/10 text-blue-600 border-blue-200',
  },
};

const FILTER_OPTIONS = [
  { value: 'all', label: 'Todos' },
  { value: 'air-conditioner', label: 'Aire Acondicionado' },
  { value: 'light', label: 'Luces' },
  { value: 'camera', label: 'Cámaras' },
  { value: 'valve', label: 'Válvulas' },
  { value: 'temperature', label: 'Temperatura' },
  { value: 'humidity', label: 'Humedad' },
  { value: 'ph', label: 'pH' },
];

/* ─── Sensores iniciales (los 4 que ya existen) ─── */
const DEFAULT_SENSORS: SensorFormData[] = [
  {
    id: 'default-ac-1',
    nombre: 'AC-Lab-Principal',
    descripcion: 'Control de temperatura y ventilación del laboratorio principal',
    tipo: 'air-conditioner',
    estado: 'activo',
    ubicacion: 'Laboratorio Principal',
  },
  {
    id: 'default-light-1',
    nombre: 'LUZ-Sala-Principal',
    descripcion: 'Iluminación general de la sala principal',
    tipo: 'light',
    estado: 'activo',
    ubicacion: 'Sala Principal',
  },
  {
    id: 'default-camera-1',
    nombre: 'CAM-Entrada-Lab',
    descripcion: 'Cámara de seguridad en la entrada del laboratorio',
    tipo: 'camera',
    estado: 'activo',
    ubicacion: 'Entrada Laboratorio',
  },
  {
    id: 'default-valve-1',
    nombre: 'VALV-Jardin-01',
    descripcion: 'Control del sistema hidráulico del jardín',
    tipo: 'valve',
    estado: 'activo',
    ubicacion: 'Jardín Exterior',
  },
  {
    id: 'default-temp-1',
    nombre: 'TEMP-Lab-Principal',
    descripcion: 'Sensor de temperatura ambiental del laboratorio principal',
    tipo: 'temperature',
    estado: 'activo',
    ubicacion: 'Laboratorio Principal',
  },
  {
    id: 'default-hum-1',
    nombre: 'HUM-Lab-Principal',
    descripcion: 'Sensor de humedad ambiental del laboratorio principal',
    tipo: 'humidity',
    estado: 'activo',
    ubicacion: 'Laboratorio Principal',
  },
  {
    id: 'default-ph-1',
    nombre: 'PH-Lab-01',
    descripcion: 'Sensor de pH del tanque de agua principal',
    tipo: 'ph',
    estado: 'activo',
    ubicacion: 'Laboratorio Principal',
  },
];

/* ─── Componente que renderiza el control real ─── */
function SensorControlWidget({ tipo, valor, sensor }: { tipo: string; valor?: number | string; sensor?: any }) {
  switch (tipo) {
    case 'air-conditioner':
      return <AirConditionerControl />;
    case 'light':
      return <LightControl 
        entityId={sensor?.entityId} 
        haState={valor as string} 
        nombre={sensor?.nombre}
      />;
    case 'camera':
      return <RealTimeCamera />;
    case 'valve':
      return <WaterValveControl />;
    case 'temperature':
      
      return <TemperatureControl valorReal={valor} />;
    case 'humidity':
      return <HumidityControl valorReal={valor} />;
    case 'ph':
      return <PhControl valorReal={valor} />;
    default:
      return null;
  }
}

/* ─── Card de sensor ─── */
function SensorCard({
  sensor,
  onDelete,
  index,

}: {
  sensor: SensorFormData;
  onDelete: (id: string) => void;
  index: number;
}) {
  const meta = SENSOR_TYPE_META[sensor.tipo];
  if (!meta) return null;

  const Icon = meta.icon;

  const estadoConfig: Record<string, { label: string; color: string; dot: string }> = {
    activo: { label: 'Activo', color: 'text-emerald-600', dot: 'bg-emerald-400' },
    inactivo: { label: 'Inactivo', color: 'text-red-500', dot: 'bg-red-400' },
    mantenimiento: { label: 'Mantenimiento', color: 'text-amber-600', dot: 'bg-amber-400' },
  };
  const est = estadoConfig[sensor.estado] ?? estadoConfig.activo;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10, scale: 0.95 }}
      transition={{ duration: 0.35, delay: index * 0.06 }}
      layout
      className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-300 group"
    >
      {/* Header con gradiente */}
      <div className={`bg-gradient-to-r ${meta.gradient} px-4 py-2.5 flex items-center justify-between`}>
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
            <Icon size={15} className="text-white" />
          </div>
          <div>
            <h3 className="text-white font-bold text-sm leading-tight truncate max-w-[180px]">
              {sensor.nombre}
            </h3>
            <p className="text-white/70 text-[10px] font-medium">{meta.name}</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          {/* Estado badge */}
          <span className={`flex items-center gap-1 bg-white/20 backdrop-blur-sm px-2 py-0.5 rounded-full`}>
            <span className={`w-1.5 h-1.5 rounded-full ${est.dot} animate-pulse`} />
            <span className="text-white text-[9px] font-bold uppercase tracking-wider">{est.label}</span>
          </span>
          {/* Delete */}
          <button
            onClick={() => onDelete(sensor.id)}
            className="p-1.5 text-white/40 hover:text-white hover:bg-white/20 rounded-lg transition-all duration-200 opacity-0 group-hover:opacity-100"
            title="Eliminar sensor"
          >
            <Trash2 size={13} />
          </button>
        </div>
      </div>

      {/* Info row */}
      <div className="px-4 py-2 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
        <div className="flex items-center gap-1.5 text-gray-500">
          <MapPin size={11} />
          <span className="text-[11px] font-medium">{sensor.ubicacion}</span>
        </div>
        {sensor.descripcion && (
          <span className="text-[10px] text-gray-400 italic truncate max-w-[160px]">{sensor.descripcion}</span>
        )}
      </div>

      {/* Widget del control real */}
      <div className="p-3">
        <SensorControlWidget tipo={sensor.tipo} valor={sensor.valor} sensor={sensor} />
      </div>
    </motion.div>
  );
}

/* ─── PÁGINA PRINCIPAL ─── */
const Sensors = () => {
  const [sensors, setSensors] = useState<SensorFormData[]>(DEFAULT_SENSORS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState(false);

  /* Cargar sensores y switches desde Home Assistant al montar el componente */
  useEffect(() => {
    const cargarSensoresYSwitches = async () => {
      try {
        const [sensoresHA, switchesHA] = await Promise.all([
          obtenerSensoresHA(),
          obtenerSwitchesHA(),
        ]);
        
        // Convertir sensores de HA al formato SensorFormData
        const sensoresFormateados = sensoresHA.map((sensor: any) => ({
          id: sensor.entityId,
          nombre: sensor.nombre,
          descripcion: `Sensor de ${sensor.tipo === 'temperature' ? 'temperatura' : 'humedad'} - ${sensor.valor} ${sensor.unidad}`,
          tipo: sensor.tipo,
          estado: 'activo',
          ubicacion: sensor.ubicacion,
          valor: sensor.valor,
          unidad: sensor.unidad,
        }));

        // Convertir switches al formato SensorFormData
        const switchesFormateados = switchesHA.map((device: any) => ({
          id: device.entityId,
          nombre: device.nombre,
          descripcion: `Switch ${device.nombre} - Estado: ${device.estado}`,
          tipo: 'light',
          estado: device.estado === 'on' ? 'activo' : 'inactivo',
          ubicacion: device.ubicacion,
          valor: device.estado,
          deviceName: device.deviceName,
          entityId: device.entityId,
        }));

        // Combinar sensores y switches del HA con los componentes por defecto
        setSensors([...switchesFormateados, ...sensoresFormateados, ...DEFAULT_SENSORS]);
      } catch (error) {
        console.error('Error al cargar sensores y switches:', error);
        // Si hay error, se mantienen los componentes por defecto
      }
    };

    cargarSensoresYSwitches();
  }, []);

  /* Filtrado */
  const filteredSensors = useMemo(() => {
    return sensors.filter((s) => {
      const matchesType = activeFilter === 'all' || s.tipo === activeFilter;
      const matchesSearch =
        !searchQuery ||
        s.nombre.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.ubicacion.toLowerCase().includes(searchQuery.toLowerCase()) ||
        SENSOR_TYPE_META[s.tipo]?.name.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesType && matchesSearch;
    });
  }, [sensors, activeFilter, searchQuery]);

  /* Conteo por tipo */
  const countByType = useMemo(() => {
    const map: Record<string, number> = { all: sensors.length };
    sensors.forEach((s) => {
      map[s.tipo] = (map[s.tipo] || 0) + 1;
    });
    return map;
  }, [sensors]);

  /* Handlers */
  const handleCreateSensor = (newSensor: SensorFormData) => {
    setSensors((prev) => [...prev, newSensor]);
  };

  const handleDeleteSensor = (id: string) => {
    setSensors((prev) => prev.filter((s) => s.id !== id));
  };

  const activeFilterLabel = FILTER_OPTIONS.find(f => f.value === activeFilter)?.label || 'Todos';

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-7xl mx-auto p-6" style={{ zoom: 0.8 }}>
        {/* ─── Header ─── */}
        <div className="mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <div className="w-1 h-8 bg-gradient-to-b from-emerald-600 to-green-700 rounded-full" />
                Sensores
              </h1>
              <p className="text-sm text-gray-500 mt-1 ml-4">
                Gestiona y monitorea todos los dispositivos IoT del sistema
              </p>
            </div>
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white px-6 py-2.5 rounded-xl font-bold transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 flex items-center gap-2 cursor-pointer self-start sm:self-auto"
            >
              <Plus size={18} />
              Nuevo Sensor
            </button>
          </div>
        </div>

        {/* ─── Stats row ─── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          {Object.entries(SENSOR_TYPE_META).map(([type, meta]) => {
            const Icon = meta.icon;
            const count = countByType[type] || 0;
            return (
              <motion.div
                key={type}
                whileHover={{ y: -2 }}
                onClick={() => setActiveFilter(activeFilter === type ? 'all' : type)}
                className={`bg-white rounded-xl border p-3 cursor-pointer transition-all duration-200 ${activeFilter === type
                  ? 'border-emerald-400 shadow-md shadow-emerald-500/10 ring-1 ring-emerald-400/30'
                  : 'border-gray-200 hover:border-gray-300'
                  }`}
              >
                <div className="flex items-center justify-between">
                  <div className={`w-9 h-9 rounded-lg bg-gradient-to-br ${meta.gradient} flex items-center justify-center`}>
                    <Icon size={18} className="text-white" />
                  </div>
                  <span className="text-2xl font-black text-gray-900">{count}</span>
                </div>
                <p className="text-xs font-semibold text-gray-600 mt-2 truncate">{meta.name}</p>
                <div className="flex items-center gap-1 mt-0.5">
                  <span className={`w-1.5 h-1.5 rounded-full ${meta.dot} animate-pulse`} />
                  <span className="text-[10px] text-gray-400">
                    {count === 1 ? '1 dispositivo' : `${count} dispositivos`}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* ─── Toolbar: Search + Filter ─── */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          {/* Search */}
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar por nombre, tipo o ubicación..."
              className="w-full pl-9 pr-4 py-2.5 text-sm border border-gray-300 rounded-xl bg-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all duration-200"
            />
          </div>

          {/* Filter dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsFilterDropdownOpen(!isFilterDropdownOpen)}
              className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-300 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-all duration-200 min-w-[180px] justify-between"
            >
              <div className="flex items-center gap-2">
                <Filter size={14} className="text-emerald-600" />
                <span>{activeFilterLabel}</span>
              </div>
              <ChevronDown size={14} className={`text-gray-400 transition-transform duration-200 ${isFilterDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            <AnimatePresence>
              {isFilterDropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -8, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.97 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 top-12 bg-white border border-gray-200 rounded-xl shadow-xl z-30 w-52 overflow-hidden"
                >
                  {FILTER_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => {
                        setActiveFilter(opt.value);
                        setIsFilterDropdownOpen(false);
                      }}
                      className={`w-full px-4 py-2.5 text-left text-sm flex items-center justify-between transition-colors ${activeFilter === opt.value
                        ? 'bg-emerald-50 text-emerald-700 font-semibold'
                        : 'text-gray-700 hover:bg-gray-50'
                        }`}
                    >
                      <span>{opt.label}</span>
                      <span className="text-xs text-gray-400 font-mono">{countByType[opt.value] || 0}</span>
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* ─── Sensor Grid ─── */}
        {filteredSensors.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-20 border-2 border-dashed border-gray-300 rounded-2xl bg-white"
          >
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <Cpu size={28} className="text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-700 mb-1">
              {searchQuery || activeFilter !== 'all'
                ? 'No se encontraron sensores'
                : 'No hay sensores registrados'}
            </h3>
            <p className="text-sm text-gray-500 mb-4">
              {searchQuery || activeFilter !== 'all'
                ? 'Intenta con otros filtros o términos de búsqueda'
                : 'Crea tu primer sensor para comenzar a monitorear'}
            </p>
            {!searchQuery && activeFilter === 'all' && (
              <button
                onClick={() => setIsModalOpen(true)}
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 flex items-center gap-2"
              >
                <Plus size={16} /> Crear Sensor
              </button>
            )}
          </motion.div>
        ) : (
          <motion.div layout className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <AnimatePresence mode="popLayout">
              {filteredSensors.map((sensor, i) => (
                <SensorCard
                  key={sensor.id}
                  sensor={sensor}
                  onDelete={handleDeleteSensor}
                  index={i}
                  
                />
              ))}
            </AnimatePresence>
          </motion.div>
        )}

        {/* Resumen inferior */}
        <div className="mt-6 flex items-center justify-between text-xs text-gray-400 px-1">
          <span>
            Mostrando {filteredSensors.length} de {sensors.length} sensores
          </span>
          <span className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Sistema sincronizado
          </span>
        </div>
      </div>

      {/* Modal de creación */}
      <CreateSensorModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreated={handleCreateSensor}
      />

      {/* Cerrar dropdown si se hace clic fuera */}
      {isFilterDropdownOpen && (
        <div
          className="fixed inset-0 z-20"
          onClick={() => setIsFilterDropdownOpen(false)}
        />
      )}
    </div>
  );
};

export default Sensors;
