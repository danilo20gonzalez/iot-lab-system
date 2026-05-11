import { useState, useEffect } from 'react';
import { X, LayoutGrid, Tag, FileText, Activity, Beaker, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ComponentPanel from '../components/ComponentPanel';
import PhControl from '../components/deviceControl/PhControl';

interface PlacedSensor {
    id: string;
    type: string;
    name: string;
}

interface CreateProjectModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (projectData: { nombre: string; descripcion: string;  sensors: PlacedSensor[] }) => void;
    editingProject?: { id: number; nombre: string; descripcion: string; sensors?: PlacedSensor[] } | null;
}

export default function CreateProjectModal({ isOpen, onClose, onSave, editingProject }: CreateProjectModalProps) {
    const [formData, setFormData] = useState({
        nombre: '',
        descripcion: '',
     
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isPanelOpen, setIsPanelOpen] = useState(false);
    const [placedSensors, setPlacedSensors] = useState<PlacedSensor[]>([]);

    useEffect(() => {
        if (isOpen) {
            if (editingProject) {
                setFormData({
                    nombre: editingProject.nombre,
                    descripcion: editingProject.descripcion,
                });
                setPlacedSensors(editingProject.sensors || []);
            } else {
                setFormData({ nombre: '', descripcion: '' });
                setPlacedSensors([]);
            }
            setErrors({});
            setIsPanelOpen(false);
        }
    }, [isOpen, editingProject]);

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
            if (componentData.type === 'ph') {
                handleAddSensor(componentData);
            }
        } catch (error) {
            console.error('Error al procesar componente:', error);
        }
    };

    const renderSensorWidget = (sensor: PlacedSensor) => {
        switch (sensor.type) {
            case 'ph':
                return <PhControl />;
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
            setFormData({ nombre: '', descripcion: '' });
            setErrors({});
            setPlacedSensors([]);
            onClose();
        } catch (error: any) {
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
                            transition={{ duration: 0.2 }}
                        />

                        <motion.div
                            className={`relative bg-white rounded-2xl shadow-2xl w-full ${editingProject ? 'max-w-2xl' : 'max-w-md'} mx-4 max-h-[90vh] overflow-hidden flex flex-col`}
                            initial={{ opacity: 0, scale: 0.95, y: 10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 10 }}
                            transition={{ duration: 0.2, ease: 'easeOut' }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="bg-gradient-to-r from-gray-50 to-white border-b border-gray-100 flex-shrink-0">
                                <div className="h-1 bg-gradient-to-r from-blue-500 via-cyan-400 to-blue-600" />
                                
                                <div className="flex justify-between items-center px-5 py-3">
                                    <div className="flex items-center gap-2.5">
                                        <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl flex items-center justify-center shadow-md shadow-blue-500/25">
                                            <LayoutGrid size={18} className="text-white" />
                                        </div>
                                        <div>
                                            <h2 className="text-base font-bold text-gray-900">
                                                {editingProject ? 'Editar Proyecto' : 'Nuevo Proyecto'}
                                            </h2>
                                            <p className="text-[11px] text-gray-500 font-medium">
                                                {editingProject ? 'Modifica los datos del proyecto' : 'Registra un nuevo proyecto'}
                                            </p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={onClose}
                                        className="p-1.5 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
                                    >
                                        <X size={18} />
                                    </button>
                                </div>
                            </div>

                            <form id="projectForm" onSubmit={handleSubmit} className="px-5 py-4 space-y-4 overflow-y-auto flex-1">
                                <div>
                                    <label className="flex items-center gap-1.5 text-xs font-bold text-gray-700 mb-1.5">
                                        <Tag size={14} className="text-blue-500" />
                                        Nombre del Proyecto
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.nombre}
                                        onChange={(e) => handleChange('nombre', e.target.value)}
                                        placeholder="Ej: Proyecto Hidropónico"
                                        className={`w-full px-3.5 py-2.5 text-sm border rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all duration-200 bg-gray-50/50 hover:bg-white focus:bg-white ${errors.nombre ? 'border-red-400 ring-1 ring-red-400 focus:ring-red-400/20' : 'border-gray-200'}`}
                                    />
                                    {errors.nombre && <p className="text-red-500 text-[11px] mt-1 font-medium pl-1">{errors.nombre}</p>}
                                </div>

                                <div>
                                    <label className="flex items-center gap-1.5 text-xs font-bold text-gray-700 mb-1.5">
                                        <FileText size={14} className="text-blue-500" />
                                        Descripción
                                    </label>
                                    <textarea
                                        value={formData.descripcion}
                                        onChange={(e) => handleChange('descripcion', e.target.value)}
                                        placeholder="Describe el propósito del proyecto..."
                                        rows={3}
                                        className={`w-full px-3.5 py-2.5 text-sm border rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all duration-200 resize-none bg-gray-50/50 hover:bg-white focus:bg-white ${errors.descripcion ? 'border-red-400 ring-1 ring-red-400 focus:ring-red-400/20' : 'border-gray-200'}`}
                                    />
                                    <div className="flex justify-between items-center mt-1 px-1">
                                        <p className="text-red-500 text-[11px] font-medium">{errors.descripcion}</p>
                                        <span className="text-[10px] text-gray-400 font-medium">
                                            {formData.descripcion.length}/500
                                        </span>
                                    </div>
                                </div>

                                <div>
                                    <label className="flex items-center gap-1.5 text-xs font-bold text-gray-700 mb-2">
                                        <Activity size={14} className="text-blue-500" />
                                        Estado
                                    </label>
                                    <div className="grid grid-cols-3 gap-2">
                                        {[
                                            { value: '1', label: 'Activo', icon: '🟢', color: 'blue' },
                                            { value: '2', label: 'Mantenimiento', icon: '🟡', color: 'amber' },
                                            { value: '3', label: 'Inactivo', icon: '🔴', color: 'red' },
                                        ].map((option) => (
                                            <button
                                                key={option.value}
                                                type="button"
                                                onClick={() => handleChange('estadoId', option.value)}
                                                className={`relative p-2 rounded-lg border-2 transition-all duration-200 text-center 
                                                    ? option.color === 'blue'
                                                        ? 'border-blue-500 bg-blue-50 shadow-md shadow-blue-500/10'
                                                        : option.color === 'amber'
                                                            ? 'border-amber-500 bg-amber-50 shadow-md shadow-amber-500/10'
                                                            : 'border-red-500 bg-red-50 shadow-md shadow-red-500/10'
                                                    : 'border-gray-200 bg-gray-50 hover:border-gray-300 hover:bg-white'
                                                    }`}
                                            >
                                                <span className="text-sm block">{option.icon}</span>
                                                <span className={`text-[11px] font-semibold $e ? 'text-gray-800' : 'text-gray-500'}`}>
                                                    {option.label}
                                                </span>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {editingProject && (
                                    <div className="mt-6 border-t border-gray-100 pt-5">
                                        <h3 className="text-sm font-bold text-gray-800 flex items-center gap-2 mb-3">
                                            <Beaker size={16} className="text-blue-500" />
                                            Sensores IoT del Proyecto
                                        </h3>
                                        <p className="text-xs text-gray-500 mb-3">
                                            Arrastra sensores desde el panel o haz clic para añadir
                                        </p>

                                        <div
                                            className={`border-2 border-dashed rounded-2xl p-4 transition-all duration-200 ${placedSensors.length === 0 ? 'border-blue-200 bg-blue-50/30 min-h-[160px] flex items-center justify-center' : 'border-gray-200 bg-white shadow-inner'}`}
                                            onDragOver={handleDragOver}
                                            onDrop={handleDrop}
                                        >
                                            {placedSensors.length === 0 ? (
                                                <div className="text-center px-6">
                                                    <div className="w-12 h-12 bg-blue-100 text-blue-500 rounded-full flex items-center justify-center mx-auto mb-3">
                                                        <Beaker size={24} />
                                                    </div>
                                                    <p className="text-sm font-medium text-gray-600 mb-3">No hay sensores instalados</p>
                                                    <button
                                                        type="button"
                                                        onClick={() => setIsPanelOpen(true)}
                                                        className="text-xs font-semibold text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 px-4 py-2 rounded-lg transition-colors"
                                                    >
                                                        Abrir Panel de Componentes
                                                    </button>
                                                </div>
                                            ) : (
                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                    {placedSensors.map((sensor) => (
                                                        <div key={sensor.id} className="relative group">
                                                            <div className="h-[120px] relative overflow-hidden rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center">
                                                                <div className="absolute top-0 left-0 w-full transform scale-[0.65] origin-top-left -ml-2 -mt-4">
                                                                    {renderSensorWidget(sensor)}
                                                                </div>
                                                            </div>
                                                            <button
                                                                type="button"
                                                                onClick={() => handleRemoveSensor(sensor.id)}
                                                                className="absolute -top-2 -right-2 w-7 h-7 bg-white text-red-500 rounded-full shadow-lg border border-red-100 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-red-50 hover:scale-110 z-10"
                                                            >
                                                                <Trash2 size={14} />
                                                            </button>
                                                        </div>
                                                    ))}
                                                    <button
                                                        type="button"
                                                        onClick={() => setIsPanelOpen(true)}
                                                        className="h-[120px] border-2 border-dashed border-gray-200 rounded-xl flex flex-col items-center justify-center text-gray-400 hover:text-blue-500 hover:border-blue-300 hover:bg-blue-50/50 transition-all duration-200"
                                                    >
                                                        <span className="text-2xl mb-1">+</span>
                                                        <span className="text-xs font-semibold">Añadir Sensor</span>
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}

                            </form>

                            <div className="p-5 border-t border-gray-100 bg-white flex-shrink-0">
                                {/* Info card (solo en creación) */}
                                {!editingProject && (
                                    <div className="bg-blue-50/60 border border-blue-100 rounded-xl p-3 flex items-start gap-3 mb-4">
                                        <Beaker size={18} className="text-blue-600 mt-0.5 flex-shrink-0" />
                                        <p className="text-xs text-blue-700 leading-relaxed">
                                            Una vez creado el proyecto, podrás asignarle sensores de pH y otros componentes 
                                            de monitoreo desde el panel de control del proyecto.
                                        </p>
                                    </div>
                                )}

                                <div className="flex gap-3">
                                    <button
                                        type="button"
                                        onClick={onClose}
                                        disabled={isSubmitting}
                                        className="flex-1 px-4 py-2.5 text-sm font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl border border-gray-200 transition-all duration-200 disabled:opacity-50"
                                    >
                                        Cancelar
                                    </button>
                                    <button
                                        type="submit"
                                        form="projectForm"
                                        disabled={isSubmitting}
                                        className="flex-1 px-4 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 rounded-xl shadow-md shadow-blue-500/25 hover:shadow-lg hover:shadow-blue-500/30 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                                </svg>
                                                Guardando...
                                            </>
                                        ) : (
                                            editingProject ? 'Guardar Cambios' : 'Crear Proyecto'
                                        )}
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
            <ComponentPanel
                isOpen={isPanelOpen}
                onClose={() => setIsPanelOpen(false)}
                onAddComponent={(comp) => {
                    handleAddSensor(comp);
                    setIsPanelOpen(false);
                }}
                allowedTypes={['ph']}
            />
        </>
    );
}
