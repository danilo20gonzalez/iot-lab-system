// src/types/components.ts
export interface DraggableComponent {
    id: string;
    name: string;
    type: 'air-conditioner' | 'camera' | 'light' | 'valve';
    icon: string;
    description?: string;
  }