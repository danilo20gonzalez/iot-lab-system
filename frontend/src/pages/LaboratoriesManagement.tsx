// components/LaboratoriesManagement.tsx
import { useState, useEffect } from 'react';
import { Plus, Search, Building2, Users, Thermometer, Droplets, Eye, Edit3, Trash2 } from 'lucide-react';
import Navbar from '../components/Navbar';
import LabCard from '../components/LabCard';
import LabModal from '../modals/LabModal';
import { useNavigate } from 'react-router-dom';

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

const getStatusColor = (status: string) => {
    switch (status) {
        case 'active': return 'bg-green-100 text-green-800 border-green-200';
        case 'maintenance': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
        case 'inactive': return 'bg-red-100 text-red-800 border-red-200';
        default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
};

const getStatusText = (status: string) => {
    switch (status) {
        case 'active': return 'Activo';
        case 'maintenance': return 'Mantenimiento';
        case 'inactive': return 'Inactivo';
        default: return 'Desconocido';
    }
};

export default function LaboratoriesManagement() {
    const navigate = useNavigate();
    const [laboratories, setLaboratories] = useState<Laboratory[]>([]);
    const [filteredLabs, setFilteredLabs] = useState<Laboratory[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'maintenance' | 'inactive'>('all');
    const [automationFilter, setAutomationFilter] = useState<'all' | 'on' | 'off'>('all');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingLab, setEditingLab] = useState<Laboratory | null>(null);
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

    // Datos de ejemplo basados en HU-06 a HU-09
    const initialLabs: Laboratory[] = [
        {
            id: 1,
            code: 'LAB-001',
            name: 'Laboratorio de Microbiología',
            description: 'Laboratorio especializado en análisis microbiológicos',
            temperature: 23.5,
            humidity: 45,
            status: 'active',
            associatedUsers: 8,
            createdAt: '2024-01-15',
            automationStatus: 'on',
            isZoneDisabled: false,
            activeSensors: 12,
            devices: 18
        },
        {
            id: 2,
            code: 'LAB-002',
            name: 'Laboratorio de Química Orgánica',
            description: 'Análisis y experimentos en química orgánica',
            temperature: 31.2,
            humidity: 62,
            status: 'maintenance',
            associatedUsers: 6,
            createdAt: '2024-01-20',
            automationStatus: 'off',
            isZoneDisabled: true,
            activeSensors: 8,
            devices: 15
        },
        {
            id: 3,
            code: 'LAB-003',
            name: 'Laboratorio de Biología Molecular',
            description: 'Investigación en biología molecular y genética',
            temperature: 25.1,
            humidity: 50,
            status: 'active',
            associatedUsers: 12,
            createdAt: '2024-02-01',
            automationStatus: 'on',
            isZoneDisabled: false,
            activeSensors: 20,
            devices: 25
        }
    ];

    useEffect(() => {
        // Simular carga desde API
        setLaboratories(initialLabs);
        setFilteredLabs(initialLabs);
    }, []);

    // Filtros (HU-09)
    useEffect(() => {
        let result = laboratories;

        if (searchTerm) {
            result = result.filter(lab =>
                lab.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                lab.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
                lab.description.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        if (statusFilter !== 'all') {
            result = result.filter(lab => lab.status === statusFilter);
        }

        if (automationFilter !== 'all') {
            result = result.filter(lab => lab.automationStatus === automationFilter);
        }

        setFilteredLabs(result);
    }, [laboratories, searchTerm, statusFilter, automationFilter]);

    // Crear laboratorio (HU-06)
    const handleCreateLab = (labData: Omit<Laboratory, 'id'>) => {
        const newLab: Laboratory = {
            id: Date.now(),
            ...labData
        };
        setLaboratories(prev => [...prev, newLab]);
        setIsModalOpen(false);
    };

    // Editar laboratorio (HU-07)
    const handleUpdateLab = (labData: Omit<Laboratory, 'id'>) => {
        if (!editingLab) return;

        const updatedLab: Laboratory = {
            ...editingLab,
            ...labData
        };
        setLaboratories(prev => prev.map(lab => lab.id === editingLab.id ? updatedLab : lab));
        setEditingLab(null);
        setIsModalOpen(false);
    };

    // Eliminar laboratorio (HU-08)
    const handleDeleteLab = (labId: number) => {
        if (window.confirm('¿Estás seguro de que quieres eliminar este laboratorio?')) {
            setLaboratories(prev => prev.filter(lab => lab.id !== labId));
        }
    };

    // Navegar a la página del laboratorio
    const handleViewLaboratory = (labId: number) => {
        navigate(`/laboratory/${labId}`);
    };

    const handleEditLab = (lab: Laboratory) => {
        setEditingLab(lab);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingLab(null);
    };

    const handleSaveLab = (labData: Omit<Laboratory, 'id'>) => {
        if (editingLab) {
            handleUpdateLab(labData);
        } else {
            handleCreateLab(labData);
        }
    };

    const stats = {
        total: laboratories.length,
        active: laboratories.filter(l => l.status === 'active').length,
        automated: laboratories.filter(l => l.automationStatus === 'on').length,
        totalSensors: laboratories.reduce((sum, lab) => sum + lab.activeSensors, 0),
        totalUsers: laboratories.reduce((sum, lab) => sum + lab.associatedUsers, 0)
    };

    const statCards = [
        { label: 'Total Laboratorios', value: stats.total, icon: Building2, bgClass: 'bg-blue-100', textClass: 'text-blue-600' },
        { label: 'Activos', value: stats.active, icon: Building2, bgClass: 'bg-green-100', textClass: 'text-green-600' },
        { label: 'Sensores Activos', value: stats.totalSensors, icon: Thermometer, bgClass: 'bg-purple-100', textClass: 'text-purple-600' },
        { label: 'Usuarios', value: stats.totalUsers, icon: Users, bgClass: 'bg-indigo-100', textClass: 'text-indigo-600' },
        { label: 'Automatizados', value: stats.automated, icon: Building2, bgClass: 'bg-emerald-100', textClass: 'text-emerald-600' },
    ];

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />

            <div >
                <div className="max-w-7xl mx-auto p-6">
                    {/* Header */}
                    <div className="mb-4">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                            <h1 className="text-3xl font-bold text-gray-900">Gestión de Laboratorios</h1>
                            <button
                                onClick={() => setIsModalOpen(true)}
                                className="flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold transition-colors duration-200 shadow-lg hover:shadow-xl"
                            >
                                <Plus size={20} />
                                Nuevo Laboratorio
                            </button>
                        </div>
                        <p className="text-gray-600">Administra los laboratorios y su configuración</p>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
                        {statCards.map((stat, idx) => (
                            <div key={idx} className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 flex items-center gap-3 hover:shadow-md transition-shadow">
                                <div className={`w-10 h-10 ${stat.bgClass} rounded-lg flex items-center justify-center shrink-0`}>
                                    <stat.icon className={stat.textClass} size={20} />
                                </div>
                                <div className="min-w-0">
                                    <p className="text-xs font-medium text-gray-500 truncate">{stat.label}</p>
                                    <p className="text-xl font-bold text-gray-900">{stat.value}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Controls */}
                    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 mb-6">
                        <div className="flex flex-col lg:flex-row gap-4 justify-between items-start lg:items-center">
                            {/* Search */}
                            <div className="relative flex-1 w-full lg:max-w-md">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                                <input
                                    type="text"
                                    placeholder="Buscar laboratorios por código, nombre o descripción..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                                />
                            </div>

                            {/* Filters and View Controls */}
                            <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
                                <div className="flex gap-2">
                                    <select
                                        value={statusFilter}
                                        onChange={(e) => setStatusFilter(e.target.value as any)}
                                        className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                                    >
                                        <option value="all">Todos los estados</option>
                                        <option value="active">Activo</option>
                                        <option value="maintenance">Mantenimiento</option>
                                        <option value="inactive">Inactivo</option>
                                    </select>

                                    <select
                                        value={automationFilter}
                                        onChange={(e) => setAutomationFilter(e.target.value as any)}
                                        className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                                    >
                                        <option value="all">Toda automatización</option>
                                        <option value="on">Automatizado</option>
                                        <option value="off">Manual</option>
                                    </select>
                                </div>

                                <div className="flex gap-2">
                                    <button
                                        onClick={() => setViewMode('grid')}
                                        className={`p-3 border rounded-lg transition-all duration-200 ${viewMode === 'grid'
                                            ? 'bg-emerald-100 border-emerald-300 text-emerald-700'
                                            : 'bg-gray-100 border-gray-300 text-gray-600 hover:bg-gray-200'
                                            }`}
                                    >
                                        Grid
                                    </button>
                                    <button
                                        onClick={() => setViewMode('list')}
                                        className={`p-3 border rounded-lg transition-all duration-200 ${viewMode === 'list'
                                            ? 'bg-emerald-100 border-emerald-300 text-emerald-700'
                                            : 'bg-gray-100 border-gray-300 text-gray-600 hover:bg-gray-200'
                                            }`}
                                    >
                                        Lista
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Laboratories Grid/List */}
                    {viewMode === 'grid' ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                            {filteredLabs.map(lab => (
                                <LabCard
                                    key={lab.id}
                                    id={lab.id}
                                    code={lab.code}
                                    name={lab.name}
                                    temperature={lab.temperature}
                                    humidity={lab.humidity}
                                    activeSensors={lab.activeSensors}
                                    associatedUsers={lab.associatedUsers}
                                    status={lab.status === 'active' ? 'activo' : lab.status === 'maintenance' ? 'mantenimiento' : 'mantenimiento'}
                                    automationStatus={lab.automationStatus}
                                    isZoneDisabled={lab.isZoneDisabled}
                                    onEdit={() => handleEditLab(lab)}
                                    onDelete={() => handleDeleteLab(lab.id)}
                                    onView={() => handleViewLaboratory(lab.id)}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                            <table className="w-full">
                                <thead className="bg-gray-50 border-b border-gray-200">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Laboratorio</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Estado</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Métricas</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Usuarios</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Automatización</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {filteredLabs.map(lab => (
                                        <LabTableRow
                                            key={lab.id}
                                            lab={lab}
                                            onEdit={handleEditLab}
                                            onDelete={handleDeleteLab}
                                            onView={handleViewLaboratory}
                                        />
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {/* Empty State */}
                    {filteredLabs.length === 0 && (
                        <div className="text-center py-12 bg-white rounded-xl border-2 border-dashed border-gray-300">
                            <Building2 size={48} className="mx-auto text-gray-400 mb-4" />
                            <h3 className="text-lg font-medium text-gray-900 mb-2">No se encontraron laboratorios</h3>
                            <p className="text-gray-500 mb-4">Intenta ajustar los filtros de búsqueda o crear un nuevo laboratorio</p>
                            <button
                                onClick={() => {
                                    setSearchTerm('');
                                    setStatusFilter('all');
                                    setAutomationFilter('all');
                                }}
                                className="text-emerald-600 hover:text-emerald-700 font-medium mr-4"
                            >
                                Limpiar filtros
                            </button>
                            <button
                                onClick={() => setIsModalOpen(true)}
                                className="text-emerald-600 hover:text-emerald-700 font-medium"
                            >
                                Crear primer laboratorio
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Modal para crear/editar laboratorio */}
            <LabModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                onSave={handleSaveLab}
                lab={editingLab}
            />
        </div>
    );
}

// Componente Fila para vista lista (inline, específico de esta página)
function LabTableRow({ lab, onEdit, onDelete, onView }: {
    lab: Laboratory;
    onEdit: (lab: Laboratory) => void;
    onDelete: (id: number) => void;
    onView: (labId: number) => void;
}) {
    const navigate = useNavigate();

    return (
        <tr className="hover:bg-gray-50 transition-colors duration-200">
            <td
                className="px-6 py-4 cursor-pointer"
                onClick={() => navigate('/laboratory')}
            >
                <div>
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                            <Building2 size={18} className="text-emerald-600" />
                        </div>
                        <div>
                            <h4 className="font-semibold text-gray-900 hover:text-emerald-600 transition-colors">
                                {lab.name}
                            </h4>
                            <p className="text-sm text-gray-500">{lab.code}</p>
                        </div>
                    </div>
                </div>
            </td>
            <td className="px-6 py-4">
                <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(lab.status)}`}>
                    {getStatusText(lab.status)}
                </span>
            </td>
            <td className="px-6 py-4">
                <div className="flex gap-4 text-sm">
                    <div className="flex items-center gap-1">
                        <Thermometer size={14} className="text-red-500" />
                        <span className="font-medium">{lab.temperature}°C</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <Droplets size={14} className="text-blue-500" />
                        <span className="font-medium">{lab.humidity}%</span>
                    </div>
                </div>
            </td>
            <td className="px-6 py-4">
                <div className="flex items-center gap-2">
                    <Users size={16} className="text-gray-400" />
                    <span className="font-medium">{lab.associatedUsers}</span>
                    <span className="text-sm text-gray-500">usuarios</span>
                </div>
            </td>
            <td className="px-6 py-4">
                <div className={`px-3 py-1 rounded-full text-xs font-medium ${lab.automationStatus === 'on'
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-gray-100 text-gray-800'
                    }`}>
                    {lab.automationStatus === 'on' ? 'Automático' : 'Manual'}
                </div>
            </td>
            <td className="px-6 py-4">
                <div className="flex gap-2">
                    <button
                        onClick={() => onView(lab.id)}
                        className="p-2 text-emerald-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors duration-200"
                        title="Ver detalles del laboratorio"
                    >
                        <Eye size={16} />
                    </button>
                    <button
                        onClick={() => onEdit(lab)}
                        className="p-2 text-blue-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200"
                        title="Editar"
                    >
                        <Edit3 size={16} />
                    </button>
                    <button
                        onClick={() => onDelete(lab.id)}
                        className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
                        title="Eliminar"
                    >
                        <Trash2 size={16} />
                    </button>
                </div>
            </td>
        </tr>
    );
}