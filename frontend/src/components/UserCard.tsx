import { Edit2, Trash2, Mail, User, Calendar } from 'lucide-react';
import type { User as UserType } from '../types/index';

interface UserCardProps {
  user: UserType;
  onEdit: (user: UserType) => void;
  onDelete: (userId: number) => void;
}

export default function UserCard({ user, onEdit, onDelete }: UserCardProps) {
  const getRoleConfig = (role: string) => {
    switch (role) {
      case 'admin':
        return {
          bg: 'bg-red-100',
          text: 'text-red-800',
          border: 'border-red-200'
        };
      case 'moderator':
        return {
          bg: 'bg-blue-100',
          text: 'text-blue-800',
          border: 'border-blue-200'
        };
      default:
        return {
          bg: 'bg-gray-100',
          text: 'text-gray-800',
          border: 'border-gray-200'
        };
    }
  };

  const getStatusConfig = (status: string) => {
    return status === 'active' 
      ? { bg: 'bg-green-100', text: 'text-green-800', dot: 'bg-green-500' }
      : { bg: 'bg-gray-100', text: 'text-gray-800', dot: 'bg-gray-500' };
  };

  const roleConfig = getRoleConfig(user.role);
  const statusConfig = getStatusConfig(user.status);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES');
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 hover:border-gray-300 shadow-sm hover:shadow-md transition-all duration-300 p-6">
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 text-lg">{user.name}</h3>
            <div className="flex items-center gap-2 mt-1">
              <div className={`px-2 py-1 rounded-full text-xs font-medium ${roleConfig.bg} ${roleConfig.text} ${roleConfig.border}`}>
                {user.role}
              </div>
              <div className={`px-2 py-1 rounded-full text-xs font-medium ${statusConfig.bg} ${statusConfig.text} flex items-center gap-1`}>
                <div className={`w-1.5 h-1.5 rounded-full ${statusConfig.dot}`}></div>
                {user.status}
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={() => onEdit(user)}
            className="w-8 h-8 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center transition-colors duration-200"
            title="Editar usuario"
          >
            <Edit2 size={16} />
          </button>
          <button
            onClick={() => onDelete(user.id)}
            className="w-8 h-8 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg flex items-center justify-center transition-colors duration-200"
            title="Eliminar usuario"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      {/* Info */}
      <div className="space-y-3">
        <div className="flex items-center gap-3 text-sm text-gray-600">
          <Mail size={16} className="text-gray-400" />
          <span>{user.email}</span>
        </div>
        
        <div className="flex items-center gap-3 text-sm text-gray-600">
          <Calendar size={16} className="text-gray-400" />
          <span>Creado: {formatDate(user.createdAt)}</span>
        </div>

        {user.lastLogin && (
          <div className="flex items-center gap-3 text-sm text-gray-600">
            <User size={16} className="text-gray-400" />
            <span>Último login: {formatDate(user.lastLogin)}</span>
          </div>
        )}
      </div>
    </div>
  );
}