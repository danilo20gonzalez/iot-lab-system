import { useState } from "react";
import Navbar from "../components/Navbar";
import ProjectCard from "../components/ProjectCard";
import ComponentPanel from "../components/ComponentPanel";
import AirConditionerControl from "../components/deviceControl/AirConditionerControl";
import LightControl from "../components/deviceControl/LightControl";
import RealTimeCamera from "../components/deviceControl/RealTimeCamera";
import CreateStandModal from '../modals/CreateStandModal';
import { ReactSortable } from 'react-sortablejs';
import type { ComponentData } from "../context/AppContext";

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

  const [placedComponents, setPlacedComponents] = useState<ComponentData[]>([]);
  const [nombreProyecto, setNombreProyecto] = useState("");
  const [descripcionProyecto, setDescripcionProyecto] = useState("");
  const [estanteriasTotal, setEstanteriasTotal] = useState(0);
  const [estanteriasUsadas, setEstanteriasUsadas] = useState(0);
  const [phAgua, setPhAgua] = useState(7.0);
  const [modulosActivos, setModulosActivos] = useState(0);
  const [status, setStatus] = useState<"activo" | "inactivo" | "alerta">("activo");
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [isPanelOpen, setIsPanelOpen] = useState(false);

  // Manejar cuando se arrastra sobre el área
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();

    const data = e.dataTransfer.getData('application/json');
    if (!data) return;

    try {
      const componentData = JSON.parse(data);

      const newPlacedComponent: ComponentData = {
        ...componentData,
        id: `${componentData.type}-${Date.now()}`,
      };

      setPlacedComponents(prev => [...prev, newPlacedComponent]);
    } catch (error) {
      console.error('Error al procesar componente:', error);
    }
  };

  const handleAddComponent = (component: any) => {
    const newPlacedComponent: ComponentData = {
      type: component.type,
      name: component.name,
      id: `${component.type}-${Date.now()}`,
    };
    setPlacedComponents(prev => [...prev, newPlacedComponent]);
  };

  // Eliminar un componente colocado
  const removeComponent = (componentId: string) => {
    setPlacedComponents(prev => prev.filter(comp => comp.id !== componentId));
  };

  const updateComponentOrder = (list: ComponentData[]) => setPlacedComponents(list);

  // Renderizar componente basado en el tipo
  const renderComponent = (component: ComponentData) => {
    return (
      <div className="relative group h-full">
        <button
          onClick={() => removeComponent(component.id as string)}
          className="absolute -top-2 -right-2 z-50 bg-red-500 hover:bg-red-700 text-white w-6 h-6 rounded-full flex items-center justify-center shadow-md opacity-0 group-hover:opacity-100 transition-all duration-200"
          title="Eliminar dispositivo"
        >
          <span className="text-xs font-bold">✕</span>
        </button>

        <div className="h-48">
          {component.type === 'air-conditioner' && <AirConditionerControl />}
          {component.type === 'light' && <LightControl />}
          {component.type === 'camera' && <RealTimeCamera />}
        </div>
      </div>
    );
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
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto p-6" style={{ zoom: 0.8 }}>
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-3xl font-bold text-gray-900">Control del Modulo (Nombre del modulo)</h1>
          <button
            onClick={() => setIsPanelOpen(true)}
            className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white px-6 py-2 rounded-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 flex items-center gap-2 cursor-pointer"
          >
            <span>+</span>
            Agregar Componente
          </button>
        </div>

        {/* Área de Drop para Componentes */}
        <div
          className="p-4 mb-4"
          onDrop={handleDrop}
          onDragOver={handleDragOver}
        >
          {placedComponents.length === 0 ? (
            // Estado vacío
            <div className="flex flex-col items-center justify-center h-64 border-2 border-dashed border-blue-500 rounded-xl bg-gray-300">
              <div className="text-center">
                <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">📥</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  No hay componentes
                </h3>
                <p className="text-gray-500 mb-4">
                  Arrastra componentes desde el panel o haz clic en "Agregar Componente"
                </p>
                <button
                  onClick={() => setIsPanelOpen(true)}
                  className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white px-4 py-2 rounded-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 items-center gap-2 cursor-pointer"
                >
                  Abrir Panel de Componentes
                </button>
              </div>
            </div>
          ) : (
            // Grid de componentes con ReactSortable
            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-2">Componentes de Control</h2>
              <ReactSortable
                list={placedComponents}
                setList={updateComponentOrder}
                animation={200}
                delayOnTouchOnly={true}
                delay={100}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mb-6"
              >
                {placedComponents.map((component) => (
                  <div key={component.id} className="cursor-move">
                    {renderComponent(component)}
                  </div>
                ))}
              </ReactSortable>
            </div>
          )}
        </div>

        {/* Sección de Proyectos */}
        <div className="p-4 flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3 mb-2">
            <div className="w-1 h-8 bg-gradient-to-b from-blue-500 to-cyan-600 rounded-full"></div>
            Stands Disponibles
          </h1>

          <div className="flex gap-4">
            <button
              onClick={() => setShowCreateForm(true)}
              className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white px-6 py-3 rounded-xl font-bold transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 flex items-center gap-2 cursor-pointer"
            >
              <span className="text-lg">+</span>
              Nuevo Stand
            </button>
          </div>

        </div>

        {/* Modal para crear nuevo stand */}
        <CreateStandModal
          isOpen={showCreateForm}
          onClose={() => setShowCreateForm(false)}
          onCreated={() => setShowCreateForm(false)}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-6">
          {proyectos.map((proyecto) => (
            <ProjectCard
              key={proyecto.id}
              nombre={proyecto.nombre}
              estanteriasTotal={proyecto.estanteriasTotal}
              estanteriasUsadas={proyecto.estanteriasUsadas}
              phAgua={proyecto.phAgua}
              modulosActivos={proyecto.modulosActivos}
              status={proyecto.status}
              onEdit={() => console.log('Editar proyecto', proyecto.id)}
              onDelete={() => console.log('Eliminar proyecto', proyecto.id)}
            />
          ))}
        </div>

        <ComponentPanel
          isOpen={isPanelOpen}
          onClose={() => setIsPanelOpen(false)}
          onAddComponent={handleAddComponent}
          allowedTypes={['light', 'camera', 'air-conditioner']}
        />
      </div>


      <main className="px-4 sm:px-6 lg:px-8 py-8 max-w-7xl mx-auto">





      </main>
    </div>
  );
};

export default Projects;