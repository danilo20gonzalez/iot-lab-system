import React, { useState, useRef, useMemo, useEffect } from 'react';
import {
    Power, Plus, Minus, Wind, Snowflake, BarChart3, Download, RotateCcw,
    TrendingUp, TrendingDown, Settings
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// Generación de datos
const generateHourlyData = () => {
    const data = [];
    const now = new Date();

    for (let i = 11; i >= 0; i--) {
        const hour = new Date(now);
        hour.setHours(hour.getHours() - i);

        const baseTemp = 22;
        const variation = Math.sin(i * 0.5) * 2 + Math.random() * 1.5;
        const currentTemp = baseTemp + variation;

        const previousTemp = i > 0 ? baseTemp + Math.sin((i - 1) * 0.5) * 2 : currentTemp;
        const trend = currentTemp > previousTemp ? 'up' : 'down';

        data.push({
            hora: hour.getHours().toString().padStart(2, '0') + ':00',
            temperatura: Number(currentTemp.toFixed(1)),
            calidad: Math.floor(Math.random() * 40) + 60,
            humedad: Math.floor(Math.random() * 30) + 40,
            tendencia: trend
        });
    }
    return data;
};

const generateWeeklyData = (currentTemp: number) => {
    const data = [];
    const now = new Date();

    for (let i = 6; i >= 0; i--) {
        const date = new Date(now);
        date.setDate(date.getDate() - i);

        const isToday = i === 0;
        const tempValue = isToday ? currentTemp : Math.floor(Math.random() * 5) + 22;

        data.push({
            fecha: date.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit' }),
            temperatura: tempValue,
            horasUso: Math.floor(Math.random() * 8) + 4,
            consumo: (Math.random() * 4 + 2).toFixed(1)
        });
    }
    return data;
};

const AirConditionerControl = () => {
    const [isOn, setIsOn] = useState(false);
    const [temperature, setTemperature] = useState(20);
    const [fanSpeed, setFanSpeed] = useState('medium');
    const [isFlipped, setIsFlipped] = useState(false);
    const componentRef = useRef(null);

    const hourlyData = useMemo(() => generateHourlyData(), []);
    const [weeklyData, setWeeklyData] = useState(() => generateWeeklyData(temperature));

    useEffect(() => {
        setWeeklyData(generateWeeklyData(temperature));
    }, [temperature]);

    const handleTemperatureUp = () => {
        if (isOn && temperature < 30) setTemperature(prev => prev + 1);
    };

    const handleTemperatureDown = () => {
        if (isOn && temperature > 16) setTemperature(prev => prev - 1);
    };

    const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (isOn) setTemperature(parseInt(e.target.value));
    };

    const cycleFanSpeed = () => {
        if (!isOn) return;
        if (fanSpeed === 'low') setFanSpeed('medium');
        else if (fanSpeed === 'medium') setFanSpeed('high');
        else setFanSpeed('low');
    };

    const getFanSpeedText = () => fanSpeed === 'low' ? 'Bajo' : fanSpeed === 'medium' ? 'Medio' : 'Alto';

    const exportToExcel = () => {
        const headers = ['Fecha', 'Temperatura (°C)', 'Horas de Uso', 'Consumo (kWh)'];
        const csvContent = [
            headers.join(','),
            ...weeklyData.map(row => `${row.fecha},${row.temperatura},${row.horasUso},${row.consumo}`)
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `datos_aire_acondicionado_7dias.csv`;
        link.click();
    };

    const currentTrend = hourlyData[hourlyData.length - 1]?.tendencia || 'up';
    const chartLastTemp = hourlyData[hourlyData.length - 1]?.temperatura || temperature;
    const chartPreviousTemp = hourlyData[hourlyData.length - 2]?.temperatura || chartLastTemp;
    const tempDifference = Number((chartLastTemp - chartPreviousTemp).toFixed(1));

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
                    {/* LADO FRONTAL */}
                    <div className="absolute inset-0 backface-hidden">
                        <div className="grid grid-cols-3 gap-0 h-full">
                            {/* IZQUIERDA - CORREGIDA */}
                            <div className="flex flex-col justify-between">
                                {/* Fila superior con botón de configuración y info del A/C */}
                                <div className="flex items-center justify-between mb-2">
                                    {/* Botón de configuración a la izquierda */}
                                    <button
                                        onClick={() => console.log('Abrir configuración')}
                                        className="w-6 h-6 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-colors"
                                        title="Configuración"
                                    >
                                        <Settings size={14} />
                                    </button>
                                    
                                    {/* Información del A/C centrada */}
                                    <div className="flex items-center gap-2">
                                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${isOn ? 'bg-blue-500' : 'bg-gray-200'}`}>
                                            <Snowflake className={`${isOn ? 'text-white' : 'text-gray-400'}`} size={16} />
                                        </div>
                                        <div className="text-center">
                                            <h2 className="text-gray-900 font-bold text-sm">A/C</h2>
                                            <p className={`text-xs font-medium ${isOn ? 'text-green-600' : 'text-red-400'}`}>
                                                {isOn ? 'Encendido' : 'Apagado'}
                                            </p>
                                        </div>
                                    </div>
                                    
                                    {/* Espacio vacío para balancear */}
                                    <div className="w-6"></div>
                                </div>

                                {/* Botones de control (se mantienen igual) */}
                                <div className="space-y-1">
                                    <button
                                        onClick={() => setIsOn(!isOn)}
                                        className={`w-full py-1.5 rounded-lg font-semibold text-xs transition-all ${isOn
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
                                        onClick={cycleFanSpeed}
                                        disabled={!isOn}
                                        className={`w-full py-1.5 rounded-lg font-semibold text-xs ${isOn
                                            ? 'bg-gray-100 hover:bg-gray-200 text-gray-900'
                                            : 'bg-gray-50 text-gray-300 cursor-not-allowed'
                                            }`}
                                    >
                                        <div className="flex items-center justify-center gap-1">
                                            <Wind size={14} />
                                            {getFanSpeedText()}
                                        </div>
                                    </button>

                                    <button
                                        onClick={() => setIsFlipped(true)}
                                        className="w-full py-1.5 rounded-lg font-semibold text-xs bg-blue-500 hover:bg-blue-600 text-white transition-all"
                                    >
                                        <div className="flex items-center justify-center gap-1">
                                            <BarChart3 size={14} />
                                            Estadísticas
                                        </div>
                                    </button>
                                </div>
                            </div>

                            {/* CENTRO */}
                            <div className="flex flex-col items-center justify-center">
                                <div className={`text-4xl font-bold ${isOn ? 'text-gray-900' : 'text-gray-300'}`}>
                                    {temperature}°
                                </div>
                                <p className={`text-xs font-medium mt-1 ${isOn ? 'text-gray-600' : 'text-gray-400'}`}>
                                    Temperatura
                                </p>
                            </div>

                            {/* DERECHA */}
                            <div className="flex flex-col justify-center gap-2">
                                <button
                                    onClick={handleTemperatureUp}
                                    disabled={!isOn || temperature >= 30}
                                    className={`w-full py-2 rounded-lg flex items-center justify-center ${isOn && temperature < 30
                                        ? 'bg-gray-100 hover:bg-gray-200 text-gray-900'
                                        : 'bg-gray-50 text-gray-300 cursor-not-allowed'
                                        }`}
                                >
                                    <Plus size={18} />
                                </button>

                                <div className="px-1">
                                    <input
                                        type="range"
                                        min="16"
                                        max="30"
                                        value={temperature}
                                        onChange={handleSliderChange}
                                        disabled={!isOn}
                                        className="w-full h-1.5 rounded-full appearance-none cursor-pointer"
                                        style={{
                                            background: isOn
                                                ? `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${((temperature - 16) / 14) * 100}%, #e5e7eb ${((temperature - 16) / 14) * 100}%, #e5e7eb 100%)`
                                                : '#e5e7eb'
                                        }}
                                    />
                                    <div className="flex justify-between mt-1 text-xs text-gray-500 font-medium">
                                        <span>16°</span>
                                        <span>30°</span>
                                    </div>
                                </div>

                                <button
                                    onClick={handleTemperatureDown}
                                    disabled={!isOn || temperature <= 16}
                                    className={`w-full py-2 rounded-lg flex items-center justify-center ${isOn && temperature > 16
                                        ? 'bg-gray-100 hover:bg-gray-200 text-gray-900'
                                        : 'bg-gray-50 text-gray-300 cursor-not-allowed'
                                        }`}
                                >
                                    <Minus size={18} />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* LADO TRASERO */}
                    <div className="absolute inset-0 backface-hidden" style={{ transform: 'rotateY(180deg)' }}>
                        <div className="bg-white rounded-xl shadow-lg p-3 h-full border">
                            <div className="flex flex-col h-full">
                                {/* Header reorganizado */}
                                <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center gap-2">
                                        <div className="w-7 h-7 rounded-lg bg-blue-500 flex items-center justify-center">
                                            <BarChart3 className="text-white" size={14} />
                                        </div>
                                        <div>
                                            <h3 className="text-gray-900 font-bold text-sm">Análisis</h3>
                                            <p className="text-gray-500 text-xs">Últimas 12h</p>
                                        </div>
                                    </div>

                                    {/* Tendencias centrado */}
                                    <div className="bg-gray-50 rounded-lg px-3 py-1 border border-gray-200 flex items-center gap-2">
                                        <p className="text-gray-500 text-xs font-medium">Tendencia</p>
                                        <div className={`flex items-center gap-1 text-xs font-bold ${currentTrend === 'up' ? 'text-red-500' : 'text-green-500'}`}>
                                            {currentTrend === 'up' ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                                            {tempDifference > 0 ? '+' : ''}{tempDifference}°C
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

                                {/* Gráfico que ocupa todo el ancho */}
                                <div className="flex-1 bg-gray-50 rounded-lg p-2 border border-gray-200 overflow-hidden">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <LineChart data={hourlyData} margin={{ top: 5, right: 5, left: -25, bottom: 5 }}>
                                            <CartesianGrid strokeDasharray="2 2" stroke="#e5e7eb" />
                                            <XAxis dataKey="hora" stroke="#9ca3af" tick={{ fill: '#6b7280', fontSize: 9 }} />
                                            <YAxis stroke="#9ca3af" tick={{ fill: '#6b7280', fontSize: 9 }} domain={['dataMin - 1', 'dataMax + 1']} />
                                            <Tooltip
                                                contentStyle={{
                                                    backgroundColor: '#fff',
                                                    border: '1px solid #e5e7eb',
                                                    borderRadius: '6px',
                                                    fontSize: '11px',
                                                }}
                                                formatter={(value) => [`${value}°C`, 'Temperatura']}
                                            />
                                            <Line
                                                type="monotone"
                                                dataKey="temperatura"
                                                stroke="#3b82f6"
                                                strokeWidth={2}
                                                dot={{ fill: '#3b82f6', r: 1.5 }}
                                                activeDot={{ r: 3, fill: '#3b82f6' }}
                                            />
                                        </LineChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
                .preserve-3d { transform-style: preserve-3d; }
                .backface-hidden { backface-visibility: hidden; }
                .perspective-1000 { perspective: 1000px; }
                input[type="range"]::-webkit-slider-thumb {
                    appearance: none;
                    width: 14px;
                    height: 14px;
                    border-radius: 50%;
                    background: #3b82f6;
                    cursor: pointer;
                    border: 2px solid white;
                    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
                }
                input[type="range"]::-moz-range-thumb {
                    width: 14px;
                    height: 14px;
                    border-radius: 50%;
                    background: #3b82f6;
                    cursor: pointer;
                    border: 2px solid white;
                    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
                }
                input[type="range"]:disabled::-webkit-slider-thumb,
                input[type="range"]:disabled::-moz-range-thumb {
                    background: #d1d5db;
                    box-shadow: none;
                }
            `}</style>
        </div>
    );
};

export default AirConditionerControl;