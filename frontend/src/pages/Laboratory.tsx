import { useState } from "react";
import Navbar from "../components/Navbar";
import LabRoomCard from "../components/LabRoomCard";
import type { DraggableComponent } from "../types/DraggableComponent";

interface Sala {
  id: number;
  nombre: string;
  descripcion: string;
  dispositivosConectados: number;
  temperatura: number;
  modulosActivos: number;
  status: "activo" | "inactivo" | "alerta";
}

// Interface para los componentes colocados
interface PlacedComponent {
  id: string;
  name: string;
  type: string;
  icon: string;
  salaId?: number; // Opcional: para asociar a una sala específica
  position?: { x: number; y: number }; // Para posicionamiento libre
}

const Laboratory = () => {
  const [salas, setSalas] = useState<Sala[]>([
    {
      id: 1,
      nombre: "Sala 1",
      descripcion: "Sala 1",
      dispositivosConectados: 5,
      temperatura: 22,
      modulosActivos: 3,
      status: "activo",
    },
    {
      id: 2,
      nombre: "Sala 2",
      descripcion: "Sala 2",
      dispositivosConectados: 3,
      temperatura: 25,
      modulosActivos: 2,
      status: "inactivo",
    },
  ]);

  const [placedComponents, setPlacedComponents] = useState<PlacedComponent[]>([]);
  const [nombreSala, setNombreSala] = useState("");
  const [descripcionSala, setDescripcionSala] = useState("");
  const [dispositivosConectados, setDispositivosConectados] = useState(0);
  const [temperatura, setTemperatura] = useState(0);
  const [modulosActivos, setModulosActivos] = useState(0);
  const [status, setStatus] = useState<"activo" | "inactivo" | "alerta">("activo");
  const [showCreateForm, setShowCreateForm] = useState(false);

  // Manejar cuando se arrastra sobre el área
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
  };

  // Manejar cuando se suelta un componente
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    
    const data = e.dataTransfer.getData('application/json');
    if (!data) return;

    try {
      const component: DraggableComponent = JSON.parse(data);
      
      const newPlacedComponent: PlacedComponent = {
        ...component,
        id: `${component.type}-${Date.now()}`,
      };

      setPlacedComponents(prev => [...prev, newPlacedComponent]);
    } catch (error) {
      console.error('Error al procesar componente:', error);
    }
  };

  // Eliminar un componente colocado
  const removeComponent = (componentId: string) => {
    setPlacedComponents(prev => prev.filter(comp => comp.id !== componentId));
  };

  const crearSala = () => {
    if (!nombreSala.trim() || !descripcionSala.trim()) return;

    const nuevaSala: Sala = {
      id: Date.now(),
      nombre: nombreSala,
      descripcion: descripcionSala,
      dispositivosConectados: dispositivosConectados,
      temperatura: temperatura,
      modulosActivos: modulosActivos,
      status: status,
    };

    setSalas([...salas, nuevaSala]);
    setNombreSala("");
    setDescripcionSala("");
    setDispositivosConectados(0);
    setTemperatura(0);
    setModulosActivos(0);
    setStatus("activo");
    setShowCreateForm(false);
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main className="p-6">
        {/* Área de Drop para Componentes */}
        <div 
          className="mb-6 p-6 border-2 border-dashed border-gray-300 rounded-2xl bg-gray-50 min-h-[120px] transition-all duration-200"
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          <div className="text-center">
            {placedComponents.length === 0 ? (
              <div className="py-8">
                <div className="text-4xl mb-3">📥</div>
                <h3 className="text-lg font-semibold text-gray-700 mb-2">
                  Área de Componentes
                </h3>
                <p className="text-gray-500 text-sm">
                  Arrastra componentes aquí desde el panel lateral
                </p>
              </div>
            ) : (
              <div>
                <h3 className="text-lg font-semibold text-gray-700 mb-4">
                  Componentes Colocados ({placedComponents.length})
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {placedComponents.map((component) => (
                    <div
                      key={component.id}
                      className="flex items-center p-3 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow"
                    >
                      <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center bg-blue-100 rounded-lg mr-3">
                        <span className="text-xl">{component.icon}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-gray-900 truncate">
                          {component.name}
                        </div>
                        <div className="text-xs text-gray-500 capitalize">
                          {component.type.replace('-', ' ')}
                        </div>
                      </div>
                      <button
                        onClick={() => removeComponent(component.id)}
                        className="flex-shrink-0 w-6 h-6 flex items-center justify-center text-gray-400 hover:text-red-500 transition-colors"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Sección de Salas (existente) */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-800">Salas del Laboratorio</h2>
          <button
            onClick={() => setShowCreateForm(true)}
            className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg font-semibold transition-colors duration-200"
          >
            + Nueva Sala
          </button>
        </div>

        {showCreateForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-2xl shadow-xl w-96">
              <h3 className="text-lg font-bold text-gray-800 mb-4">Crear Nueva Sala</h3>
              <input
                type="text"
                value={nombreSala}
                onChange={(e) => setNombreSala(e.target.value)}
                placeholder="Nombre de la sala"
                className="w-full p-3 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <textarea
                value={descripcionSala}
                onChange={(e) => setDescripcionSala(e.target.value)}
                placeholder="Descripción de la sala"
                className="w-full p-3 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <input
                type="number"
                value={dispositivosConectados}
                onChange={(e) => setDispositivosConectados(Number(e.target.value))}
                placeholder="Dispositivos conectados"
                className="w-full p-3 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <input
                type="number"
                value={temperatura}
                onChange={(e) => setTemperatura(Number(e.target.value))}
                placeholder="Temperatura"
                className="w-full p-3 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <input
                type="number"
                value={modulosActivos}
                onChange={(e) => setModulosActivos(Number(e.target.value))}
                placeholder="Módulos activos"
                className="w-full p-3 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as "activo" | "inactivo" | "alerta")}
                className="w-full p-3 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="activo">Activo</option>
                <option value="inactivo">Inactivo</option>
                <option value="alerta">Alerta</option>
              </select>
              <div className="flex gap-2 justify-end">
                <button
                  onClick={() => setShowCreateForm(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium"
                >
                  Cancelar
                </button>
                <button
                  onClick={crearSala}
                  disabled={!nombreSala.trim() || !descripcionSala.trim()}
                  className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 disabled:bg-gray-400 text-white rounded-lg font-semibold transition-colors duration-200"
                >
                  Crear
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {salas.map((sala) => (
            <LabRoomCard
              key={sala.id}
              nombre={sala.nombre}
              dispositivosConectados={sala.dispositivosConectados}
              temperatura={sala.temperatura}
              modulosActivos={sala.modulosActivos}
              status={sala.status}
            />
          ))}
        </div>
      </main>
    </div>
  );
};

export default Laboratory;