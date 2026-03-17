// context/AppContext.tsx
import { createContext, useContext, useState, type ReactNode } from 'react';

// Tipos definidos (traídos de tu antiguo ComponentContext)
interface User { username: string; fk_id_rol: number; }
export interface ComponentData { id: string; type: string; /* ... tus otras props */ }

interface AppContextType {
    user: User | null;
    login: (userData: User) => void;
    logout: () => void;
    // Funciones de componentes ahora aquí
    laboratoryComponents: ComponentData[];
    addComponent: (component: ComponentData) => void;
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

    // Estado de Componentes (antes en ComponentContext)
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

    const addComponent = (comp: ComponentData) => setLaboratoryComponents([...laboratoryComponents, comp]);
    const removeComponent = (id: string) => setLaboratoryComponents(laboratoryComponents.filter(c => c.id !== id));
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