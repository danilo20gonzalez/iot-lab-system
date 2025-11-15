// components/SummaryCard.tsx
import type { LucideIcon } from 'lucide-react';

interface SummaryCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: LucideIcon;
  trend?: 'up' | 'down' | 'stable';
}

export default function SummaryCard({ 
  title, 
  value, 
  subtitle, 
  icon: Icon, 
  trend 
}: SummaryCardProps) {
  const trendIcons = {
    up: '↗',
    down: '↘',
    stable: '→'
  };

  const trendColors = {
    up: 'text-green-500',
    down: 'text-red-500',
    stable: 'text-gray-400'
  };

  return (
    <div 
      className="bg-white p-4 rounded-lg border border-[#367c29] hover:shadow-md transition-all duration-200 cursor-pointer relative"
      style={{ boxShadow: '0 2px 8px rgba(54, 124, 41, 0.08)' }}
    >
      {/* Icono y trend en esquina superior derecha */}
      <div className="flex justify-between items-start mb-2">
        {Icon && (
          <div className="w-10 h-10 bg-[#367c29] bg-opacity-10 rounded-lg flex items-center justify-center">
            <Icon size={20} style={{ color: '#367c29' }} />
          </div>
        )}
        {trend && (
          <span className={`text-lg font-bold ${trendColors[trend]}`}>
            {trendIcons[trend]}
          </span>
        )}
      </div>

      {/* Contenido principal */}
      <div className="mt-2">
        <p className="text-gray-600 text-xs font-medium mb-1 uppercase tracking-wide">
          {title}
        </p>
        <h2 
          className="text-xl font-bold mb-1"
          style={{ color: '#367c29' }}
        >
          {value}
        </h2>
        {subtitle && (
          <p className="text-gray-500 text-xs font-medium">
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
}