import Navbar from "../components/Navbar";
import SummaryCard from "../components/SummaryCard";
import LabCard from "../components/LabCard";
import AlertsPanel from "../components/AlertsPanel";

export default function Dashboard() {
  const labs = [
    { id: 1, name: "Lab Microbiología", devices: 12, status: "activo" as const, temperature: 23.5, humidity: 45 },
    { id: 2, name: "Lab Química Orgánica", devices: 18, status: "alerta" as const, temperature: 31.2, humidity: 62 },
  ];

  const alerts = [
    { id: 1, message: "Temperatura alta en Lab Química", time: "hace 5 min", type: "warning" as const },
    { id: 2, message: "Sistema de ventilación en mantenimiento", time: "hace 1 hora", type: "info" as const },
    { id: 3, message: "Nivel de humedad óptimo alcanzado en Lab 1", time: "hace 2 horas", type: "success" as const },
  ];

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <main className="p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-6">Panel de Control</h2>

        {/* Layout principal */}
        <div className="flex gap-6">
          {/* Columna izquierda: SummaryCards y LabCards */}
          <div className="flex-1 space-y-6">
            {/* SummaryCards en grid horizontal */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <SummaryCard title="Laboratorios" value={labs.length} />
              <SummaryCard title="Dispositivos" value={labs.reduce((a, l) => a + l.devices, 0)} />
              <SummaryCard title="Alertas" value={alerts.length} />
              <SummaryCard title="Activos" value={labs.filter(l => l.status === "activo").length} />
            </div>

            {/* LabCards debajo */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {labs.map((lab) => (
                <LabCard key={lab.id} {...lab} />
              ))}
            </div>
          </div>

          {/* Columna derecha: AlertsPanel */}
          <div className="w-80">
            <AlertsPanel alerts={alerts} />
          </div>
        </div>
      </main>
    </div>
  );
}