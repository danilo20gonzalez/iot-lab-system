// Interfaces para los usuarios
export interface User {
    id: number;
    name: string;
    username: string;
    password: string;
    email: string;
    role: 'admin' | 'user';
    status: 'active' | 'inactive';
    createdAt: string;
    lastLogin?: string;
  }
  
  export type UserRole = 'admin' | 'user';
  export type UserStatus = 'active' | 'inactive';

  // Interfaces para los laboratorios
  export interface Lab {
    id: number;
    name: string;
    devices: number;
    status: "activo" | "alerta" | "mantenimiento";
    temperature: number;
    humidity: number;
  }