import { useState, useEffect  } from "react";
import Navbar from "../components/Navbar";
import SummaryCard from "../components/SummaryCard";
import LabCard from "../components/LabCard";
import AlertsPanel from "../components/AlertsPanel";

interface Alert {
  id: number;
  message: string;
  time: string;
  type: "warning" | "success" | "info";
}

interface Lab {
  id: number;
  name: string;
  devices: number;
  status: "activo" | "alerta" | "mantenimiento";
  temperature: number;
  humidity: number;
}

export default function Dashboard() {
  const [labs, setLabs] = useState<Lab[]>([
    { id: 1, name: "Lab Microbiología", devices: 12, status: "activo", temperature: 23.5, humidity: 45 },
    { id: 2, name: "Lab Química Orgánica", devices: 18, status: "alerta", temperature: 31.2, humidity: 62 },
  ]);

  const [newLabName, setNewLabName] = useState("");
  const [showCreateForm, setShowCreateForm] = useState(false);

  const alerts = [
    { id: 1, message: "Temperatura alta en Lab Química", time: "hace 5 min", type: "warning" },
    { id: 2, message: "Sistema de ventilación en mantenimiento", time: "hace 1 hora", type: "info" },
    { id: 3, message: "Nivel de humedad óptimo alcanzado en Lab 1", time: "hace 2 horas", type: "success" },
  ];
    useEffect(() => {
    const fetchLabs = async () => {
      try {
        const res = await fetch("http://localhost:4000/api/getLaboratorios");
        if (!res.ok) throw new Error("Error al cargar laboratorios");
        const data = await res.json();
        setLabs(data);
      } catch (error) {
        console.error(error);
        alert("❌ Error al cargar laboratorios");
      }
    };

    fetchLabs();
  }, []);


  // Crear nuevo laboratorio
  const createLab = async () => {
    if (!newLabName.trim()) return;

    try {
      const res = await fetch("http://localhost:4000/api/createLaboratorio", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newLabName,
          description: "Laboratorio creado desde el panel",
          estadoId: 1, // Activo
        }),
      });

      if (!res.ok) throw new Error("Error al crear laboratorio");
      const result = await res.json();

      // Agregar el nuevo laboratorio a la lista
      setLabs((prev) => [...prev, result.laboratorio]);

      setNewLabName("");
      setShowCreateForm(false);
      alert("✅ Laboratorio creado correctamente");
    } catch (error) {
      console.error(error);
      alert("❌ No se pudo crear el laboratorio");
    }
  };


  // Eliminar laboratorio
  const deleteLab = (id: number) => {
    if (window.confirm("¿Estás seguro de que quieres eliminar este laboratorio?")) {
      setLabs(labs.filter(lab => lab.id !== id));
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <main className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold mb-2 bg-gradient-to-r from-green-700 to-green-700 bg-clip-text text-transparent">Panel de Control</h2>
          
          {/* Botón para crear nuevo laboratorio */}
          <button
            onClick={() => setShowCreateForm(true)}
            className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg font-semibold transition-colors duration-200"
          >
            + Nuevo Laboratorio
          </button>
        </div>

        {/* Modal para crear laboratorio */}
        {showCreateForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-2xl shadow-xl w-96">
              <h3 className="text-lg font-bold text-gray-800 mb-4">Crear Nuevo Laboratorio</h3>
              
              <input
                type="text"
                value={newLabName}
                onChange={(e) => setNewLabName(e.target.value)}
                placeholder="Nombre del laboratorio"
                className="w-full p-3 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                onKeyPress={(e) => e.key === 'Enter' && createLab()}
              />
              
              <div className="flex gap-2 justify-end">
                <button
                  onClick={() => setShowCreateForm(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium"
                >
                  Cancelar
                </button>
                <button
                  onClick={createLab}
                  disabled={!newLabName.trim()}
                  className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 disabled:bg-gray-400 text-white rounded-lg font-semibold transition-colors duration-200"
                >
                  Crear
                </button>
              </div>
            </div>
          </div>
        )}

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
                <LabCard 
                  key={lab.id} 
                  {...lab} 
                  onDelete={() => deleteLab(lab.id)}
                />
              ))}
            </div>

            {/* Mensaje cuando no hay laboratorios */}
            {labs.length === 0 && (
              <div className="text-center py-12 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-300">
                <p className="text-gray-500 text-lg">No hay laboratorios creados</p>
                <button
                  onClick={() => setShowCreateForm(true)}
                  className="mt-4 bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-200"
                >
                  Crear Primer Laboratorio
                </button>
              </div>
            )}
          </div>

          {/* Columna derecha: AlertsPanel */}
          <div className="w-80">
            <AlertsPanel alerts={alerts as Alert[]} />
          </div>
        </div>
      </main>
    </div>
  );
}