// context/AppContext.tsx
import { createContext, useContext, useState, type ReactNode } from 'react';

// Tipos definidos
interface User { username: string; fk_id_rol: number; }
export interface ComponentData {
    id: string;
    type: string;
    name?: string;
    [key: string]: unknown; // Permitir props adicionales
}

interface AppContextType {
    user: User | null;
    login: (userData: User) => void;
    logout: () => void;
    // Funciones de componentes
    laboratoryComponents: ComponentData[];
    addComponent: (component: { type: string; name?: string; [key: string]: unknown }) => void;
    removeComponent: (id: string) => void;
    updateComponentOrder: (list: ComponentData[]) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
    // Estado de Auth
    const [user, setUser] = useState(() => {
        const savedUser = localStorage.getItem('user');
        return savedUser ? JSON.parse(savedUser) : null;
    });

    // Estado de Componentes
    const [laboratoryComponents, setLaboratoryComponents] = useState<ComponentData[]>([]);

    const login = (userData: User) => {
        localStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);
    };

    const logout = () => {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        setUser(null);
    };

    const addComponent = (comp: { type: string; name?: string; [key: string]: unknown }) => {
        const newComponent: ComponentData = {
            ...comp,
            id: (comp.id as string) || `${comp.type}-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
            type: comp.type,
        };
        setLaboratoryComponents(prev => [...prev, newComponent]);
    };

    const removeComponent = (id: string) => setLaboratoryComponents(prev => prev.filter(c => c.id !== id));
    const updateComponentOrder = (list: ComponentData[]) => setLaboratoryComponents(list);

    return (
        <AppContext.Provider value={{ user, login, logout, laboratoryComponents, addComponent, removeComponent, updateComponentOrder }}>
            {children}
        </AppContext.Provider>
    );
};

export const useAppContext = () => {
    const context = useContext(AppContext);
    if (!context) throw new Error('useAppContext debe usarse dentro de un AppProvider');
    return context;
};