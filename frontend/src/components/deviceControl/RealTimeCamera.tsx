import { useState } from 'react';
import {
    Camera, Maximize2, Mic, MicOff, Volume2, VolumeX,
    RefreshCw, Circle, ShieldAlert, ZoomIn
} from 'lucide-react';

const RealTimeCamera = () => {
    const [isLive] = useState(true);
    const [isMuted, setIsMuted] = useState(true);
    const [micActive, setMicActive] = useState(false);

    return (
        <div className="bg-slate-900 rounded-xl shadow-2xl p-3 border border-slate-800 h-[190px] w-full flex gap-3 overflow-hidden">

            {/* SECCIÓN DEL VIDEO (Visualizador) */}
            <div className="relative flex-1 bg-black rounded-lg overflow-hidden border border-slate-800 group">
                {/* Overlay Superior */}
                <div className="absolute top-2 left-2 right-2 flex justify-between items-start z-10">
                    <div className="flex items-center gap-2 bg-black/40 backdrop-blur-md px-2 py-1 rounded-md border border-white/10">
                        <Circle className={`fill-red-600 animate-pulse ${isLive ? 'text-red-600' : 'text-slate-500'}`} size={8} />
                        <span className="text-[10px] text-white font-bold uppercase tracking-widest">Live</span>
                    </div>
                    <span className="text-[9px] text-white/70 font-mono bg-black/20 px-1 rounded">
                        192.168.1.42 • 30 FPS
                    </span>
                </div>

                {/* Placeholder de Video (Aquí iría el <video> o <img> stream) */}
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-900 to-black">
                    <Camera size={32} className="text-slate-800" />
                </div>

                {/* Controles Flotantes sobre Video */}
                <div className="absolute bottom-2 right-2 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="p-1.5 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white rounded-md transition-colors">
                        <ZoomIn size={14} />
                    </button>
                    <button className="p-1.5 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white rounded-md transition-colors">
                        <Maximize2 size={14} />
                    </button>
                </div>
            </div>

            {/* PANEL DE CONTROL LATERAL (Sobrio) */}
            <div className="w-24 flex flex-col justify-between py-0.5">
                <div className="space-y-1.5">
                    <p className="text-[9px] font-bold text-slate-500 uppercase tracking-tighter">Audio</p>
                    <div className="grid grid-cols-2 gap-1">
                        <button
                            onClick={() => setIsMuted(!isMuted)}
                            className={`py-2 rounded-md flex justify-center transition-all border ${!isMuted ? 'bg-slate-700 border-slate-600 text-white' : 'bg-slate-800 border-slate-700 text-slate-500'}`}
                        >
                            {isMuted ? <VolumeX size={14} /> : <Volume2 size={14} />}
                        </button>
                        <button
                            onClick={() => setMicActive(!micActive)}
                            className={`py-2 rounded-md flex justify-center transition-all border ${micActive ? 'bg-blue-600 border-blue-500 text-white' : 'bg-slate-800 border-slate-700 text-slate-500'}`}
                        >
                            {micActive ? <Mic size={14} /> : <MicOff size={14} />}
                        </button>
                    </div>
                </div>

                <div className="space-y-1.5">
                    <p className="text-[9px] font-bold text-slate-500 uppercase tracking-tighter">Acción</p>
                    <button className="w-full py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-md flex items-center justify-center gap-1.5 transition-colors shadow-lg shadow-emerald-900/20">
                        <Camera size={12} />
                        <span className="text-[10px] font-bold uppercase">Foto</span>
                    </button>
                    <button className="w-full py-1.5 bg-slate-100 hover:bg-white text-slate-900 rounded-md flex items-center justify-center gap-1.5 transition-colors border border-slate-200">
                        <RefreshCw size={12} />
                        <span className="text-[10px] font-bold uppercase">Recon.</span>
                    </button>
                </div>

                <button className="w-full py-1 bg-red-900/20 text-red-500 hover:bg-red-900/40 rounded-md flex items-center justify-center gap-1 border border-red-900/30 transition-colors">
                    <ShieldAlert size={12} />
                    <span className="text-[9px] font-bold uppercase italic tracking-tighter">Pánico</span>
                </button>
            </div>
        </div>
    );
};

export default RealTimeCamera;