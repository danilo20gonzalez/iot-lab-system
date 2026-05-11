// Dashboard.tsx
import { useState, useEffect } from "react";
import {
  Activity,
  Users,
  Building2,
  Thermometer,
  Camera,
  AlertTriangle,
  Clock,
  BarChart3,
  Settings,
  Cpu
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

  const [alerts, setAlerts] = useState<Alert[]>([]);

  const [recentActivities, setRecentActivities] = useState<RecentActivity[]>([]);

  // Carga de datos del sistema
  useEffect(() => {
    const fetchSystemData = async () => {
      try {
        // Obtener estadísticas generales
        const statsRes = await fetch('http://localhost:4000/api/dashboard/stats');
        if (statsRes.ok) {
          const stats = await statsRes.json();
          setSystemStats(stats);
        }

        // Obtener alertas
        const alertsRes = await fetch('http://localhost:4000/api/dashboard/alerts');
        if (alertsRes.ok) {
          const alertsData = await alertsRes.json();
          // Se formatea la hora en base al formato requerido o se deja tal cual la retorna la BD
          setAlerts(alertsData);
        }

        // Obtener actividad reciente
        const activitiesRes = await fetch('http://localhost:4000/api/dashboard/activities');
        if (activitiesRes.ok) {
          const activities = await activitiesRes.json();
          setRecentActivities(activities);
        }

      } catch (error) {
        console.error('Error al cargar datos del sistema:', error);
      }
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
      icon: Settings,
      label: "Configuración del Sistema",
      description: "Configurar parámetros del sistema",
      action: () => navigate('/settings'),
      color: "bg-gray-500"
    }
  ];

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'sensor': return <Thermometer size={16} className="text-white" />;
      case 'user': return <Users size={16} className="text-white" />;
      case 'system': return <Cpu size={16} className="text-white" />;
      case 'alert': return <AlertTriangle size={16} className="text-white" />;
      default: return <Activity size={16} className="text-white" />;
    }
  };

  // const getPriorityColor = (priority: string) => {
  //   switch (priority) {
  //     case 'high': return 'bg-red-100 text-red-800 border-red-200';
  //     case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
  //     case 'low': return 'bg-green-100 text-green-800 border-green-200';
  //     default: return 'bg-gray-100 text-gray-800 border-gray-200';
  //   }
  // };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="">
        <div className="max-w-7xl mx-auto p-6">
          {/* Header del Dashboard */}
          <div className="mb-5">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Panel de Control General</h1>
                <p className="text-gray-600">
                  Resumen del sistema de gestión de laboratorios - Monitoreo en tiempo real
                </p>
              </div>
              <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg ">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-gray-700">Sistema Operativo</span>
              </div>
            </div>
          </div>

          {/* Estadísticas Principales del Sistema */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-4">
            <SummaryCard
              title="Laboratorios"
              value={systemStats.totalLabs}
              subtitle={`${systemStats.activeLabs} activos`}
              icon={Building2}
            />

            <SummaryCard
              title="Sensores"
              value={systemStats.activeSensors}
              subtitle="monitoreando"
              icon={Thermometer}
            />
            <SummaryCard
              title="Accionadores"
              value={systemStats.totalDevices}
              subtitle="conectados"
              icon={Cpu}
            />
            {/* <SummaryCard
              title="Automatización"
              value={systemStats.automationEnabled}
              subtitle="laboratorios"
              icon={Zap}
            /> */}
            {/* <SummaryCard
              title="Disponibilidad"
              value={systemStats.systemUptime}
              subtitle="uptime"
              icon={CheckCircle}
            /> */}
            {/* <SummaryCard
              title="Precisión"
              value={`${systemStats.dataAccuracy}%`}
              subtitle="de datos"
              icon={Shield}
            /> */}
            <SummaryCard
              title="Alertas"
              value={alerts.length}
              subtitle="activas"
              icon={AlertTriangle}
            />
            <SummaryCard
              title="Usuarios"
              value={systemStats.totalUsers}
              subtitle="activos"
              icon={Users}
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-4">
            {/* Columna Izquierda: Acciones y Actividad */}
            <div className="lg:col-span-2 space-y-6">
              {/* Acciones Rápidas */}
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

              {/* Actividad Reciente */}
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
                      <div className={`p-2 rounded-lg ${activity.type === 'sensor' ? 'bg-blue-500' :
                        activity.type === 'user' ? 'bg-green-500' :
                          activity.type === 'system' ? 'bg-purple-500' :
                            activity.type === 'alert' ? 'bg-orange-500' : 'bg-gray-500'
                        }`}>
                        {getActivityIcon(activity.type)}
                      </div>
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

            {/* Columna Derecha: Alertas */}
            <div className="lg:col-span-1">
              <div>

                <AlertsPanel alerts={alerts} />
              </div>
              {/* Estado del Sistema */}
              {/* <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Estado del Sistema</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
                      <CheckCircle size={20} className="text-white" />
                    </div>
                    <span className="font-medium text-green-800">Todos los sistemas operativos</span>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                      <Cpu size={20} className="text-white" />
                    </div>
                    <span className="font-medium text-blue-800">Base de datos estable</span>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg border border-purple-200">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
                      <Zap size={20} className="text-white" />
                    </div>
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
            </div> */}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}