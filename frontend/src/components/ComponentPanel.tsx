import React from 'react';
import { X, Wind, Lightbulb, Camera, Droplets } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

interface ComponentPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onAddComponent?: (component: typeof availableComponents[0]) => void;
  allowedTypes?: string[];
}

const availableComponents = [
  {
    type: 'air-conditioner',
    name: 'Aire Acondicionado',
    description: 'Control de temperatura y ventilación',
    icon: Wind,
    color: 'bg-cyan-500',
  },
  {
    type: 'light',
    name: 'Control de Luces',
    description: 'Encender/apagar iluminación',
    icon: Lightbulb,
    color: 'bg-yellow-500',
  },
  {
    type: 'camera',
    name: 'Cámara de Seguridad',
    description: 'Vista en vivo del laboratorio',
    icon: Camera,
    color: 'bg-green-500',
  },
  {
    type: 'valve',
    name: 'Válvula de Agua',
    description: 'Control del sistema hidráulico',
    icon: Droplets,
    color: 'bg-blue-500',
  },
];

export default function ComponentPanel({ isOpen, onClose, onAddComponent, allowedTypes }: ComponentPanelProps) {
  const { addComponent } = useAppContext();

  const filteredComponents = allowedTypes
    ? availableComponents.filter(c => allowedTypes.includes(c.type))
    : availableComponents;

  const handleDragStart = (e: React.DragEvent, component: typeof availableComponents[0]) => {
    e.dataTransfer.setData('application/json', JSON.stringify({
      type: component.type,
      name: component.name,
    }));
    e.dataTransfer.effectAllowed = 'copy';
  };

  const handleAddComponent = (component: typeof availableComponents[0]) => {
    if (onAddComponent) {
      onAddComponent(component);
    } else {
      addComponent({
        type: component.type,
        name: component.name,
      });
    }
  };

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-40 backdrop-blur-sm"
          onClick={onClose}
        ></div>
      )}

      {/* Panel lateral */}
      <div
        className={`fixed top-0 right-0 h-full w-80 bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
      >
        {/* Header del panel */}
        <div className="flex justify-between items-center p-5 border-b border-gray-200 bg-gray-50">
          <div>
            <h2 className="text-lg font-bold text-gray-900">Componentes</h2>
            <p className="text-xs text-gray-500">Arrastra o haz clic para agregar</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
          >
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        {/* Lista de componentes */}
        <div className="p-4 space-y-3 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 80px)' }}>
          {filteredComponents.map((component) => (
            <div
              key={component.type}
              draggable
              onDragStart={(e) => handleDragStart(e, component)}
              onClick={() => handleAddComponent(component)}
              className="flex items-center gap-3 p-4 bg-gray-50 hover:bg-gray-100 rounded-xl border border-gray-200 hover:border-emerald-300 cursor-pointer transition-all duration-200 hover:shadow-md group"
            >
              <div className={`w-10 h-10 ${component.color} rounded-lg flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-200`}>
                <component.icon size={20} className="text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-900 text-sm">{component.name}</h3>
                <p className="text-xs text-gray-500 truncate">{component.description}</p>
              </div>
              <div className="text-gray-300 group-hover:text-emerald-500 transition-colors">
                <span className="text-lg font-bold">+</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}