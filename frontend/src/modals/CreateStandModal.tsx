import { useState } from 'react';
import { X, LayoutGrid, Beaker, Tag, FileText, Activity } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../api/api';

interface CreateStandModalProps {
    isOpen: boolean;
    onClose: () => void;
    onCreated?: () => void;
}

export default function CreateStandModal({ isOpen, onClose, onCreated }: CreateStandModalProps) {
    const [formData, setFormData] = useState({
        nombre: '',
        descripcion: '',
        estadoId: '1',
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;

        setIsSubmitting(true);
        try {
            // TODO: Ajustar endpoint cuando exista la ruta de stands en el backend
            await api.post('/createStand', {
                nombre: formData.nombre.trim(),
                descripcion: formData.descripcion.trim(),
                estadoId: Number(formData.estadoId),
            });

            setFormData({ nombre: '', descripcion: '', estadoId: '1' });
            setErrors({});
            onCreated?.();
            onClose();
        } catch (error: any) {
            const msg = error.response?.data?.message || 'Error al crear el stand';
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
        <AnimatePresence>
            {isOpen && (
                <div
                    className="fixed inset-0 z-[100] flex items-center justify-center"
                    onClick={handleOverlayClick}
                >
                    {/* Overlay */}
                    <motion.div
                        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                    />

                    {/* Modal Card */}
                    <motion.div
                        className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 max-h-[90vh] overflow-hidden flex flex-col"
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        transition={{ duration: 0.25, ease: 'easeOut' }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Línea decorativa superior con gradiente azul */}
                        <div className="h-1 bg-gradient-to-r from-blue-500 via-cyan-400 to-blue-600" />

                        {/* Header */}
                        <div className="flex justify-between items-center px-5 py-3">
                            <div className="flex items-center gap-2.5">
                                <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-lg flex items-center justify-center shadow-md shadow-blue-500/25">
                                    <LayoutGrid size={18} className="text-white" />
                                </div>
                                <div>
                                    <h2 className="text-base font-bold text-gray-900">
                                        Nuevo Stand
                                    </h2>
                                    <p className="text-[11px] text-gray-500">
                                        Registra un nuevo stand en el módulo
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

                        {/* Divider sutil */}
                        <div className="mx-5 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />

                        {/* Form */}
                        <form onSubmit={handleSubmit} className="px-5 py-4 space-y-3 overflow-y-auto">
                            {/* Nombre del Stand */}
                            <div>
                                <label className="flex items-center gap-1.5 text-xs font-semibold text-gray-700 mb-1">
                                    <Tag size={12} className="text-blue-600" />
                                    Nombre del Stand
                                </label>
                                <input
                                    type="text"
                                    value={formData.nombre}
                                    onChange={(e) => handleChange('nombre', e.target.value)}
                                    placeholder="Ej: Stand A-1"
                                    className={`w-full px-3 py-2 text-sm border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200 bg-gray-50 hover:bg-white focus:bg-white ${errors.nombre ? 'border-red-400 ring-1 ring-red-400' : 'border-gray-300'
                                        }`}
                                />
                                {errors.nombre && (
                                    <motion.p
                                        initial={{ opacity: 0, y: -5 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="text-red-500 text-xs mt-1.5 flex items-center gap-1"
                                    >
                                        <span>⚠</span> {errors.nombre}
                                    </motion.p>
                                )}
                            </div>

                            {/* Descripción */}
                            <div>
                                <label className="flex items-center gap-1.5 text-xs font-semibold text-gray-700 mb-1">
                                    <FileText size={12} className="text-blue-600" />
                                    Descripción
                                </label>
                                <textarea
                                    value={formData.descripcion}
                                    onChange={(e) => handleChange('descripcion', e.target.value)}
                                    placeholder="Describe brevemente el propósito del stand..."
                                    rows={2}
                                    className={`w-full px-3 py-2 text-sm border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200 resize-none bg-gray-50 hover:bg-white focus:bg-white ${errors.descripcion ? 'border-red-400 ring-1 ring-red-400' : 'border-gray-300'
                                        }`}
                                />
                                <div className="flex justify-between items-center mt-1">
                                    {errors.descripcion ? (
                                        <motion.p
                                            initial={{ opacity: 0, y: -5 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="text-red-500 text-xs flex items-center gap-1"
                                        >
                                            <span>⚠</span> {errors.descripcion}
                                        </motion.p>
                                    ) : <span />}
                                    <span className={`text-xs ${formData.descripcion.length > 450 ? 'text-amber-500' : 'text-gray-400'}`}>
                                        {formData.descripcion.length}/500
                                    </span>
                                </div>
                            </div>

                            {/* Estado */}
                            <div>
                                <label className="flex items-center gap-1.5 text-xs font-semibold text-gray-700 mb-1">
                                    <Activity size={12} className="text-blue-600" />
                                    Estado Inicial
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
                                            className={`relative p-2 rounded-lg border-2 transition-all duration-200 text-center ${formData.estadoId === option.value
                                                ? option.color === 'blue'
                                                    ? 'border-blue-500 bg-blue-50 shadow-md shadow-blue-500/10'
                                                    : option.color === 'amber'
                                                        ? 'border-amber-500 bg-amber-50 shadow-md shadow-amber-500/10'
                                                        : 'border-red-500 bg-red-50 shadow-md shadow-red-500/10'
                                                : 'border-gray-200 bg-gray-50 hover:border-gray-300 hover:bg-white'
                                                }`}
                                        >
                                            <span className="text-sm block">{option.icon}</span>
                                            <span className={`text-[11px] font-semibold ${formData.estadoId === option.value ? 'text-gray-800' : 'text-gray-500'
                                                }`}>
                                                {option.label}
                                            </span>
                                            {formData.estadoId === option.value && (
                                                <motion.div
                                                    layoutId="standEstadoIndicator"
                                                    className="absolute -top-1 -right-1 w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center"
                                                    initial={{ scale: 0 }}
                                                    animate={{ scale: 1 }}
                                                    transition={{ type: 'spring', stiffness: 300 }}
                                                >
                                                    <span className="text-white text-[8px]">✓</span>
                                                </motion.div>
                                            )}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Info card */}
                            <div className="bg-blue-50/60 border border-blue-100 rounded-xl p-3 flex items-start gap-3">
                                <Beaker size={18} className="text-blue-600 mt-0.5 flex-shrink-0" />
                                <p className="text-xs text-blue-700 leading-relaxed">
                                    Una vez creado el stand, podrás asignarle estanterías, sensores y
                                    configurar los parámetros de monitoreo desde el panel de control.
                                </p>
                            </div>

                            {/* Botones */}
                            <div className="flex gap-3 pt-1">
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
                                    className="flex-1 px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 rounded-xl shadow-md shadow-blue-500/25 hover:shadow-lg hover:shadow-blue-500/30 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                            </svg>
                                            Creando...
                                        </>
                                    ) : (
                                        'Crear Stand'
                                    )}
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
