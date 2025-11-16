// src/pages/Laboratory.tsx
import React, { useState, useRef, useEffect } from 'react';
import Navbar from "../components/Navbar";
import ComponentPanel from "../components/ComponentPanel";
import AirConditionerControl from "../components/deviceControl/AirConditionerControl";
import SmartLightControl from "../components/deviceControl/SmartLightControl";
import { useComponentContext } from "../components/ComponentContext";
import type { ComponentData } from "../components/ComponentContext";
import { ReactSortable } from 'react-sortablejs';
import LabRoomCard from '../components/LabRoomCard';

const Laboratory = () => {
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const { laboratoryComponents, addComponent, removeComponent, updateComponentOrder } = useComponentContext();

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
    switch (component.type) {
      case 'air-conditioner':
        return (
          <div className="h-48">
            <AirConditionerControl />
          </div>
        );
      case 'light':
        return (
          <div className="h-48">
            <SmartLightControl />
          </div>
        );
      case 'camera':
        return (
          <div key={component.id} className="bg-white rounded-xl shadow-lg p-4 border h-48 flex flex-col">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                <span className="text-xl">📷</span>
              </div>
              <div>
                <h3 className="font-bold text-gray-900 text-sm">Cámara de Seguridad</h3>
                <p className="text-xs text-gray-500">Entrada Principal</p>
              </div>
            </div>
            <div className="bg-gray-200 rounded-lg h-24 flex-1 flex items-center justify-center text-gray-500 text-xs">
              Vista en vivo
            </div>
          </div>
        );
      case 'valve':
        return (
          <div key={component.id} className="bg-white rounded-xl shadow-lg p-4 border h-48 flex flex-col justify-between">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                <span className="text-xl">🚰</span>
              </div>
              <div>
                <h3 className="font-bold text-gray-900 text-sm">Válvula de Agua</h3>
                <p className="text-xs text-gray-500">Sistema Principal</p>
              </div>
            </div>
            <button className="w-full py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-semibold transition-colors text-sm">
              Abrir Válvula
            </button>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />

      {/* Header del Laboratory */}
      <div className="bg-white border-b border-gray-200 px-6 py-2">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Laboratorio de Control</h1>
          <button
            onClick={() => setIsPanelOpen(true)}
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold transition-colors flex items-center gap-2"
          >
            <span>+</span>
            Agregar Componente
          </button>
        </div>
      </div>

      {/* Área de trabajo con drag and drop */}
      <div
        className="p-4 mb-4"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        {laboratoryComponents.length === 0 ? (
          // Estado vacío
          <div className="flex flex-col items-center justify-center h-64 border-2 border-dashed border-gray-300 rounded-xl bg-gray-50">
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


  );
};

export default Laboratory;