import React, { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';

export interface ComponentData {
  id: string;
  name: string;
  type: string;
  icon: string;
  description: string;
  props?: any;
}

interface ComponentContextType {
  laboratoryComponents: ComponentData[];
  addComponent: (component: ComponentData) => void;
  removeComponent: (id: string) => void;
  updateComponentOrder: (components: ComponentData[]) => void;
}

const ComponentContext = createContext<ComponentContextType | undefined>(undefined);

export const ComponentProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [laboratoryComponents, setLaboratoryComponents] = useState<ComponentData[]>([]);

  const addComponent = (component: ComponentData) => {
    setLaboratoryComponents(prev => [...prev, { ...component, id: `${component.type}-${Date.now()}` }]);
  };

  const removeComponent = (id: string) => {
    setLaboratoryComponents(prev => prev.filter(comp => comp.id !== id));
  };

  const updateComponentOrder = (components: ComponentData[]) => {
    setLaboratoryComponents(components);
  };

  return (
    <ComponentContext.Provider value={{
      laboratoryComponents,
      addComponent,
      removeComponent,
      updateComponentOrder
    }}>
      {children}
    </ComponentContext.Provider>
  );
};

export const useComponentContext = () => {
  const context = useContext(ComponentContext);
  if (!context) {
    throw new Error('useComponentContext must be used within a ComponentProvider');
  }
  return context;
};