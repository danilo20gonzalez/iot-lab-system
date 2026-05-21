import { useState, useEffect, useCallback } from "react";
import Navbar from "../components/Navbar";
import ShelfCard from "../components/ShelfCard";
import ComponentPanel from "../components/ComponentPanel";
import WaterValveControl from "../components/deviceControl/WaterValveControl";
import { ReactSortable } from 'react-sortablejs';
import type { ComponentData } from "../context/AppContext";
import CreateEstanteriaModal from '../modals/CreateEstanteriaModal';
import { useParams, useLocation } from "react-router-dom";
import api from "../api/api";

interface Estanteria {
  id: number;
  nombre: string;
  descripcion: string;
  status: "active" | "maintenance" | "inactive";
  sensors?: { id: string; type: string; name: string }[];
}

const Shelves = () => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const [estanterias, setEstanterias] = useState<Estanteria[]>([]);
  const projectState = location.state as { nombre?: string; descripcion?: string; id?: number } | undefined;
  const projectName = projectState?.nombre || "Proyecto";
  const [placedComponents, setPlacedComponents] = useState<ComponentData[]>([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [editingEstanteria, setEditingEstanteria] = useState<Estanteria | null>(null);

  // Cargar espacios de trabajo del backend
  const fetchEspaciosTrabajo = useCallback(async () => {
    if (!id) return;
    try {
      const res = await api.get(`/getEspaciosTrabajo/${id}`);
      const data = res.data.map((e: any) => ({
        id: e.ID_ESPACIO_TRABAJO || e.id,
        nombre: e.NOMBRE_ESPACIO_TRABAJO  || e.nombre,
        descripcion: e.DESCRIPCION_ESPACIO_TRABAJO  || e.descripcion,
        status: "active" as const,
        sensors: e.sensors || []
      }));
      setEstanterias(data);
      console.log('Espacios de trabajo cargados:', data);
    } catch (error) {
      console.error('Error al cargar espacios de trabajo:', error);
      setEstanterias([]);
    }
  }, [id]);

  useEffect(() => {
    fetchEspaciosTrabajo();
  }, [fetchEspaciosTrabajo]);

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

  const handleSaveEstanteria = async (data: any) => {
    if (!id) {
      alert('Error: ID del proyecto no encontrado');
      return;
    }

    try {
      const payload = {
        idproyecto: id,
        nombre: data.nombre,
        descripcion: data.descripcion
      };

      if (editingEstanteria && editingEstanteria.id !== 9999) {
        // Modo edición
        await api.put(`/updateEspacioTrabajo/${editingEstanteria.id}`, payload);
        setEstanterias(prev => prev.map(e => e.id === editingEstanteria.id ? {
          ...e,
          nombre: data.nombre,
          descripcion: data.descripcion,
        } : e));
      } else {
        // Modo creación
        const res = await api.post('/createEspacioTrabajo', payload);
        const newEst: Estanteria = {
          id: res.data.espacioTrabajo?.id || Date.now(),
          nombre: data.nombre,
          descripcion: data.descripcion,
          status: "active",
          sensors: []
        };
        setEstanterias(prev => [...prev, newEst]);
      }

      setShowCreateForm(false);
      setEditingEstanteria(null);
      console.log('Espacio de trabajo guardado exitosamente');
    } catch (error) {
      console.error('Error al guardar espacio de trabajo:', error);
      alert('Hubo un error al guardar el espacio de trabajo. Por favor, verifica la conexión.');
    }
  };

  const handleEditEstanteria = (estanteria: Estanteria) => {
    setEditingEstanteria(estanteria);
    setShowCreateForm(true);
  };

  const handleDeleteEstanteria = (estanteriaId: number) => {
    if (window.confirm("¿Estás seguro de eliminar este espacio de trabajo?")) {
      (async () => {
        try {
          await api.delete(`/deleteEspacioTrabajo/${estanteriaId}`);
          setEstanterias(prev => prev.filter(e => e.id !== estanteriaId));
          console.log('Espacio de trabajo eliminado exitosamente');
        } catch (error) {
          console.error('Error al eliminar espacio de trabajo:', error);
          alert('Error al eliminar el espacio de trabajo');
        }
      })();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-7xl mx-auto p-6" style={{ zoom: 0.8 }}>
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-3xl font-bold text-gray-900">Espacios de Trabajo {projectName}</h1>
          <button
            onClick={() => setIsPanelOpen(true)}
            className="bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-800 hover:to-gray-900 text-white px-6 py-2 rounded-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 flex items-center gap-2 cursor-pointer"
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
            <div className="flex flex-col items-center justify-center h-64 border-2 border-dashed border-gray-700 rounded-xl bg-gray-300">
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
                  className="bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-800 hover:to-gray-900 text-white px-4 py-2 rounded-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 items-center gap-2 cursor-pointer"
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

        {/* Sección de tarjetas de estanterías */}
        <div className="p-4 flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
            <div className="w-1 h-8 bg-gradient-to-b from-gray-700 to-gray-800 rounded-full"></div>
            Estanterías Disponibles
          </h1>

          <div className="flex gap-4">
            <button
              onClick={() => {
                setEditingEstanteria(null);
                setShowCreateForm(true);
              }}
              className="bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-800 hover:to-gray-900 text-white px-6 py-3 rounded-xl font-bold transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 flex items-center gap-2 cursor-pointer"
            >
              <span className="text-lg">+</span>
              Nueva Estantería
            </button>
          </div>
        </div>

        {/* Tarjetas de estanterías */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 mb-6">
          {estanterias.length === 0 ? (
            <div className="col-span-full text-center py-8">
              <p className="text-gray-500">No hay espacios de trabajo creados</p>
            </div>
          ) : (
            estanterias.map((estanteria) => (
              <ShelfCard
                key={estanteria.id}
                nombre={estanteria.nombre}
                status={estanteria.status}
                sensors={estanteria.sensors}
                onDelete={() => handleDeleteEstanteria(estanteria.id)}
                onEdit={() => handleEditEstanteria(estanteria)}
              />
            ))
          )}
        </div>
      </div>

      <ComponentPanel
        isOpen={isPanelOpen}
        onClose={() => setIsPanelOpen(false)}
        onAddComponent={handleAddComponent}
        allowedTypes={['valve']}
      />

      <CreateEstanteriaModal
        isOpen={showCreateForm}
        onClose={() => {
          setShowCreateForm(false);
          setEditingEstanteria(null);
        }}
        onSave={handleSaveEstanteria}
        editingEstanteria={editingEstanteria}
      />
    </div>
  );
};

export default Shelves;
