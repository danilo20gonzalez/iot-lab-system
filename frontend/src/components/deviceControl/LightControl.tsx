import { Power, Settings, BarChart3, RotateCcw, Zap } from 'lucide-react';
import { useState } from 'react';

const LightControlSimple = () => {
    const [isOn, setIsOn] = useState(true);
    const [isFlipped, setIsFlipped] = useState(false);

    return (
        <div className="w-64 h-36 group">
            <div className="w-full h-full perspective-1000">
                <div
                    className="relative w-full h-full transition-all duration-700 preserve-3d shadow-xl rounded-2xl"
                    style={{
                        transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)'
                    }}
                >
                    {/* FRONT - CONTROL */}
                    <div className="absolute inset-0 backface-hidden bg-white rounded-2xl p-3 flex flex-col justify-between border border-gray-100">
                        <div className="flex justify-between items-start">
                            <div>
                                <h2 className="text-gray-800 font-bold text-xs tracking-tight">Sala Principal</h2>
                                <p className="text-[9px] text-gray-400 uppercase tracking-wider font-medium">Iluminación</p>
                            </div>
                            <button className="text-gray-300 hover:text-indigo-500 transition-colors">
                                <Settings size={14} />
                            </button>
                        </div>

                        <div className="flex flex-col items-center justify-center -mt-1">
                            <div
                                className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-500 shadow-md
                ${isOn
                                        ? 'bg-yellow-400 shadow-yellow-100'
                                        : 'bg-gray-100 shadow-none'}`}
                            >
                                <Power className={isOn ? 'text-white' : 'text-gray-400'} size={18} />
                            </div>
                            <span className={`text-[10px] mt-1 font-bold uppercase tracking-widest ${isOn ? 'text-yellow-600' : 'text-gray-400'}`}>
                                {isOn ? 'On' : 'Off'}
                            </span>
                        </div>

                        <div className="flex gap-2 mt-1">
                            <button
                                onClick={() => setIsOn(!isOn)}
                                className={`flex-[3] py-1.5 text-xs font-semibold rounded-lg transition-all
                ${isOn
                                        ? 'bg-gray-900 text-white hover:bg-black'
                                        : 'bg-indigo-600 text-white hover:bg-indigo-700'}`}
                            >
                                {isOn ? 'Apagar' : 'Encender'}
                            </button>
                            <button
                                onClick={() => setIsFlipped(true)}
                                className="flex-1 flex items-center justify-center bg-gray-50 text-gray-500 rounded-lg hover:bg-gray-100 border border-gray-100 transition-colors"
                            >
                                <BarChart3 size={14} />
                            </button>
                        </div>
                    </div>

                    {/* BACK - ESTADÍSTICAS */}
                    <div
                        className="absolute inset-0 backface-hidden bg-indigo-600 rounded-2xl p-3 flex flex-col text-white"
                        style={{ transform: 'rotateY(180deg)' }}
                    >
                        <div className="flex justify-between items-center mb-2">
                            <div className="flex items-center gap-1.5">
                                <Zap size={12} className="text-yellow-300 fill-yellow-300" />
                                <h3 className="text-xs font-bold tracking-tight">Consumo</h3>
                            </div>
                            <button
                                onClick={() => setIsFlipped(false)}
                                className="bg-white/10 p-1 rounded-md hover:bg-white/20 transition-colors"
                            >
                                <RotateCcw size={12} />
                            </button>
                        </div>

                        <div className="space-y-2 flex-1 flex flex-col justify-center">
                            {/* Stat 1 */}
                            <div>
                                <div className="flex justify-between text-[9px] mb-0.5 opacity-80 font-medium">
                                    <span>Hoy</span>
                                    <span>1.2 kWh</span>
                                </div>
                                <div className="w-full bg-white/20 h-1.5 rounded-full overflow-hidden">
                                    <div className="bg-yellow-300 h-full w-3/4 rounded-full" />
                                </div>
                            </div>
                            {/* Stat 2 */}
                            <div>
                                <div className="flex justify-between text-[9px] mb-0.5 opacity-80 font-medium">
                                    <span>Mes</span>
                                    <span>24.5 kWh</span>
                                </div>
                                <div className="w-full bg-white/20 h-1.5 rounded-full overflow-hidden">
                                    <div className="bg-white h-full w-1/2 rounded-full" />
                                </div>
                            </div>

                            <p className="text-[8px] text-center text-indigo-200 mt-1 italic">
                                -12% vs mes anterior
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
        .preserve-3d { transform-style: preserve-3d; }
        .backface-hidden { backface-visibility: hidden; }
        .perspective-1000 { perspective: 1000px; }
      `}</style>
        </div>
    );
};

export default LightControlSimple;