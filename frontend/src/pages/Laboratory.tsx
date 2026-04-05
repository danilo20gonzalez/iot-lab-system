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
  const [isSalaModalOpen, setIsSalaModalOpen] = useState(false);
  const { laboratoryComponents, addComponent, updateComponentOrder, removeComponent } = useAppContext();

  // Estado para laboratorios desde la API
  const [labs, setLabs] = useState<Array<{
    id: number;
    nombre: string;
    descripcion: string;
    estado: string;
  }>>([]);

  const fetchLabs = useCallback(async () => {
    try {
      const res = await api.get('/getLaboratorios');
      setLabs(res.data);
    } catch (error) {
      console.error('Error al cargar laboratorios:', error);
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

      <div className="max-w-7xl mx-auto p-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Control del Laboratorio (nombre del laboratorio)</h1>
          <button
            onClick={() => setIsPanelOpen(true)}
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 flex items-center gap-2"
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
                  className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 items-center gap-2"
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

        {/* Panel de componentes */}
        <ComponentPanel
          isOpen={isPanelOpen}
          onClose={() => setIsPanelOpen(false)}
          allowedTypes={['air-conditioner', 'camera', 'light']}
        />

        {/* Sección de tarjetas de laboratorios */}
        <div className="p-4 flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3 mb-2">
            <div className="w-1 h-8 bg-gradient-to-b from-emerald-600 to-green-700 rounded-full"></div>
            Módulos Disponibles</h1>

          <div className="flex gap-4">
            <button
              onClick={() => setIsSalaModalOpen(true)}
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-xl font-bold transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 flex items-center gap-2"
            >
              <span className="text-lg">+</span>
              Nuevo Módulo
            </button>
          </div>
        </div>


        {/* Tarjetas de ejemplo (TEMPORAL - borrar después) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 mb-6">
          <LabRoomCard
            nombre="Módulo Principal"
            dispositivosConectados={12}
            temperatura={23}
            modulosActivos={8}
            status="activo"
            onEdit={() => console.log('Editar Módulo Principal')}
            onDelete={() => console.log('Eliminar Módulo Principal')}
          />
          <LabRoomCard
            nombre="Módulo de Control"
            dispositivosConectados={6}
            temperatura={21}
            modulosActivos={4}
            status="activo"
            onEdit={() => console.log('Editar Módulo de Control')}
            onDelete={() => console.log('Eliminar Módulo de Control')}
          />
        </div>

        {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 mb-6">
          {labs.length > 0 ? (
            labs.map((lab) => (
              <LabRoomCard
                key={lab.id}
                nombre={lab.nombre}
                dispositivosConectados={0}
                temperatura={22}
                modulosActivos={0}
                status={mapEstado(lab.estado)}
                onEdit={() => console.log('Editar lab', lab.id)}
                onDelete={() => console.log('Eliminar lab', lab.id)}
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
                onClick={() => setIsSalaModalOpen(true)}
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 flex items-center gap-2"
              >
                <span>+</span> Crear Módulo
              </button>
            </div>
          )}
        </div> */}

        {/* Modal para crear nuevo módulo */}
        <CreateSalaModal
          isOpen={isSalaModalOpen}
          onClose={() => setIsSalaModalOpen(false)}
          onCreated={fetchLabs}
        />
      </div >



    </div >


  );
};

export default Laboratory;