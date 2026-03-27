import { useState, useEffect } from 'react';
import { X, Building2 } from 'lucide-react';

interface Laboratory {
    id: number;
    code: string;
    name: string;
    description: string;
    temperature: number;
    humidity: number;
    status: 'active' | 'maintenance' | 'inactive';
    associatedUsers: number;
    createdAt: string;
    automationStatus: 'on' | 'off';
    isZoneDisabled: boolean;
    activeSensors: number;
    devices: number;
}

interface LabModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (labData: Omit<Laboratory, 'id'>) => void;
    lab?: Laboratory | null;
}

export default function LabModal({ isOpen, onClose, onSave, lab }: LabModalProps) {
    const initialState = {
        code: '',
        name: '',
        description: '',
        status: 'active' as const,
        automationStatus: 'off' as const,
    };

    const [formData, setFormData] = useState<{
        code: string;
        name: string;
        description: string;
        status: 'active' | 'maintenance' | 'inactive';
        automationStatus: 'on' | 'off';
    }>(initialState);

    useEffect(() => {
        if (lab) {
            setFormData({
                code: lab.code,
                name: lab.name,
                description: lab.description,
                status: lab.status,
                automationStatus: lab.automationStatus,
            });
        } else {
            setFormData(initialState);
        }
    }, [lab, isOpen]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({
            code: formData.code,
            name: formData.name,
            description: formData.description,
            status: formData.status,
            automationStatus: formData.automationStatus,
            temperature: lab?.temperature ?? 22,
            humidity: lab?.humidity ?? 45,
            associatedUsers: lab?.associatedUsers ?? 0,
            createdAt: lab?.createdAt ?? new Date().toISOString().split('T')[0],
            isZoneDisabled: lab?.isZoneDisabled ?? false,
            activeSensors: lab?.activeSensors ?? 0,
            devices: lab?.devices ?? 0,
        });
        setFormData(initialState);
    };

    const handleChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center">
            {/* Overlay */}
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-[fadeIn_0.2s_ease-out]"
                onClick={onClose}
            ></div>

            {/* Modal Card */}
            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-4 overflow-hidden animate-[scaleIn_0.25s_ease-out]">
                {/* Línea decorativa superior */}
                <div className="h-1 bg-gradient-to-r from-emerald-500 via-green-500 to-emerald-500"></div>

                {/* Header */}
                <div className="flex justify-between items-center p-6 border-b border-gray-100">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/25">
                            <Building2 size={20} className="text-white" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-gray-900">
                                {lab ? 'Editar Laboratorio' : 'Nuevo Laboratorio'}
                            </h2>
                            <p className="text-xs text-gray-500">
                                {lab ? 'Modifica los datos del laboratorio' : 'Completa los datos para registrar un nuevo laboratorio'}
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-all duration-200"
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    {/* Código */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Código</label>
                        <input
                            type="text"
                            value={formData.code}
                            onChange={(e) => handleChange('code', e.target.value)}
                            placeholder="Ej: LAB-004"
                            className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
                            required
                        />
                    </div>

                    {/* Nombre */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Nombre del Laboratorio</label>
                        <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => handleChange('name', e.target.value)}
                            placeholder="Ej: Laboratorio de Física"
                            className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
                            required
                        />
                    </div>

                    {/* Descripción */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Descripción</label>
                        <textarea
                            value={formData.description}
                            onChange={(e) => handleChange('description', e.target.value)}
                            placeholder="Describe brevemente el propósito del laboratorio..."
                            rows={3}
                            className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all resize-none"
                            required
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        {/* Estado */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Estado</label>
                            <select
                                value={formData.status}
                                onChange={(e) => handleChange('status', e.target.value)}
                                className="w-full p-3 border border-gray-300 rounded-xl bg-white outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                            >
                                <option value="active">Activo</option>
                                <option value="maintenance">Mantenimiento</option>
                                <option value="inactive">Inactivo</option>
                            </select>
                        </div>

                        {/* Automatización */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Automatización</label>
                            <select
                                value={formData.automationStatus}
                                onChange={(e) => handleChange('automationStatus', e.target.value)}
                                className="w-full p-3 border border-gray-300 rounded-xl bg-white outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                            >
                                <option value="off">Manual</option>
                                <option value="on">Automático</option>
                            </select>
                        </div>
                    </div>

                    {/* Botones */}
                    <div className="flex gap-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-2.5 text-sm font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl border border-gray-200 transition-all duration-200"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className="flex-1 px-4 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 rounded-xl shadow-md shadow-emerald-500/25 hover:shadow-lg hover:shadow-emerald-500/30 transition-all duration-200"
                        >
                            {lab ? 'Guardar Cambios' : 'Crear Laboratorio'}
                        </button>
                    </div>
                </form>
            </div>

            {/* Animaciones CSS */}
            <style>{`
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                @keyframes scaleIn {
                    from { opacity: 0; transform: scale(0.9) translateY(10px); }
                    to { opacity: 1; transform: scale(1) translateY(0); }
                }
            `}</style>
        </div>
    );
}
