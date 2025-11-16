import { Bell, AlertTriangle, CheckCircle, Activity } from "lucide-react";

interface Alert {
  id: number;
  message: string;
  time: string;
  type: "warning" | "success" | "info";
}

interface AlertsPanelProps {
  alerts: Alert[];
}

export default function AlertsPanel({ alerts }: AlertsPanelProps) {
  return (
    <div className="bg-white rounded-2xl border-1 border-[#367c29] hover:border-gray-200 shadow-sm hover:shadow-xl transition-all duration-300 p-6 space-y-5 relative overflow-hidden">
      {/* Decorative gradient overlay */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r" style={{background: 'linear-gradient(90deg, #267e1b 0%, #427a35 50%, #004e00 100%)'}}></div>

      {/* Header */}
      <div className="flex justify-between items-center">
        <h3 className="flex items-center gap-3 font-bold text-xl text-gray-800">
          <div className="w-10 h-10 bg-gradient-to-br rounded-xl flex items-center justify-center border-2" style={{background: 'linear-gradient(135deg, #427a35 0%, #267e1b 100%)', borderColor: '#267e1b'}}>
            <Bell className="text-white" size={20} />
          </div>
          Alertas
        </h3>
        <div className="px-3 py-1 bg-gray-100 rounded-full border border-gray-200">
          <span className="text-sm font-semibold text-gray-700">{alerts.length} en total</span>
        </div>
      </div>

      {/* Lista de alertas */}
      <div className="space-y-3 max-h-100 overflow-y-auto custom-scrollbar">
        {alerts.map((alert) => (
          <div
            key={alert.id}
            className={`flex items-start gap-4 p-4 rounded-xl border-2 transition-all duration-200 hover:shadow-md ${
              alert.type === "warning"
                ? "bg-gradient-to-r from-yellow-50 to-amber-50 border-yellow-200 hover:border-yellow-300"
                : alert.type === "success"
                ? "bg-gradient-to-r from-green-50 to-emerald-50 border-green-200 hover:border-green-300"
                : "bg-gradient-to-r from-blue-50 to-cyan-50 border-blue-200 hover:border-blue-300"
            }`}
          >
            <div className={`p-2 rounded-lg border-2 ${
              alert.type === "warning"
                ? "bg-yellow-100 border-yellow-300"
                : alert.type === "success"
                ? "bg-green-100 border-green-300"
                : "bg-blue-100 border-blue-300"
            }`}>
              {alert.type === "warning" ? (
                <AlertTriangle className="text-yellow-600" size={18} />
              ) : alert.type === "success" ? (
                <CheckCircle className="text-green-600" size={18} />
              ) : (
                <Activity className="text-blue-600" size={18} />
              )}
            </div>

            <div className="flex-1">
              <p className="text-sm font-medium text-gray-800 leading-relaxed">{alert.message}</p>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full border border-gray-200">
                  {alert.time}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div
        className="w-full text-center py-3 px-4 rounded-xl cursor-pointer transition-all duration-300 border-2 font-semibold text-white"
        style={{
          background: 'linear-gradient(135deg, #267e1b 0%, #427a35 50%, #004e00 100%)',
          borderColor: '#267e1b',
          boxShadow: '0 2px 10px rgba(38, 126, 27, 0.2)'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = 'linear-gradient(135deg, #1e6b14 0%, #3a6b2d 50%, #003d00 100%)';
          e.currentTarget.style.boxShadow = '0 4px 15px rgba(38, 126, 27, 0.3)';
          e.currentTarget.style.transform = 'translateY(-1px)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'linear-gradient(135deg, #267e1b 0%, #427a35 50%, #004e00 100%)';
          e.currentTarget.style.boxShadow = '0 2px 10px rgba(38, 126, 27, 0.2)';
          e.currentTarget.style.transform = 'translateY(0)';
        }}
      >
        Ver todas las alertas
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f5f9;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #267e1b;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #1e6b14;
        }
      `}</style>
    </div>
  );
}