import { X, Building2, FileText, Thermometer, Droplets, Users, Calendar } from 'lucide-react';
import { useState, useEffect } from 'react';

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
  editingLab?: Laboratory | null;
}

export default function LabModal({ isOpen, onClose, onSave, editingLab }: LabModalProps) {
  const [formData, setFormData] = useState({
    code: '',
    name: '',
    description: '',
    temperature: 25,
    humidity: 50,
    status: 'active' as 'active' | 'maintenance' | 'inactive',
    associatedUsers: 0,
    createdAt: new Date().toISOString().split('T')[0],
    automationStatus: 'off' as 'on' | 'off',
    isZoneDisabled: false,
    activeSensors: 0,
    devices: 0
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (editingLab) {
      setFormData({
        code: editingLab.code,
        name: editingLab.name,
        description: editingLab.description,
        temperature: editingLab.temperature,
        humidity: editingLab.humidity,
        status: editingLab.status,
        associatedUsers: editingLab.associatedUsers,
        createdAt: editingLab.createdAt,
        automationStatus: editingLab.automationStatus,
        isZoneDisabled: editingLab.isZoneDisabled,
        activeSensors: editingLab.activeSensors,
        devices: editingLab.devices
      });
    } else {
      setFormData({
        code: '',
        name: '',
        description: '',
        temperature: 25,
        humidity: 50,
        status: 'active',
        associatedUsers: 0,
        createdAt: new Date().toISOString().split('T')[0],
        automationStatus: 'off',
        isZoneDisabled: false,
        activeSensors: 0,
        devices: 0
      });
    }
    setErrors({});
  }, [editingLab, isOpen]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.code.trim()) {
      newErrors.code = 'El código es obligatorio';
    }
    if (!formData.name.trim()) {
      newErrors.name = 'El nombre es obligatorio';
    }
    if (!formData.description.trim()) {
      newErrors.description = 'La descripción es obligatoria';
    }
    if (formData.temperature < -50 || formData.temperature > 100) {
      newErrors.temperature = 'La temperatura debe estar entre -50°C y 100°C';
    }
    if (formData.humidity < 0 || formData.humidity > 100) {
      newErrors.humidity = 'La humedad debe estar entre 0% y 100%';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      onSave(formData);
      handleClose();
    }
  };

  const handleClose = () => {
    setFormData({
      code: '',
      name: '',
      description: '',
      temperature: 25,
      humidity: 50,
      status: 'active',
      associatedUsers: 0,
      createdAt: new Date().toISOString().split('T')[0],
      automationStatus: 'off',
      isZoneDisabled: false,
      activeSensors: 0,
      devices: 0
    });
    setErrors({});
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay con opacidad */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-start justify-center pt-11 p-4 overflow-y-auto ">
        <div 
          className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl my-8 transform transition-all duration-300"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center rounded-2xl justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-emerald-50 to-green-50">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-emerald-600 rounded-xl flex items-center justify-center">
                <Building2 size={24} className="text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {editingLab ? 'Editar Laboratorio' : 'Crear Nuevo Laboratorio'}
                </h2>
                <p className="text-sm text-gray-600">
                  {editingLab ? 'Modifica la información del laboratorio' : 'Completa los datos para crear un nuevo laboratorio'}
                </p>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
            >
              <X size={24} className="text-gray-500" />
            </button>
          </div>

          {/* Form */}
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Código del Laboratorio */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                  <Building2 size={16} className="text-emerald-600" />
                  Código del Laboratorio *
                </label>
                <input
                  type="text"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                  placeholder="Ej: LAB-001"
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all duration-200 ${
                    errors.code 
                      ? 'border-red-300 focus:ring-red-500' 
                      : 'border-gray-300 focus:ring-emerald-500'
                  }`}
                />
                {errors.code && (
                  <p className="text-red-500 text-xs mt-1">{errors.code}</p>
                )}
              </div>

              {/* Nombre */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                  <FileText size={16} className="text-emerald-600" />
                  Nombre del Laboratorio *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Ej: Laboratorio de Microbiología"
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all duration-200 ${
                    errors.name 
                      ? 'border-red-300 focus:ring-red-500' 
                      : 'border-gray-300 focus:ring-emerald-500'
                  }`}
                />
                {errors.name && (
                  <p className="text-red-500 text-xs mt-1">{errors.name}</p>
                )}
              </div>

              {/* Descripción */}
              <div className="md:col-span-2">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                  <FileText size={16} className="text-emerald-600" />
                  Descripción *
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe el propósito y características del laboratorio"
                  rows={3}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all duration-200 resize-none ${
                    errors.description 
                      ? 'border-red-300 focus:ring-red-500' 
                      : 'border-gray-300 focus:ring-emerald-500'
                  }`}
                />
                {errors.description && (
                  <p className="text-red-500 text-xs mt-1">{errors.description}</p>
                )}
              </div>

              {/* Temperatura */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                  <Thermometer size={16} className="text-red-500" />
                  Temperatura Objetivo (°C) *
                </label>
                <input
                  type="number"
                  value={formData.temperature}
                  onChange={(e) => setFormData({ ...formData, temperature: parseFloat(e.target.value) })}
                  step="0.1"
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all duration-200 ${
                    errors.temperature 
                      ? 'border-red-300 focus:ring-red-500' 
                      : 'border-gray-300 focus:ring-emerald-500'
                  }`}
                />
                {errors.temperature && (
                  <p className="text-red-500 text-xs mt-1">{errors.temperature}</p>
                )}
              </div>

              {/* Humedad */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                  <Droplets size={16} className="text-blue-500" />
                  Humedad Objetivo (%) *
                </label>
                <input
                  type="number"
                  value={formData.humidity}
                  onChange={(e) => setFormData({ ...formData, humidity: parseFloat(e.target.value) })}
                  step="1"
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all duration-200 ${
                    errors.humidity 
                      ? 'border-red-300 focus:ring-red-500' 
                      : 'border-gray-300 focus:ring-emerald-500'
                  }`}
                />
                {errors.humidity && (
                  <p className="text-red-500 text-xs mt-1">{errors.humidity}</p>
                )}
              </div>

              {/* Estado */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                  Estado del Laboratorio *
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all duration-200"
                >
                  <option value="active">Activo</option>
                  <option value="maintenance">Mantenimiento</option>
                  <option value="inactive">Inactivo</option>
                </select>
              </div>

              {/* Automatización */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                  Estado de Automatización *
                </label>
                <select
                  value={formData.automationStatus}
                  onChange={(e) => setFormData({ ...formData, automationStatus: e.target.value as any })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all duration-200"
                >
                  <option value="on">Automatizado</option>
                  <option value="off">Manual</option>
                </select>
              </div>

              {/* Usuarios Asociados */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                  <Users size={16} className="text-indigo-600" />
                  Usuarios Asociados
                </label>
                <input
                  type="number"
                  value={formData.associatedUsers}
                  onChange={(e) => setFormData({ ...formData, associatedUsers: parseInt(e.target.value) || 0 })}
                  min="0"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all duration-200"
                />
              </div>

              {/* Sensores Activos */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                  <Thermometer size={16} className="text-purple-600" />
                  Sensores Activos
                </label>
                <input
                  type="number"
                  value={formData.activeSensors}
                  onChange={(e) => setFormData({ ...formData, activeSensors: parseInt(e.target.value) || 0 })}
                  min="0"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all duration-200"
                />
              </div>

              {/* Dispositivos */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                  Número de Dispositivos
                </label>
                <input
                  type="number"
                  value={formData.devices}
                  onChange={(e) => setFormData({ ...formData, devices: parseInt(e.target.value) || 0 })}
                  min="0"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all duration-200"
                />
              </div>

              {/* Fecha de Creación */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                  <Calendar size={16} className="text-gray-600" />
                  Fecha de Creación
                </label>
                <input
                  type="date"
                  value={formData.createdAt}
                  onChange={(e) => setFormData({ ...formData, createdAt: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all duration-200"
                />
              </div>

              {/* Zona Deshabilitada */}
              <div className="md:col-span-2">
                <label className="flex items-center gap-3 cursor-pointer p-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200">
                  <input
                    type="checkbox"
                    checked={formData.isZoneDisabled}
                    onChange={(e) => setFormData({ ...formData, isZoneDisabled: e.target.checked })}
                    className="w-5 h-5 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500"
                  />
                  <div>
                    <span className="text-sm font-medium text-gray-700">Zona Deshabilitada</span>
                    <p className="text-xs text-gray-500">Marca esta opción si el laboratorio está temporalmente fuera de servicio</p>
                  </div>
                </label>
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-gray-200">
              <button
                onClick={handleClose}
                className="px-6 py-3 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors duration-200"
              >
                Cancelar
              </button>
              <button
                onClick={handleSubmit}
                className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium shadow-lg hover:shadow-xl transition-all duration-200"
              >
                {editingLab ? 'Guardar Cambios' : 'Crear Laboratorio'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}