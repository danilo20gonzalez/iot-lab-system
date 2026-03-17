// types/index.ts

export interface User {
  id_usuario: number;
  nombre_completo: string;
  username: string;
  password: string;
  email: string;
  fk_id_rol: number;
  estado: 'activo' | 'inactivo';
  created_at: string;
}

// Estos tipos ayudan para validaciones en formularios
export type UserRoleID = 1 | 2; // 1: admin, 2: operador
export type UserStatus = 'activo' | 'inactivo';

// Interfaces para los laboratorios
export interface Lab {
  id: number;
  name: string;
  devices: number;
  status: "activo" | "alerta" | "mantenimiento";
  temperature: number;
  humidity: number;
}