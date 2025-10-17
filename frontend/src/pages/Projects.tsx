import { useState } from "react";
import Navbar from "../components/Navbar";
import ProjectCard from "../components/ProjectCard";
import type { DraggableComponent } from "../types/DraggableComponent";

interface Proyecto {
  id: number;
  nombre: string;
  descripcion: string;
  estanteriasTotal: number;
  estanteriasUsadas: number;
  phAgua: number;
  modulosActivos: number;
  status: "activo" | "inactivo" | "alerta";
}

// Interface para los componentes colocados
interface PlacedComponent {
  id: string;
  name: string;
  type: string;
  icon: string;
  proyectoId?: number;
  position?: { x: number; y: number };
}

const Projects = () => {
  const [proyectos, setProyectos] = useState<Proyecto[]>([
    {
      id: 1,
      nombre: "Proyecto 1",
      descripcion: "Tanque de agua principal",
      estanteriasTotal: 12,
      estanteriasUsadas: 8,
      phAgua: 7.2,
      modulosActivos: 3,
      status: "activo",
    },
    {
      id: 2,
      nombre: "Proyecto 2",
      descripcion: "Tanque de agua secundario",
      estanteriasTotal: 8,
      estanteriasUsadas: 5,
      phAgua: 6.8,
      modulosActivos: 2,
      status: "inactivo",
    },
  ]);

  const [placedComponents, setPlacedComponents] = useState<PlacedComponent[]>([]);
  const [nombreProyecto, setNombreProyecto] = useState("");
  const [descripcionProyecto, setDescripcionProyecto] = useState("");
  const [estanteriasTotal, setEstanteriasTotal] = useState(0);
  const [estanteriasUsadas, setEstanteriasUsadas] = useState(0);
  const [phAgua, setPhAgua] = useState(7.0);
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

  const crearProyecto = () => {
    if (!nombreProyecto.trim() || !descripcionProyecto.trim()) return;

    const nuevoProyecto: Proyecto = {
      id: Date.now(),
      nombre: nombreProyecto,
      descripcion: descripcionProyecto,
      estanteriasTotal: estanteriasTotal,
      estanteriasUsadas: estanteriasUsadas,
      phAgua: phAgua,
      modulosActivos: modulosActivos,
      status: status,
    };

    setProyectos([...proyectos, nuevoProyecto]);
    setNombreProyecto("");
    setDescripcionProyecto("");
    setEstanteriasTotal(0);
    setEstanteriasUsadas(0);
    setPhAgua(7.0);
    setModulosActivos(0);
    setStatus("activo");
    setShowCreateForm(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      <Navbar />
      <main className="px-4 sm:px-6 lg:px-8 py-8 max-w-7xl mx-auto">
        {/* Área de Drop para Componentes */}
        <div 
          className="mb-8 p-8 border-2 border-dashed border-blue-300 rounded-3xl bg-gradient-to-br from-blue-50/50 to-cyan-50/30 backdrop-blur-sm min-h-[140px] transition-all duration-300 hover:border-blue-400 hover:shadow-lg"
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
                  <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
                  Componentes Colocados ({placedComponents.length})
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {placedComponents.map((component) => (
                    <div
                      key={component.id}
                      className="flex items-center p-4 bg-white/80 backdrop-blur-sm border border-blue-200 rounded-2xl shadow-md hover:shadow-xl hover:scale-105 transition-all duration-300"
                    >
                      <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center bg-gradient-to-br from-blue-100 to-cyan-100 rounded-xl mr-4 shadow-sm">
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

        {/* Sección de Proyectos */}
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-black text-gray-800 flex items-center gap-3">
            <div className="w-1 h-8 bg-gradient-to-b from-blue-500 to-cyan-600 rounded-full"></div>
            Proyectos de Tanques de Agua
          </h2>
          <button
            onClick={() => setShowCreateForm(true)}
            className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white px-6 py-3 rounded-xl font-bold transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 flex items-center gap-2"
          >
            <span className="text-lg">+</span>
            Nuevo Proyecto
          </button>
        </div>

        {showCreateForm && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden">
              {/* Header del Modal */}
              <div className="bg-gradient-to-r from-blue-600 to-cyan-600 p-6">
                <h3 className="text-2xl font-black text-white">Crear Nuevo Proyecto</h3>
                <p className="text-blue-100 text-sm mt-1">Complete los datos del tanque</p>
              </div>

              {/* Contenido del Modal */}
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Nombre del Proyecto</label>
                  <input
                    type="text"
                    value={nombreProyecto}
                    onChange={(e) => setNombreProyecto(e.target.value)}
                    placeholder="Ej: Proyecto 3"
                    className="w-full p-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Descripción</label>
                  <textarea
                    value={descripcionProyecto}
                    onChange={(e) => setDescripcionProyecto(e.target.value)}
                    placeholder="Descripción del proyecto"
                    rows={3}
                    className="w-full p-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Estanterías Total</label>
                    <input
                      type="number"
                      value={estanteriasTotal}
                      onChange={(e) => setEstanteriasTotal(Number(e.target.value))}
                      placeholder="0"
                      className="w-full p-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Estanterías Usadas</label>
                    <input
                      type="number"
                      value={estanteriasUsadas}
                      onChange={(e) => setEstanteriasUsadas(Number(e.target.value))}
                      placeholder="0"
                      className="w-full p-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">pH del Agua</label>
                    <input
                      type="number"
                      step="0.1"
                      value={phAgua}
                      onChange={(e) => setPhAgua(Number(e.target.value))}
                      placeholder="7.0"
                      className="w-full p-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Módulos Activos</label>
                    <input
                      type="number"
                      value={modulosActivos}
                      onChange={(e) => setModulosActivos(Number(e.target.value))}
                      placeholder="0"
                      className="w-full p-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Estado</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as "activo" | "inactivo" | "alerta")}
                    className="w-full p-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
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
                  onClick={crearProyecto}
                  disabled={!nombreProyecto.trim() || !descripcionProyecto.trim()}
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 disabled:from-gray-400 disabled:to-gray-400 text-white rounded-xl font-bold transition-all duration-200 shadow-lg hover:shadow-xl disabled:cursor-not-allowed"
                >
                  Crear Proyecto
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {proyectos.map((proyecto) => (
            <ProjectCard
              key={proyecto.id}
              nombre={proyecto.nombre}
              estanteriasTotal={proyecto.estanteriasTotal}
              estanteriasUsadas={proyecto.estanteriasUsadas}
              phAgua={proyecto.phAgua}
              modulosActivos={proyecto.modulosActivos}
              status={proyecto.status}
            />
          ))}
        </div>
      </main>
    </div>
  );
};

export default Projects;