import { useState } from "react";
import Navbar from "../components/Navbar";
import ShelfCard from "../components/ShelfCard";
import ComponentPanel from "../components/ComponentPanel";
import WaterValveControl from "../components/deviceControl/WaterValveControl";
import { ReactSortable } from 'react-sortablejs';
import type { ComponentData } from "../context/AppContext";
import CreateEstanteriaModal from '../modals/CreateEstanteriaModal';

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

const Shelves = () => {
  const [estanterias] = useState<Estanteria[]>([
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

  const [placedComponents, setPlacedComponents] = useState<ComponentData[]>([]);
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
          {component.type === 'valve' && <WaterValveControl />}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-7xl mx-auto p-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Control del Proyecto (nombre del proyecto)</h1>
          <button
            onClick={() => setIsPanelOpen(true)}
            className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 flex items-center gap-2"
          >
            <span>+</span>
            Agregar Componente
          </button>
        </div>

        {/* Área de trabajo con drag and drop */}
        <div
          className="p-4 mb-4"
          onDrop={handleDrop}
          onDragOver={handleDragOver}
        >
          {placedComponents.length === 0 ? (
            // Estado vacío
            <div className="flex flex-col items-center justify-center h-64 border-2 border-dashed border-purple-500 rounded-xl bg-gray-300">
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
                  className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 items-center gap-2"
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

        {/* Panel de componentes */}
        <ComponentPanel
          isOpen={isPanelOpen}
          onClose={() => setIsPanelOpen(false)}
          onAddComponent={handleAddComponent}
          allowedTypes={['valve']}
        />

        {/* Sección de tarjetas de estanterías */}
        <div className="p-4 flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3 mb-2">
            <div className="w-1 h-8 bg-gradient-to-b from-purple-600 to-pink-700 rounded-full"></div>
            Estanterías Disponibles</h1>

          <div className="flex gap-4">
            <button
              onClick={() => setShowCreateForm(true)}
              className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-xl font-bold transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 flex items-center gap-2"
            >
              <span className="text-lg">+</span>
              Nueva Estantería
            </button>
          </div>
        </div>

        {/* Modal de Creación */}
        <CreateEstanteriaModal
          isOpen={showCreateForm}
          onClose={() => setShowCreateForm(false)}
          onCreated={() => setShowCreateForm(false)}
        />

        {/* Tarjetas de estanterías */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 mb-6">
          {estanterias.map((estanteria) => (
            <ShelfCard
              key={estanteria.id}
              nombre={estanteria.nombre}
              proyectoNombre={estanteria.proyectoNombre}
              filasTotal={estanteria.filasTotal}
              filasUsadas={estanteria.filasUsadas}
              modulosActivos={estanteria.modulosActivos}
              status={estanteria.status}
              onDelete={() => console.log('Delete')}
              onEdit={() => console.log('Edit')}
              onView={() => console.log('View')}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Shelves;