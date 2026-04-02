// src/pages/Laboratory.tsx
import React, { useState } from 'react';
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

const Laboratory = () => {
  const [isPanelOpen, setIsPanelOpen] = useState(false);
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
    }
  ];

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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Laboratorio de Control</h1>
          <button
            onClick={() => setIsPanelOpen(true)}
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold transition-colors flex items-center gap-2"
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
            <div className="flex flex-col items-center justify-center h-64 border-2 border-dashed border-gray-300 rounded-xl bg-gray-200">
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
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
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
        />

        {/* Sección de tarjetas de laboratorios */}
        <div className="p-4">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Modulos Disponibles</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 mb-6">
            {labRooms.map((lab) => (
              <LabRoomCard
                key={lab.id}
                nombre={lab.nombre}
                dispositivosConectados={lab.dispositivosConectados}
                temperatura={lab.temperatura}
                modulosActivos={lab.modulosActivos}
                status={lab.status}
              />
            ))}
          </div>
        </div>
      </div>



    </div>


  );
};

export default Laboratory;