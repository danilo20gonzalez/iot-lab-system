// Dashboard.tsx
import { useState, useEffect } from "react";
import { 
  Activity, 
  Users, 
  Building2, 
  Thermometer, 
  Droplets, 
  Camera, 
  AlertTriangle, 
  CheckCircle, 
  Clock,
  BarChart3,
  Settings,
  Shield,
  Cpu,
  Zap,
  Eye
} from 'lucide-react';
import Navbar from "../components/Navbar";
import SummaryCard from "../components/SummaryCard";
import AlertsPanel from "../components/AlertsPanel";
import Footer from "../components/Footer";
import { useNavigate } from 'react-router-dom';

interface Alert {
  id: number;
  message: string;
  time: string;
  type: "warning" | "success" | "info";
  priority: "high" | "medium" | "low";
}

interface SystemStats {
  totalLabs: number;
  activeLabs: number;
  totalUsers: number;
  activeSensors: number;
  totalDevices: number;
  automationEnabled: number;
  systemUptime: string;
  dataAccuracy: number;
}

interface RecentActivity {
  id: number;
  type: 'sensor' | 'user' | 'system' | 'alert';
  message: string;
  time: string;
  lab?: string;
}

export default function Dashboard() {
  const navigate = useNavigate();
  const [systemStats, setSystemStats] = useState<SystemStats>({
    totalLabs: 0,
    activeLabs: 0,
    totalUsers: 0,
    activeSensors: 0,
    totalDevices: 0,
    automationEnabled: 0,
    systemUptime: '99.9%',
    dataAccuracy: 98.5
  });

  const [alerts, setAlerts] = useState<Alert[]>([
    { 
      id: 1, 
      message: "Temperatura crítica en Lab Química Orgánica", 
      time: "hace 5 min", 
      type: "warning",
      priority: "high"
    },
    { 
      id: 2, 
      message: "Sistema de ventilación en mantenimiento programado", 
      time: "hace 1 hora", 
      type: "info",
      priority: "medium"
    },
    { 
      id: 3, 
      message: "Calibración automática completada exitosamente", 
      time: "hace 2 horas", 
      type: "success",
      priority: "low"
    },
    { 
      id: 4, 
      message: "Nuevo usuario registrado en el sistema", 
      time: "hace 3 horas", 
      type: "info",
      priority: "low"
    },
  ]);

  const [recentActivities, setRecentActivities] = useState<RecentActivity[]>([
    {
      id: 1,
      type: 'sensor',
      message: 'Sensor de humedad calibrado automáticamente',
      time: 'hace 5 min',
      lab: 'LAB-002'
    },
    {
      id: 2,
      type: 'user',
      message: 'Usuario María García accedió al sistema',
      time: 'hace 15 min',
      lab: 'LAB-001'
    },
    {
      id: 3,
      type: 'system',
      message: 'Backup de base de datos completado',
      time: 'hace 1 hora'
    },
    {
      id: 4,
      type: 'alert',
      message: 'Alerta de temperatura resuelta',
      time: 'hace 2 horas',
      lab: 'LAB-002'
    }
  ]);

  // Simular carga de datos del sistema
  useEffect(() => {
    const fetchSystemData = async () => {
      // En una implementación real, estos vendrían de APIs
      setTimeout(() => {
        setSystemStats({
          totalLabs: 8,
          activeLabs: 6,
          totalUsers: 24,
          activeSensors: 156,
          totalDevices: 89,
          automationEnabled: 5,
          systemUptime: '99.9%',
          dataAccuracy: 98.5
        });
      }, 1000);
    };

    fetchSystemData();
  }, []);

  const quickActions = [
    {
      icon: Building2,
      label: "Gestión de Laboratorios",
      description: "Administrar laboratorios y configuraciones",
      action: () => navigate('/laboratories-management'),
      color: "bg-blue-500"
    },
    {
      icon: Users,
      label: "Gestión de Usuarios",
      description: "Administrar usuarios y permisos",
      action: () => navigate('/users'),
      color: "bg-green-500"
    },
    {
      icon: BarChart3,
      label: "Reportes y Análisis",
      description: "Ver reportes y estadísticas detalladas",
      action: () => navigate('/reports'),
      color: "bg-purple-500"
    },
    {
      icon: Settings,
      label: "Configuración del Sistema",
      description: "Configurar parámetros del sistema",
      action: () => navigate('/settings'),
      color: "bg-gray-500"
    },
    {
      icon: Cpu,
      label: "Monitoreo en Tiempo Real",
      description: "Ver datos de sensores en vivo",
      action: () => navigate('/monitoring'),
      color: "bg-orange-500"
    },
    {
      icon: Camera,
      label: "Cámaras de Seguridad",
      description: "Monitoreo visual de laboratorios",
      action: () => navigate('/cameras'),
      color: "bg-red-500"
    }
  ];

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'sensor': return <Thermometer size={16} className="text-blue-500" />;
      case 'user': return <Users size={16} className="text-green-500" />;
      case 'system': return <Cpu size={16} className="text-purple-500" />;
      case 'alert': return <AlertTriangle size={16} className="text-orange-500" />;
      default: return <Activity size={16} className="text-gray-500" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="pt-16">
        <div className="max-w-7xl mx-auto p-6">
          {/* Header del Dashboard */}
          <div className="mb-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Panel de Control General</h1>
                <p className="text-gray-600">
                  Resumen del sistema de gestión de laboratorios - Monitoreo en tiempo real
                </p>
              </div>
              <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg border border-gray-200">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-gray-700">Sistema Operativo</span>
              </div>
            </div>
          </div>

          {/* Estadísticas Principales del Sistema */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4 mb-8">
            <SummaryCard 
              title="Laboratorios" 
              value={systemStats.totalLabs} 
              subtitle={`${systemStats.activeLabs} activos`}
              icon={Building2}
              trend="up"
            />
            <SummaryCard 
              title="Usuarios" 
              value={systemStats.totalUsers} 
              subtitle="activos"
              icon={Users}
              trend="stable"
            />
            <SummaryCard 
              title="Sensores" 
              value={systemStats.activeSensors} 
              subtitle="monitoreando"
              icon={Thermometer}
              trend="up"
            />
            <SummaryCard 
              title="Dispositivos" 
              value={systemStats.totalDevices} 
              subtitle="conectados"
              icon={Cpu}
              trend="stable"
            />
            <SummaryCard 
              title="Automatización" 
              value={systemStats.automationEnabled} 
              subtitle="laboratorios"
              icon={Zap}
              trend="up"
            />
            <SummaryCard 
              title="Disponibilidad" 
              value={systemStats.systemUptime} 
              subtitle="uptime"
              icon={CheckCircle}
              trend="stable"
            />
            <SummaryCard 
              title="Precisión" 
              value={`${systemStats.dataAccuracy}%`} 
              subtitle="de datos"
              icon={Shield}
              trend="up"
            />
            <SummaryCard 
              title="Alertas" 
              value={alerts.length} 
              subtitle="activas"
              icon={AlertTriangle}
              trend="down"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Acciones Rápidas */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Acciones Rápidas</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {quickActions.map((action, index) => (
                    <button
                      key={index}
                      onClick={action.action}
                      className="flex flex-col items-center p-4 bg-gray-50 hover:bg-gray-100 rounded-lg border border-gray-200 transition-all duration-200 hover:shadow-md group"
                    >
                      <div className={`w-12 h-12 ${action.color} rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-200`}>
                        <action.icon size={24} className="text-white" />
                      </div>
                      <h3 className="font-semibold text-gray-900 text-sm text-center mb-1">
                        {action.label}
                      </h3>
                      <p className="text-gray-500 text-xs text-center">
                        {action.description}
                      </p>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Estado del Sistema */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Estado del Sistema</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-center gap-3">
                    <CheckCircle size={20} className="text-green-600" />
                    <span className="font-medium text-green-800">Todos los sistemas operativos</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-center gap-3">
                    <Cpu size={20} className="text-blue-600" />
                    <span className="font-medium text-blue-800">Base de datos estable</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg border border-purple-200">
                  <div className="flex items-center gap-3">
                    <Zap size={20} className="text-purple-600" />
                    <span className="font-medium text-purple-800">Automatización activa</span>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">Uso de recursos</span>
                    <span className="text-sm text-gray-500">65%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-green-600 h-2 rounded-full" style={{ width: '65%' }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Actividad Reciente */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold text-gray-900">Actividad Reciente</h2>
                  <button className="text-sm text-emerald-600 hover:text-emerald-700 font-medium">
                    Ver todo
                  </button>
                </div>
                <div className="space-y-3">
                  {recentActivities.map(activity => (
                    <div key={activity.id} className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors duration-200">
                      {getActivityIcon(activity.type)}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {activity.message}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <Clock size={12} className="text-gray-400" />
                          <span className="text-xs text-gray-500">{activity.time}</span>
                          {activity.lab && (
                            <>
                              <span className="text-gray-300">•</span>
                              <span className="text-xs text-blue-600 font-medium">{activity.lab}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Panel de Alertas */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-900">Alertas del Sistema</h2>
                <span className="px-2 py-1 bg-red-100 text-red-800 text-xs font-medium rounded-full">
                  {alerts.filter(a => a.priority === 'high').length} críticas
                </span>
              </div>
              <AlertsPanel alerts={alerts} />
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}