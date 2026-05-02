// src/pages/Laboratory.tsx
import React, { useState, useEffect, useCallback } from 'react';
import Navbar from "../components/Navbar";
import ComponentPanel from "../components/ComponentPanel";
import AirConditionerControl from "../components/deviceControl/AirConditionerControl";
import LightControl from "../components/deviceControl/LightControl";
import RealTimeCamera from "../components/deviceControl/RealTimeCamera";
import WaterValveControl from "../components/deviceControl/WaterValveControl";
import { useAppContext } from "../context/AppContext";
import type { ComponentData } from "../context/AppContext";
import { ReactSortable } from 'react-sortablejs';
import LabRoomCard from '../components/LabRoomCard';
import CreateSalaModal from '../modals/CreateSalaModal';
import api from '../api/api';

const Laboratory = () => {
  const [isPanelOpen, setIsPanelOpen] = useState(false);
<<<<<<< HEAD
  const [isSalaModalOpen, setIsSalaModalOpen] = useState(false);
  const { laboratoryComponents, addComponent, updateComponentOrder, removeComponent } = useAppContext();

  // Estado para laboratorios desde la API
  const [labs, setLabs] = useState<Array<{
    id: number;
    nombre: string;
    descripcion: string;
    estado: string;
    sensors?: { id: string; type: string; name: string }[];
  }>>([]);
  const [editingRoom, setEditingRoom] = useState<any>(null);

  const fetchLabs = useCallback(async () => {
    const mockLab = {
      id: 9999,
      nombre: "Módulo de Pruebas (Ejemplo)",
      descripcion: "Módulo de ejemplo para visualizar y probar la edición de sensores.",
      estado: "Activo",
      estadoId: "1",
      sensors: [
        { id: "temp-1", type: "temperature", name: "Temperatura" },
        { id: "hum-1", type: "humidity", name: "Humedad" }
      ]
    };

    try {
      const res = await api.get('/getLaboratorios');
      // Asegurarse de que el mock no se duplique y aparezca junto con los datos reales
      const data = res.data.filter((l: any) => l.id !== 9999);
      setLabs([mockLab, ...data]);
    } catch (error) {
      console.error('Error al cargar laboratorios:', error);
      setLabs([mockLab]);
=======
  const { laboratoryComponents, addComponent, updateComponentOrder, removeComponent } = useAppContext();

  // Datos de ejemplo para las tarjetas de laboratorio
  const labRooms = [
    {
      id: 'lab-1',
      nombre: 'Laboratorio Principal',
      dispositivosConectados: 12,
      temperatura: 23,
      modulosActivos: 8,
      status: "activo" as const
    },
    {
      id: 'lab-2',
      nombre: 'Sala de Control',
      dispositivosConectados: 6,
      temperatura: 21,
      modulosActivos: 4,
      status: "activo" as const
    },
    {
      id: 'lab-3',
      nombre: 'Laboratorio Secundario',
      dispositivosConectados: 3,
      temperatura: 25,
      modulosActivos: 2,
      status: "alerta" as const
>>>>>>> ebc5e5cd8aa7b8819459376b236d66fb81aa6023
    }
  }, []);

  useEffect(() => {
    fetchLabs();
  }, [fetchLabs]);

  // Mapear el estado de la BD a los valores que espera LabRoomCard
  const mapEstado = (estado: string): "activo" | "inactivo" | "alerta" => {
    const lower = estado.toLowerCase();
    if (lower === 'activo') return 'activo';
    if (lower === 'inactivo') return 'inactivo';
    if (lower === 'mantenimiento') return 'alerta';
    return 'activo';
  };

  const handleEditSala = (sala: any) => {
    setEditingRoom(sala);
    setIsSalaModalOpen(true);
  };

  const handleDeleteSala = async (id: number) => {
    if (window.confirm('¿Estás seguro de eliminar este módulo?')) {
      try {
        await api.delete(`/deleteSala/${id}`); // Ajustar ruta
        setLabs(prev => prev.filter(lab => lab.id !== id));
      } catch (error) {
        console.error('Error al eliminar sala:', error);
      }
    }
  };

  const handleSaveSala = async (salaData: any) => {
    try {
      if (editingRoom) {
        if (editingRoom.id === 9999) {
          // Actualización simulada para el módulo de ejemplo
          setLabs(prev => prev.map(lab => lab.id === editingRoom.id ? {
            ...lab,
            ...salaData,
            nombre: salaData.nombre,
            estado: salaData.estadoId === '1' ? 'Activo' : salaData.estadoId === '2' ? 'Mantenimiento' : 'Inactivo'
          } : lab));
        } else {
          await api.put(`/updateSala/${editingRoom.id}`, salaData);
          setLabs(prev => prev.map(lab => lab.id === editingRoom.id ? { ...lab, ...salaData } : lab));
        }
      } else {
        const response = await api.post('/createSala', salaData);
        setLabs(prev => [...prev, { ...response.data.sala, sensors: salaData.sensors || [] }]);
      }
      setIsSalaModalOpen(false);
      setEditingRoom(null);
    } catch (error) {
      console.error('Error al guardar sala:', error);
    }
  };

  // Manejar drop de componentes
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();

    try {
      const componentData = JSON.parse(e.dataTransfer.getData('application/json'));
      addComponent(componentData);
    } catch (error) {
      console.error('Error al procesar el componente:', error);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
  };

  // Renderizar componente basado en el tipo
  const renderComponent = (component: ComponentData) => {
    return (
      <div className="relative group h-full">
        {/* Botón de eliminar (Aparece al hacer hover) */}
        <button
          onClick={() => removeComponent(component.id)} // <--- Aquí usamos tu función del context
          className="absolute -top-2 -right-2 z-50 bg-red-500 hover:bg-red-700 text-white w-6 h-6 rounded-full flex items-center justify-center shadow-md opacity-0 group-hover:opacity-100 transition-all duration-200"
          title="Eliminar dispositivo"
        >
          <span className="text-xs font-bold">✕</span>
        </button>

        {/* Renderizado dinámico del componente */}
        <div className="h-48">
          {component.type === 'air-conditioner' && <AirConditionerControl />}
          {component.type === 'light' && <LightControl />}
          {component.type === 'camera' && <RealTimeCamera />}
          {component.type === 'valve' && <WaterValveControl />}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-7xl mx-auto p-6" style={{ zoom: 0.8 }}>
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-3xl font-bold text-gray-900">Control del Laboratorio (nombre del laboratorio)</h1>
          <button
            onClick={() => setIsPanelOpen(true)}
            className="bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white px-6 py-2 rounded-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 flex items-center gap-2 cursor-pointer"
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
          {laboratoryComponents.length === 0 ? (
            // Estado vacío
            <div className="flex flex-col items-center justify-center h-64 border-2 border-dashed border-emerald-500 rounded-xl bg-gray-300 ">
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
                  className="bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white px-4 py-2 rounded-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 items-center gap-2 cursor-pointer"
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
                list={laboratoryComponents}
                setList={updateComponentOrder}
                animation={200}
                delayOnTouchOnly={true}
                delay={100}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mb-6"
              >
                {laboratoryComponents.map((component) => (
                  <div key={component.id} className="cursor-move">
                    {renderComponent(component)}
                  </div>
                ))}
              </ReactSortable>
            </div>
          )}
        </div>

        {/* Sección de tarjetas de laboratorios */}
        <div className="p-4 flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3 mb-2">
            <div className="w-1 h-8 bg-gradient-to-b from-emerald-600 to-green-700 rounded-full"></div>
            Módulos Disponibles</h1>

          <div className="flex gap-4">
            <button
              onClick={() => {
                setEditingRoom(null);
                setIsSalaModalOpen(true);
              }}
              className="bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white px-6 py-3 rounded-xl font-bold transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 flex items-center gap-2 cursor-pointer"
            >
              <span className="text-lg">+</span>
              Nuevo Módulo
            </button>
          </div>
        </div>


        {/* Tarjetas de Módulos */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 mb-6">
          {labs.length > 0 ? (
            labs.map((lab) => (
              <LabRoomCard
                key={lab.id}
                nombre={lab.nombre}
                modulosActivos={0}
                status={mapEstado(lab.estado)}
                sensors={lab.sensors || []}
                onEdit={() => handleEditSala(lab)}
                onDelete={() => handleDeleteSala(lab.id)}
              />
            ))
          ) : (
            <div className="col-span-2 flex flex-col items-center justify-center py-16 border-2 border-dashed border-gray-300 rounded-2xl bg-gray-50">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mb-4">
                <span className="text-3xl">🏠</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-700 mb-1">No hay módulos registrados</h3>
              <p className="text-sm text-gray-500 mb-4">Crea tu primer módulo para comenzar</p>
              <button
                onClick={() => {
                  setEditingRoom(null);
                  setIsSalaModalOpen(true);
                }}
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 flex items-center gap-2 cursor-pointer"
              >
                <span>+</span> Crear Módulo
              </button>
            </div>
          )}
        </div>

      </div >

      {/* Modales reubicados fuera del zoom */}
      <ComponentPanel
        isOpen={isPanelOpen}
        onClose={() => setIsPanelOpen(false)}
        allowedTypes={['air-conditioner', 'camera', 'light']}
      />

      <CreateSalaModal
        isOpen={isSalaModalOpen}
        onClose={() => {
          setIsSalaModalOpen(false);
          setEditingRoom(null);
        }}
        onSave={handleSaveSala}
        editingRoom={editingRoom ? {
          nombre: editingRoom.nombre,
          descripcion: editingRoom.descripcion,
          estadoId: editingRoom.estadoId || (editingRoom.estado === 'Activo' ? '1' : '3'),
          sensors: editingRoom.sensors || []
        } : null}
      />
    </div >


  );
};

export default Laboratory;