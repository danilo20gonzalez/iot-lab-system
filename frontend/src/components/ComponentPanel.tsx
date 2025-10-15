// src/components/ComponentPanel/ComponentPanel.tsx
import React, { useState } from 'react';
import type { DraggableComponent } from '../types/DraggableComponent';

// Datos de ejemplo para los componentes
const availableComponents: DraggableComponent[] = [
  {
    id: 'ac-1',
    name: 'Aire Acondicionado',
    type: 'air-conditioner',
    icon: '❄️',
    description: 'Control de temperatura'
  },
  {
    id: 'cam-1',
    name: 'Cámara de Seguridad',
    type: 'camera',
    icon: '📷',
    description: 'Monitoreo visual'
  },
  {
    id: 'light-1',
    name: 'Control de Luces',
    type: 'light',
    icon: '💡',
    description: 'Encendido/Apagado'
  },
  {
    id: 'valve-1',
    name: 'Válvula de Agua',
    type: 'valve',
    icon: '🚰',
    description: 'Control de flujo'
  }
];

interface ComponentPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const ComponentPanel: React.FC<ComponentPanelProps> = ({ isOpen, onClose }) => {
  const [isDragging, setIsDragging] = useState(false);

  // Manejar el inicio del arrastre
  const handleDragStart = (e: React.DragEvent, component: DraggableComponent) => {
    e.dataTransfer.setData('application/json', JSON.stringify(component));
    e.dataTransfer.effectAllowed = 'copy';
    
    // Marcar que estamos arrastrando
    setIsDragging(true);
    
    // Efecto visual durante el arrastre
    const target = e.target as HTMLElement;
    target.classList.add('opacity-50', 'border-blue-500');
  };

  const handleDragEnd = (e: React.DragEvent) => {
    // Resetear el estado de arrastre
    setIsDragging(false);
    
    const target = e.target as HTMLElement;
    target.classList.remove('opacity-50', 'border-blue-500');
  };

  // Manejar el click en el overlay - no cerrar si estamos arrastrando
  const handleOverlayClick = () => {
    if (!isDragging) {
      onClose();
    }
    // Resetear el estado de arrastre después del click
    setIsDragging(false);
  };

  // Cerrar panel al presionar Escape
  React.useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  return (
    <>
      {/* Overlay para cerrar al hacer click fuera */}
      {isOpen && !isDragging && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={handleOverlayClick}
        />
      )}
      
      {/* Panel de componentes */}
      <div className={`
        fixed right-0 top-0 h-full w-80 bg-gray-900 border-l border-gray-700 shadow-2xl
        transform transition-transform duration-300 ease-in-out z-50
        flex flex-col
        ${isOpen ? 'translate-x-0' : 'translate-x-full'}
      `}>
        {/* Header del panel */}
        <div className="flex justify-between items-center p-6 bg-gray-800 border-b border-gray-700">
          <h2 className="text-xl font-semibold text-white">Componentes Disponibles</h2>
          <button 
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-700 transition-colors text-white"
            onClick={onClose}
            aria-label="Cerrar panel"
          >
            <span className="text-lg">✕</span>
          </button>
        </div>

        {/* Lista de componentes */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {availableComponents.map((component) => (
            <div
              key={component.id}
              className="flex items-center p-4 bg-gray-800 border border-gray-600 rounded-lg cursor-grab 
                         hover:border-blue-400 hover:shadow-lg transition-all duration-200
                         active:cursor-grabbing active:bg-gray-700 group select-none"
              draggable
              onDragStart={(e) => handleDragStart(e, component)}
              onDragEnd={handleDragEnd}
            >
              {/* Icono del componente */}
              <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center bg-blue-500 rounded-lg mr-4 group-hover:bg-blue-400 transition-colors">
                <span className="text-2xl">{component.icon}</span>
              </div>
              
              {/* Información del componente */}
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-white truncate">
                  {component.name}
                </div>
                <div className="text-xs text-gray-400 truncate">
                  {component.description}
                </div>
              </div>
              
              {/* Indicador de arrastre */}
              <div className="flex-shrink-0 text-gray-500 text-lg ml-2 group-hover:text-gray-300">
                ⋮⋮
              </div>
            </div>
          ))}
        </div>

        {/* Mensaje de ayuda */}
        <div className="p-4 bg-blue-900 border-t border-blue-700">
          <p className="text-sm text-blue-200 flex items-center">
            <span className="text-lg mr-2">💡</span>
            Arrastra los componentes al área de trabajo
          </p>
        </div>
      </div>
    </>
  );
};

export default ComponentPanel;