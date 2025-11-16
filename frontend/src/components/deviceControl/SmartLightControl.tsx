import React, { useState, useMemo, useEffect, useRef } from 'react';
import {
    Power, Plus, Minus, BarChart3, Download, RotateCcw,
    TrendingUp, TrendingDown, Settings, Lightbulb
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// --- FUNCIONES DE DATOS SIMULADOS ---
// NOTA: 'brillo' ahora representa el nivel de uso/actividad del sistema UV (0-100)
const generateHourlyData = () => {
    const data = [];
    const now = new Date();

    for (let i = 11; i >= 0; i--) {
        const hour = new Date(now);
        hour.setHours(hour.getHours() - i);

        // Nivel de USO (simulado)
        const baseLevel = 85; 
        const variation = Math.sin(i * 0.5) * 10 + Math.random() * 5;
        const currentLevel = baseLevel + variation;

        const previousLevel = i > 0 ? baseLevel + Math.sin((i - 1) * 0.5) * 10 : currentLevel;
        const trend = currentLevel > previousLevel ? 'up' : 'down';

        data.push({
            hora: hour.getHours().toString().padStart(2, '0') + ':00',
            uso: Number(currentLevel.toFixed(0)), // Nivel de uso (antes brillo)
            consumo: (Math.random() * 0.3 + 0.5).toFixed(2), // Consumo simulado en kWh (un poco más alto por ser UV)
            tendencia: trend
        });
    }
    return data;
};

const generateWeeklyData = () => {
    const data = [];
    const now = new Date();
    const days = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

    for (let i = 6; i >= 0; i--) {
        const date = new Date(now);
        date.setDate(date.getDate() - i);

        data.push({
            dia: days[date.getDay()],
            usoPromedio: Math.floor(Math.random() * 60) + 40, // Uso promedio (antes brilloPromedio)
            horasUso: Math.floor(Math.random() * 10) + 2,
            consumoTotal: (Math.random() * 3 + 1.0).toFixed(1) // Consumo total diario en kWh
        });
    }
    return data;
};

// --- COMPONENTE PRINCIPAL ---
const SmartLightControl = () => {
    const [isOn, setIsOn] = useState(false);
    const [isFlipped, setIsFlipped] = useState(false);
    const componentRef = useRef(null);

    const hourlyData = useMemo(() => generateHourlyData(), []);
    const [weeklyData, setWeeklyData] = useState(() => generateWeeklyData());

    // NOTA: Ya no necesitamos actualizar weeklyData basado en un estado de brillo, solo se inicializa.
    
    const exportToExcel = () => {
        const headers = ['Día', 'Uso Promedio (%)', 'Horas de Uso', 'Consumo Total (kWh)'];
        const csvContent = [
            headers.join(','),
            ...weeklyData.map(row => `${row.dia},${row.usoPromedio},${row.horasUso},${row.consumoTotal}`)
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `datos_luz_ultravioleta_7dias.csv`;
        link.click();
    };

    // Lógica para el gráfico (ahora basado en USO, no en brillo)
    const currentTrend = hourlyData[hourlyData.length - 1]?.tendencia || 'up';
    const chartLastLevel = hourlyData[hourlyData.length - 1]?.uso || 70;
    const chartPreviousLevel = hourlyData[hourlyData.length - 2]?.uso || chartLastLevel;
    const levelDifference = Number((chartLastLevel - chartPreviousLevel).toFixed(0));

    // Color fijo para UV (Morado/Fucsia)
    const uvColorClass = 'text-fuchsia-600';
    const uvBgClass = 'bg-fuchsia-100';


    return (
        <div className="bg-white rounded-xl shadow-lg p-3 border h-[190px] w-full overflow-hidden">
            <div ref={componentRef} className="w-full h-full perspective-1000">
                <div
                    className="relative w-full h-full transition-transform duration-700 preserve-3d"
                    style={{
                        transformStyle: 'preserve-3d',
                        transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)'
                    }}
                >
                    {/* LADO FRONTAL - CONTROL */}
                    <div className="absolute inset-0 backface-hidden">
                        {/* Adaptado a 2 columnas */}
                        <div className="grid grid-cols-2 gap-2 h-full">
                            
                            {/* IZQUIERDA - Botones y Stats (Ocupa 1/2) */}
                            <div className="flex flex-col justify-between p-1">
                                
                                {/* Información de la Luz - Arriba */}
                                <div className="flex flex-col items-center justify-center pt-2">
                                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${isOn ? uvBgClass : 'bg-gray-100'}`}>
                                        <Lightbulb className={isOn ? uvColorClass : 'text-gray-400'} size={20} fill={isOn ? uvColorClass : 'none'} />
                                    </div>
                                    <div className="text-center mt-2">
                                        <h2 className="text-gray-900 font-bold text-sm">Luz Ultravioleta</h2>
                                        <p className={`text-xs font-medium ${isOn ? 'text-green-600' : 'text-red-400'}`}>
                                            {isOn ? 'Encendida' : 'Apagada'}
                                        </p>
                                    </div>
                                </div>

                                {/* Botones de control - Abajo */}
                                <div className="space-y-1">
                                    <button
                                        onClick={() => setIsOn(!isOn)}
                                        className={`w-full py-2 rounded-lg font-semibold text-xs transition-all ${isOn
                                            ? 'bg-red-500 hover:bg-red-600 text-white'
                                            : 'bg-green-500 hover:bg-green-600 text-white'
                                            }`}
                                    >
                                        <div className="flex items-center justify-center gap-1">
                                            <Power size={14} />
                                            {isOn ? 'Apagar' : 'Encender'}
                                        </div>
                                    </button>

                                    <button
                                        onClick={() => setIsFlipped(true)}
                                        className="w-full py-2 rounded-lg font-semibold text-xs bg-blue-500 hover:bg-blue-600 text-white transition-all"
                                    >
                                        <div className="flex items-center justify-center gap-1">
                                            <BarChart3 size={14} />
                                            Estadísticas
                                        </div>
                                    </button>
                                </div>
                            </div>

                            {/* DERECHA - Indicador y Config (Ocupa 1/2) */}
                            <div className="flex flex-col items-center justify-between p-1 border-l border-gray-100">
                                {/* Botón de configuración - Arriba */}
                                <div className="flex items-center justify-between w-full">
                                    <div className="w-6"></div> {/* Espaciador */}
                                    <button
                                        onClick={() => console.log('Abrir configuración UV')}
                                        className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-colors"
                                        title="Configuración"
                                    >
                                        <Settings size={16} />
                                    </button>
                                </div>
                                
                                {/* Potencia Fija (Central) */}
                                <div className="text-center">
                                    <div className={`text-4xl font-bold ${isOn ? uvColorClass : 'text-gray-300'}`}>
                                        100%
                                    </div>
                                    <p className={`text-xs font-medium ${isOn ? 'text-gray-600' : 'text-gray-400'}`}>
                                        Potencia Fija
                                    </p>
                                </div>
                                
                                {/* Consumo Actual (Abajo) */}
                                <div className="bg-gray-50 rounded-lg px-2 py-1 border border-gray-200 flex flex-col items-center gap-1 mb-1">
                                    <p className="text-gray-500 text-xs font-medium">Consumo Actual</p>
                                    <div className={`text-sm font-bold ${isOn ? 'text-gray-800' : 'text-gray-400'}`}>
                                        {isOn ? '0.6 kWh/h' : '0.0 kWh/h'}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* LADO TRASERO - ESTADÍSTICAS */}
                    <div className="absolute inset-0 backface-hidden" style={{ transform: 'rotateY(180deg)' }}>
                        <div className="bg-white rounded-xl shadow-lg p-3 h-full border">
                            <div className="flex flex-col h-full">
                                {/* Header reorganizado para la luz UV */}
                                <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center gap-2">
                                        <div className={`w-7 h-7 rounded-lg ${uvBgClass} flex items-center justify-center`}>
                                            <BarChart3 className={uvColorClass} size={14} />
                                        </div>
                                        <div>
                                            <h3 className="text-gray-900 font-bold text-sm">Uso y Consumo UV</h3>
                                            <p className="text-gray-500 text-xs">Últimas 12h de Actividad</p>
                                        </div>
                                    </div>

                                    {/* Tendencias centrado */}
                                    <div className="bg-gray-50 rounded-lg px-3 py-1 border border-gray-200 flex items-center gap-2">
                                        <p className="text-gray-500 text-xs font-medium">Uso Reciente</p>
                                        <div className={`flex items-center gap-1 text-xs font-bold ${currentTrend === 'up' ? 'text-green-500' : 'text-red-500'}`}>
                                            {currentTrend === 'up' ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                                            {levelDifference > 0 ? '+' : ''}{levelDifference}%
                                        </div>
                                    </div>

                                    {/* Botones a la derecha */}
                                    <div className="flex gap-1">
                                        <button
                                            onClick={exportToExcel}
                                            className="px-2 py-1 rounded-lg bg-green-500 hover:bg-green-600 text-white text-xs font-semibold flex items-center gap-1"
                                        >
                                            <Download size={12} />
                                            Exportar
                                        </button>
                                        <button
                                            onClick={() => setIsFlipped(false)}
                                            className="px-2 py-1 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-900"
                                        >
                                            <RotateCcw size={14} />
                                        </button>
                                    </div>
                                </div>

                                {/* Gráfico de Uso UV */}
                                <div className="flex-1 bg-gray-50 rounded-lg p-2 border border-gray-200 overflow-hidden">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <LineChart data={hourlyData} margin={{ top: 5, right: 5, left: -25, bottom: 5 }}>
                                            <CartesianGrid strokeDasharray="2 2" stroke="#e5e7eb" />
                                            <XAxis dataKey="hora" stroke="#9ca3af" tick={{ fill: '#6b7280', fontSize: 9 }} />
                                            <YAxis 
                                                stroke="#9ca3af" 
                                                tick={{ fill: '#6b7280', fontSize: 9 }} 
                                                domain={[0, 100]} 
                                                tickFormatter={(value) => `${value}%`}
                                            />
                                            <Tooltip
                                                contentStyle={{
                                                    backgroundColor: '#fff',
                                                    border: '1px solid #e5e7eb',
                                                    borderRadius: '6px',
                                                    fontSize: '11px',
                                                }}
                                                formatter={(value) => [`${value}%`, 'Nivel de Uso']}
                                            />
                                            <Line
                                                type="monotone"
                                                dataKey="uso" // Usa 'uso' en lugar de 'brillo'
                                                stroke="#a855f7" // Morado para UV
                                                strokeWidth={2}
                                                dot={{ fill: '#a855f7', r: 1.5 }}
                                                activeDot={{ r: 3, fill: '#a855f7' }}
                                            />
                                        </LineChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* Se elimina el bloque <style> ya que no hay slider que estilizar */}
        </div>
    );
};

export default SmartLightControl;