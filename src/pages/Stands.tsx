import { useState } from "react";
import Navbar from "../components/Navbar";
import ShelfCard from "../components/ShelfCard";
import type { DraggableComponent } from "../types/DraggableComponent";

interface Estanteria {
  id: number;
  nombre: string;
  descripcion: string;
  proyectoId: number;
  proyectoNombre: string;
  filasTotal: number;
  filasUsadas: number;
  intensidadLuz: number;
  modulosActivos: number;
  status: "activo" | "inactivo" | "alerta";
}

// Interface para los componentes colocados
interface PlacedComponent {
  id: string;
  name: string;
  type: string;
  icon: string;
  estanteriaId?: number;
  position?: { x: number; y: number };
}

const Shelves = () => {
  const [estanterias, setEstanterias] = useState<Estanteria[]>([
    {
      id: 1,
      nombre: "Estantería 1",
      descripcion: "Estantería principal",
      proyectoId: 1,
      proyectoNombre: "Proyecto 1",
      filasTotal: 6,
      filasUsadas: 4,
      intensidadLuz: 85,
      modulosActivos: 2,
      status: "activo",
    },
    {
      id: 2,
      nombre: "Estantería 2",
      descripcion: "Estantería secundaria",
      proyectoId: 1,
      proyectoNombre: "Proyecto 1",
      filasTotal: 8,
      filasUsadas: 5,
      intensidadLuz: 72,
      modulosActivos: 3,
      status: "activo",
    },
  ]);

  const [placedComponents, setPlacedComponents] = useState<PlacedComponent[]>([]);
  const [nombreEstanteria, setNombreEstanteria] = useState("");
  const [descripcionEstanteria, setDescripcionEstanteria] = useState("");
  const [proyectoId, setProyectoId] = useState(1);
  const [proyectoNombre, setProyectoNombre] = useState("Proyecto 1");
  const [filasTotal, setFilasTotal] = useState(0);
  const [filasUsadas, setFilasUsadas] = useState(0);
  const [intensidadLuz, setIntensidadLuz] = useState(0);
  const [modulosActivos, setModulosActivos] = useState(0);
  const [status, setStatus] = useState<"activo" | "inactivo" | "alerta">("activo");
  const [showCreateForm, setShowCreateForm] = useState(false);

  // Lista de proyectos disponibles (esto debería venir de tu estado global o props)
  const proyectosDisponibles = [
    { id: 1, nombre: "Proyecto 1" },
    { id: 2, nombre: "Proyecto 2" },
    { id: 3, nombre: "Proyecto 3" },
  ];

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

  const crearEstanteria = () => {
    if (!nombreEstanteria.trim() || !descripcionEstanteria.trim()) return;

    const nuevaEstanteria: Estanteria = {
      id: Date.now(),
      nombre: nombreEstanteria,
      descripcion: descripcionEstanteria,
      proyectoId: proyectoId,
      proyectoNombre: proyectoNombre,
      filasTotal: filasTotal,
      filasUsadas: filasUsadas,
      intensidadLuz: intensidadLuz,
      modulosActivos: modulosActivos,
      status: status,
    };

    setEstanterias([...estanterias, nuevaEstanteria]);
    setNombreEstanteria("");
    setDescripcionEstanteria("");
    setProyectoId(1);
    setProyectoNombre("Proyecto 1");
    setFilasTotal(0);
    setFilasUsadas(0);
    setIntensidadLuz(0);
    setModulosActivos(0);
    setStatus("activo");
    setShowCreateForm(false);
  };

  const handleProyectoChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedId = Number(e.target.value);
    const selectedProyecto = proyectosDisponibles.find(p => p.id === selectedId);
    setProyectoId(selectedId);
    setProyectoNombre(selectedProyecto?.nombre || "");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      <Navbar />
      <main className="px-4 sm:px-6 lg:px-8 py-8 max-w-7xl mx-auto">
        {/* Área de Drop para Componentes */}
        <div 
          className="mb-8 p-8 border-2 border-dashed border-purple-300 rounded-3xl bg-gradient-to-br from-purple-50/50 to-pink-50/30 backdrop-blur-sm min-h-[140px] transition-all duration-300 hover:border-purple-400 hover:shadow-lg"
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          <div className="text-center">
            {placedComponents.length === 0 ? (
              <div className="py-10">
                <div className="text-5xl mb-4 animate-bounce">📥</div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  Área de Componentes
                </h3>
                <p className="text-gray-600 text-sm">
                  Arrastra componentes aquí desde el panel lateral
                </p>
              </div>
            ) : (
              <div>
                <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center justify-center gap-2">
                  <span className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></span>
                  Componentes Colocados ({placedComponents.length})
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {placedComponents.map((component) => (
                    <div
                      key={component.id}
                      className="flex items-center p-4 bg-white/80 backdrop-blur-sm border border-purple-200 rounded-2xl shadow-md hover:shadow-xl hover:scale-105 transition-all duration-300"
                    >
                      <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center bg-gradient-to-br from-purple-100 to-pink-100 rounded-xl mr-4 shadow-sm">
                        <span className="text-2xl">{component.icon}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-bold text-gray-900 truncate">
                          {component.name}
                        </div>
                        <div className="text-xs text-gray-600 capitalize font-medium">
                          {component.type.replace('-', ' ')}
                        </div>
                      </div>
                      <button
                        onClick={() => removeComponent(component.id)}
                        className="flex-shrink-0 w-8 h-8 flex items-center justify-center text-gray-400 hover:text-white hover:bg-red-500 rounded-lg transition-all duration-200"
                      >
                        <span className="text-xl">×</span>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Sección de Estanterías */}
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-black text-gray-800 flex items-center gap-3">
            <div className="w-1 h-8 bg-gradient-to-b from-purple-500 to-pink-600 rounded-full"></div>
            Estanterías del Sistema
          </h2>
          <button
            onClick={() => setShowCreateForm(true)}
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-6 py-3 rounded-xl font-bold transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 flex items-center gap-2"
          >
            <span className="text-lg">+</span>
            Nueva Estantería
          </button>
        </div>

        {showCreateForm && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden">
              {/* Header del Modal */}
              <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-6">
                <h3 className="text-2xl font-black text-white">Crear Nueva Estantería</h3>
                <p className="text-purple-100 text-sm mt-1">Complete los datos de la estantería</p>
              </div>

              {/* Contenido del Modal */}
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Nombre de la Estantería</label>
                  <input
                    type="text"
                    value={nombreEstanteria}
                    onChange={(e) => setNombreEstanteria(e.target.value)}
                    placeholder="Ej: Estantería 3"
                    className="w-full p-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Descripción</label>
                  <textarea
                    value={descripcionEstanteria}
                    onChange={(e) => setDescripcionEstanteria(e.target.value)}
                    placeholder="Descripción de la estantería"
                    rows={3}
                    className="w-full p-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all resize-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Proyecto Asignado</label>
                  <select
                    value={proyectoId}
                    onChange={handleProyectoChange}
                    className="w-full p-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  >
                    {proyectosDisponibles.map((proyecto) => (
                      <option key={proyecto.id} value={proyecto.id}>
                        {proyecto.nombre}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Filas Total</label>
                    <input
                      type="number"
                      value={filasTotal}
                      onChange={(e) => setFilasTotal(Number(e.target.value))}
                      placeholder="0"
                      className="w-full p-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Filas Usadas</label>
                    <input
                      type="number"
                      value={filasUsadas}
                      onChange={(e) => setFilasUsadas(Number(e.target.value))}
                      placeholder="0"
                      className="w-full p-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Intensidad Luz %</label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={intensidadLuz}
                      onChange={(e) => setIntensidadLuz(Number(e.target.value))}
                      placeholder="0-100"
                      className="w-full p-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Módulos Activos</label>
                    <input
                      type="number"
                      value={modulosActivos}
                      onChange={(e) => setModulosActivos(Number(e.target.value))}
                      placeholder="0"
                      className="w-full p-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Estado</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as "activo" | "inactivo" | "alerta")}
                    className="w-full p-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  >
                    <option value="activo">🟢 Activo</option>
                    <option value="inactivo">⚫ Inactivo</option>
                    <option value="alerta">🟡 Alerta</option>
                  </select>
                </div>
              </div>

              {/* Footer del Modal */}
              <div className="flex gap-3 justify-end p-6 bg-gray-50 border-t border-gray-200">
                <button
                  onClick={() => setShowCreateForm(false)}
                  className="px-6 py-3 text-gray-700 hover:bg-gray-200 font-bold rounded-xl transition-all duration-200"
                >
                  Cancelar
                </button>
                <button
                  onClick={crearEstanteria}
                  disabled={!nombreEstanteria.trim() || !descripcionEstanteria.trim()}
                  className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:from-gray-400 disabled:to-gray-400 text-white rounded-xl font-bold transition-all duration-200 shadow-lg hover:shadow-xl disabled:cursor-not-allowed"
                >
                  Crear Estantería
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {estanterias.map((estanteria) => (
            <ShelfCard
              key={estanteria.id}
              nombre={estanteria.nombre}
              proyectoNombre={estanteria.proyectoNombre}
              filasTotal={estanteria.filasTotal}
              filasUsadas={estanteria.filasUsadas}
              intensidadLuz={estanteria.intensidadLuz}
              modulosActivos={estanteria.modulosActivos}
              status={estanteria.status}
            />
          ))}
        </div>
      </main>
    </div>
  );
};

export default Shelves;