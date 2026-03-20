import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import type { User, UserRole, UserStatus } from '../types/index';
import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:4000/api'
  });

interface UserModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (userData: Omit<User, 'id' | 'createdAt'>) => void;
    user?: User | null;
}

export default function UserModal({ isOpen, onClose, user }: UserModalProps) {
    const [formData, setFormData] = useState({
        name: '',
        username: '',
        password: '',
        email: '',
        role: 'user' as UserRole,
        status: 'active' as UserStatus
    });

    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name,
                username: user.username,
                password: user.password,
                email: user.email,
                role: user.role,
                status: user.status,
            });
        } else {
            setFormData({
                name: '',
                username: '',
                password: '',
                email: '',
                role: 'user',
                status: 'active'
            });
        }
    }, [user, isOpen]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await api.post('/userCreate', {
                name: formData.name,
                username: formData.username,
                password: formData.password,
                email: formData.email,
                fk_id_rol: formData.role,
                status: formData.status === 'active' ? 1 : 0
            });

            console.log('Usuario creado correctamente:', response.data);
            onClose();
        } catch (error) {
            if (axios.isAxiosError(error)) {
                console.error('Error al crear usuario:', error.response?.data);
            } else {
                console.error('Error al crear usuario:', error);
            }
        }
    };

    const handleChange = (field: string, value: string) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">
                {/* Header */}
                <div className="flex justify-between items-center p-6 border-b border-gray-200">
                    <h2 className="text-xl font-bold text-gray-900">
                        {user ? 'Editar Usuario' : 'Crear Usuario'}
                    </h2>
                    <button
                        onClick={onClose}
                        className="w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-lg flex items-center justify-center transition-colors duration-200"
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Nombre Completo
                        </label>
                        <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => handleChange('name', e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            placeholder="Ingresa el nombre completo"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Usuario
                        </label>
                        <input
                            type="text"
                            value={formData.username}
                            onChange={(e) => handleChange('username', e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            placeholder="Ingresa el usuario"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Contraseña
                        </label>
                        <input
                            type="password"
                            value={formData.password}
                            onChange={(e) => handleChange('password', e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            placeholder="Ingresa la contraseña"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Email
                        </label>
                        <input
                            type="email"
                            value={formData.email}
                            onChange={(e) => handleChange('email', e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            placeholder="usuario@ejemplo.com"
                            required
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Rol
                            </label>
                            <select
                                value={formData.role}
                                onChange={(e) => handleChange('role', e.target.value as UserRole)}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            >
                                <option value="1">Administrador</option>
                                <option value="2">Operador</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Estado
                            </label>
                            <select
                                value={formData.status}
                                onChange={(e) => handleChange('status', e.target.value as UserStatus)}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            >
                                <option value="active">Activo</option>
                                <option value="inactive">Inactivo</option>
                            </select>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors duration-200"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className="flex-1 px-4 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors duration-200"
                        >
                            {user ? 'Actualizar' : 'Crear'} Usuario
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}