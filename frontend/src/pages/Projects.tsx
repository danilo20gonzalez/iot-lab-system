import { useState } from "react";
import Navbar from "../components/Navbar";
import ProjectCard from "../components/ProjectCard";
import ComponentPanel from "../components/ComponentPanel";
import AirConditionerControl from "../components/deviceControl/AirConditionerControl";
import LightControl from "../components/deviceControl/LightControl";
import RealTimeCamera from "../components/deviceControl/RealTimeCamera";
import CreateProjectModal from '../modals/CreateProjectModal';
import { ReactSortable } from 'react-sortablejs';
import type { ComponentData } from "../context/AppContext";

interface Proyecto {
  id: number;
  nombre: string;
  descripcion: string;
  estadoId: string;
  status: "activo" | "inactivo" | "alerta";
  sensors?: { id: string; type: string; name: string }[];
}



const Projects = () => {
  const [proyectos, setProyectos] = useState<Proyecto[]>([
    {
      id: 9999,
      nombre: "Proyecto de Prueba (Ejemplo)",
      descripcion: "Este es un proyecto de ejemplo para probar los sensores.",
      estadoId: '1',
      status: "activo",
      sensors: [
        { id: "ph-1", type: "ph", name: "Sensor de pH Principal" }
      ]
    },
  ]);

  const [placedComponents, setPlacedComponents] = useState<ComponentData[]>([]);
  const [editingProject, setEditingProject] = useState<Proyecto | null>(null);
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

  const handleSaveProject = async (projectData: any) => {
    // Aquí iría la llamada a la API. Como es un mock local, solo actualizamos el estado.
    if (editingProject) {
      setProyectos(prev => prev.map(p => p.id === editingProject.id ? {
        ...p,
        ...projectData,
        status: projectData.estadoId === '1' ? 'activo' : projectData.estadoId === '2' ? 'alerta' : 'inactivo'
      } : p));
    } else {
      setProyectos(prev => [...prev, {
        ...projectData,
        id: Date.now(),
        status: projectData.estadoId === '1' ? 'activo' : projectData.estadoId === '2' ? 'alerta' : 'inactivo'
      }]);
    }
    setShowCreateForm(false);
  };

  const handleDeleteProject = (id: number) => {
    if (window.confirm("¿Estás seguro de eliminar este proyecto?")) {
      setProyectos(prev => prev.filter(p => p.id !== id));
    }
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
            Proyectos Disponibles
          </h1>

          <div className="flex gap-4">
            <button
              onClick={() => {
                setEditingProject(null);
                setShowCreateForm(true);
              }}
              className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white px-6 py-3 rounded-xl font-bold transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 flex items-center gap-2 cursor-pointer"
            >
              <span className="text-lg">+</span>
              Nuevo Proyecto
            </button>
          </div>

        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-6">
          {proyectos.map((proyecto) => (
            <ProjectCard
              key={proyecto.id}
              nombre={proyecto.nombre}
              status={proyecto.status}
              sensors={proyecto.sensors}
              onEdit={() => {
                setEditingProject(proyecto);
                setShowCreateForm(true);
              }}
              onDelete={() => handleDeleteProject(proyecto.id)}
            />
          ))}
        </div>

      </div>

      <CreateProjectModal
        isOpen={showCreateForm}
        onClose={() => {
          setShowCreateForm(false);
          setEditingProject(null);
        }}
        onSave={handleSaveProject}
        editingProject={editingProject}
      />

      <ComponentPanel
        isOpen={isPanelOpen}
        onClose={() => setIsPanelOpen(false)}
        onAddComponent={handleAddComponent}
        allowedTypes={['light', 'camera', 'air-conditioner']}
      />
    </div>
  );
};

export default Projects;