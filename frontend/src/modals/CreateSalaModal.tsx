import { useState, useEffect } from 'react';
import { X, DoorOpen, Tag, FileText, Activity, Thermometer, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ComponentPanel from '../components/ComponentPanel';
import TemperatureControl from '../components/deviceControl/TemperatureControl';
import HumidityControl from '../components/deviceControl/HumidityControl';

interface PlacedSensor {
    id: string;
    type: string;
    name: string;
}

interface CreateSalaModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (salaData: { nombre: string; descripcion: string; estadoId: string; sensors: PlacedSensor[] }) => void;
    editingRoom?: { nombre: string; descripcion: string; estadoId: string; sensors?: PlacedSensor[] } | null;
}

export default function CreateSalaModal({ isOpen, onClose, onSave, editingRoom }: CreateSalaModalProps) {
    const [formData, setFormData] = useState({
        nombre: '',
        descripcion: '',
        estadoId: '1',
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isPanelOpen, setIsPanelOpen] = useState(false);
    const [placedSensors, setPlacedSensors] = useState<PlacedSensor[]>([]);

    useEffect(() => {
        if (isOpen) {
            if (editingRoom) {
                setFormData({
                    nombre: editingRoom.nombre,
                    descripcion: editingRoom.descripcion,
                    estadoId: editingRoom.estadoId,
                });
                setPlacedSensors(editingRoom.sensors || []);
            } else {
                setFormData({ nombre: '', descripcion: '', estadoId: '1' });
                setPlacedSensors([]);
            }
            setErrors({});
            setIsPanelOpen(false);
        }
    }, [isOpen, editingRoom]);

    const validate = () => {
        const newErrors: Record<string, string> = {};
        if (!formData.nombre.trim()) newErrors.nombre = 'El nombre es obligatorio';
        if (formData.nombre.trim().length > 100) newErrors.nombre = 'Máximo 100 caracteres';
        if (!formData.descripcion.trim()) newErrors.descripcion = 'La descripción es obligatoria';
        if (formData.descripcion.trim().length > 500) newErrors.descripcion = 'Máximo 500 caracteres';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        if (errors[field]) {
            setErrors(prev => {
                const copy = { ...prev };
                delete copy[field];
                return copy;
            });
        }
    };

    const handleAddSensor = (component: any) => {
        const newSensor: PlacedSensor = {
            id: `${component.type}-${Date.now()}`,
            type: component.type,
            name: component.name,
        };
        setPlacedSensors(prev => [...prev, newSensor]);
    };

    const handleRemoveSensor = (sensorId: string) => {
        setPlacedSensors(prev => prev.filter(s => s.id !== sensorId));
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'copy';
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        const data = e.dataTransfer.getData('application/json');
        if (!data) return;
        try {
            const componentData = JSON.parse(data);
            if (componentData.type === 'temperature' || componentData.type === 'humidity') {
                handleAddSensor(componentData);
            }
        } catch (error) {
            console.error('Error al procesar componente:', error);
        }
    };

    const renderSensorWidget = (sensor: PlacedSensor) => {
        switch (sensor.type) {
            case 'temperature':
                return <TemperatureControl />;
            case 'humidity':
                return <HumidityControl />;
            default:
                return null;
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;

        setIsSubmitting(true);
        try {
            await onSave({ ...formData, sensors: placedSensors });
            setFormData({ nombre: '', descripcion: '', estadoId: '1' });
            setErrors({});
            setPlacedSensors([]);
            onClose();
        } catch (error: any) {
            const msg = error.response?.data?.message || 'Error al guardar el módulo';
            alert(msg);
            console.error(error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleOverlayClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget) onClose();
    };

    return (
        <>
            <AnimatePresence>
                {isOpen && (
                    <div
                        className="fixed inset-0 z-[100] flex items-center justify-center"
                        onClick={handleOverlayClick}
                    >
                        <motion.div
                            className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                        />

                        <motion.div
                            className={`relative bg-white rounded-2xl shadow-2xl w-full ${editingRoom ? 'max-w-2xl' : 'max-w-md'} mx-4 max-h-[90vh] overflow-hidden flex flex-col`}
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="bg-gradient-to-r from-gray-50 to-white border-b border-gray-100 flex-shrink-0">
                                <div className="flex justify-between items-center px-5 py-3">
                                    <div className="flex items-center gap-2.5">
                                        <div className="w-9 h-9 bg-gradient-to-br from-emerald-500 to-green-600 rounded-lg flex items-center justify-center shadow-md shadow-emerald-500/25">
                                            <DoorOpen size={18} className="text-white" />
                                        </div>
                                        <div>
                                            <h2 className="text-base font-bold text-gray-900">
                                                {editingRoom ? 'Editar Módulo' : 'Nuevo Módulo'}
                                            </h2>
                                            <p className="text-[11px] text-gray-500">
                                                {editingRoom ? 'Modifica los datos del módulo' : 'Registra un nuevo módulo en el laboratorio'}
                                            </p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={onClose}
                                        className="p-1.5 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-all duration-200"
                                    >
                                        <X size={16} />
                                    </button>
                                </div>
                            </div>

                            <form onSubmit={handleSubmit} className="px-5 py-4 space-y-3 overflow-y-auto">
                                <div>
                                    <label className="flex items-center gap-1.5 text-xs font-semibold text-gray-700 mb-1">
                                        <Tag size={12} className="text-emerald-600" />
                                        Nombre del Módulo
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.nombre}
                                        onChange={(e) => handleChange('nombre', e.target.value)}
                                        placeholder="Ej: Módulo de Control Principal"
                                        className={`w-full px-3 py-2 text-sm border rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all duration-200 bg-gray-50 hover:bg-white focus:bg-white ${errors.nombre ? 'border-red-400 ring-1 ring-red-400' : 'border-gray-300'}`}
                                    />
                                    {errors.nombre && (
                                        <motion.p className="text-red-500 text-xs mt-1.5 flex items-center gap-1">
                                            <span>⚠</span> {errors.nombre}
                                        </motion.p>
                                    )}
                                </div>

                                <div>
                                    <label className="flex items-center gap-1.5 text-xs font-semibold text-gray-700 mb-1">
                                        <FileText size={12} className="text-emerald-600" />
                                        Descripción
                                    </label>
                                    <textarea
                                        value={formData.descripcion}
                                        onChange={(e) => handleChange('descripcion', e.target.value)}
                                        placeholder="Describe brevemente el propósito del módulo..."
                                        rows={2}
                                        className={`w-full px-3 py-2 text-sm border rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all duration-200 resize-none bg-gray-50 hover:bg-white focus:bg-white ${errors.descripcion ? 'border-red-400 ring-1 ring-red-400' : 'border-gray-300'}`}
                                    />
                                    {errors.descripcion && (
                                        <motion.p className="text-red-500 text-xs mt-1.5 flex items-center gap-1">
                                            <span>⚠</span> {errors.descripcion}
                                        </motion.p>
                                    )}
                                </div>

                                <div>
                                    <label className="flex items-center gap-1.5 text-xs font-semibold text-gray-700 mb-1">
                                        <Activity size={12} className="text-emerald-600" />
                                        Estado Inicial
                                    </label>
                                    <div className="grid grid-cols-3 gap-2">
                                        {[
                                            { value: '1', label: 'Activo', icon: '🟢', color: 'emerald' },
                                            { value: '2', label: 'Mantenimiento', icon: '🟡', color: 'amber' },
                                            { value: '3', label: 'Inactivo', icon: '🔴', color: 'red' },
                                        ].map((option) => (
                                            <button
                                                key={option.value}
                                                type="button"
                                                onClick={() => handleChange('estadoId', option.value)}
                                                className={`relative p-2 rounded-lg border-2 transition-all duration-200 text-center ${formData.estadoId === option.value ? 'border-emerald-500 bg-emerald-50' : 'border-gray-200 bg-gray-50'}`}
                                            >
                                                <span className="text-sm block">{option.icon}</span>
                                                <span className="text-[11px] font-semibold">{option.label}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {editingRoom && (
                                    <div>
                                        <div className="flex items-center justify-between mb-2 mt-4">
                                            <label className="flex items-center gap-1.5 text-xs font-semibold text-gray-700">
                                                <Thermometer size={12} className="text-emerald-600" />
                                                Sensores del Módulo
                                            </label>
                                            <button
                                                type="button"
                                                onClick={() => setIsPanelOpen(true)}
                                                className="flex items-center gap-1 px-3 py-1.5 text-[11px] font-semibold text-white bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 rounded-lg shadow-sm transition-all duration-200"
                                            >
                                                <span className="text-sm">+</span>
                                                Agregar Sensor
                                            </button>
                                        </div>

                                        <div
                                            className="min-h-[120px] rounded-xl border-2 border-dashed border-gray-300 bg-gray-50/50 p-3 transition-colors duration-200"
                                            onDragOver={handleDragOver}
                                            onDrop={handleDrop}
                                        >
                                            {placedSensors.length === 0 ? (
                                                <div className="flex flex-col items-center justify-center h-full py-4 text-center">
                                                    <p className="text-xs text-gray-500 font-medium">No hay sensores asignados</p>
                                                    <p className="text-[10px] text-gray-400 mt-0.5">Arrastra o haz clic en "Agregar Sensor" para añadir</p>
                                                </div>
                                            ) : (
                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                    {placedSensors.map((sensor) => (
                                                        <div key={sensor.id} className="relative group bg-white rounded-xl shadow-sm border border-gray-200 p-2">
                                                            <div className="flex items-center justify-between mb-2 pb-2 border-b border-gray-100">
                                                                <span className="text-xs font-semibold text-gray-700 capitalize">
                                                                    {sensor.name || sensor.type}
                                                                </span>
                                                                <button
                                                                    type="button"
                                                                    onClick={() => handleRemoveSensor(sensor.id)}
                                                                    className="p-1 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors"
                                                                >
                                                                    <Trash2 size={12} />
                                                                </button>
                                                            </div>
                                                            <div className="h-[120px] relative overflow-hidden rounded-lg bg-gray-50 flex items-center justify-center">
                                                                <div className="absolute top-0 left-0 w-full transform scale-[0.65] origin-top-left -ml-2 -mt-4">
                                                                    {renderSensorWidget(sensor)}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}

                                <div className="flex gap-3 pt-4 mt-4 border-t border-gray-100">
                                    <button
                                        type="button"
                                        onClick={onClose}
                                        disabled={isSubmitting}
                                        className="flex-1 px-4 py-2 text-sm font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl border border-gray-200 transition-all duration-200 disabled:opacity-50"
                                    >
                                        Cancelar
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="flex-1 px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 rounded-xl shadow-md shadow-emerald-500/25 hover:shadow-lg hover:shadow-emerald-500/30 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                    >
                                        {isSubmitting ? 'Guardando...' : (editingRoom ? 'Guardar Cambios' : 'Crear Módulo')}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            <ComponentPanel
                isOpen={isPanelOpen}
                onClose={() => setIsPanelOpen(false)}
                onAddComponent={handleAddSensor}
                allowedTypes={['temperature', 'humidity']}
            />
        </>
    );
}
