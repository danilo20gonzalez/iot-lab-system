import { useState, useRef, useEffect } from 'react';
import {
    Camera, Maximize2,
    RefreshCw, Circle, ShieldAlert, ZoomIn, Play, Square
} from 'lucide-react';
import { apiUrl } from '../../../config';

const RealTimeCamera = () => {
    const [isPlaying, setIsPlaying] = useState(false);

    const [hasError, setHasError] = useState(false);
    const [imageSrc, setImageSrc] = useState(`${apiUrl}/api/camera/camera.192_168_1_18`);
    const [isZoomed, setIsZoomed] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    const handleFullscreen = () => {
        if (containerRef.current) {
            if (document.fullscreenElement) {
                document.exitFullscreen();
            } else {
                containerRef.current.requestFullscreen().catch(err => {
                    console.error("Error al intentar pantalla completa:", err);
                });
            }
        }
    };

    const handleReconnect = () => {
        setHasError(false);
        if (!isPlaying) setIsPlaying(true);
    };

    useEffect(() => {
        let objectUrl: string | null = null;
        let isSubscribed = true;
        let timeoutId: NodeJS.Timeout;

        const fetchFrame = async () => {
            if (!isPlaying || hasError) return;
            try {
                const response = await fetch(`${apiUrl}/api/camera/camera.192_168_1_18?t=${Date.now()}`);
                if (!response.ok) throw new Error("Network error");

                const blob = await response.blob();
                const newObjectUrl = URL.createObjectURL(blob);

                if (isSubscribed) {
                    setImageSrc(newObjectUrl);
                    if (objectUrl) URL.revokeObjectURL(objectUrl);
                    objectUrl = newObjectUrl;
                    setHasError(false);
                    // Llama al siguiente frame en 200ms (5 FPS) para mantener fluidez sin saturar el servidor
                    timeoutId = setTimeout(fetchFrame, 200);
                } else {
                    URL.revokeObjectURL(newObjectUrl);
                }
            } catch (error) {
                if (isSubscribed) setHasError(true);
            }
        };

        if (!hasError && isPlaying) {
            fetchFrame();
        }

        return () => {
            isSubscribed = false;
            clearTimeout(timeoutId);
            if (objectUrl) URL.revokeObjectURL(objectUrl);
        };
    }, [hasError, isPlaying]);

    const handleTakePhoto = () => {
        if (!imageSrc || !isPlaying) return;
        const link = document.createElement('a');
        link.href = imageSrc;
        link.download = `captura_camara_${new Date().getTime()}.jpg`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="bg-slate-900 rounded-xl shadow-2xl p-3 border border-slate-800 h-[190px] w-full flex gap-3 overflow-hidden">
            {/* SECCIÓN DEL VIDEO (Visualizador) */}
            <div ref={containerRef} className="relative flex-1 bg-black rounded-lg overflow-hidden border border-slate-800 group">
                {/* Overlay Superior */}
                <div className="absolute top-2 left-2 right-2 flex justify-between items-start z-10">
                    <div className="flex items-center gap-2 bg-black/40 backdrop-blur-md px-2 py-1 rounded-md border border-white/10">
                        <Circle className={`fill-red-600 ${isPlaying ? 'animate-pulse text-red-600' : 'text-slate-500'}`} size={8} />
                        <span className="text-[10px] text-white font-bold uppercase tracking-widest">{isPlaying ? 'Live' : 'Standby'}</span>
                    </div>
                    <span className="text-[9px] text-white/70 font-mono bg-black/20 px-1 rounded">
                        192.168.1.18
                    </span>
                </div>

                {/* Placeholder de Video (Aquí iría el <video> o <img> stream) */}
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-900 to-black relative overflow-hidden">
                    {!hasError ? (
                        <img
                            src={imageSrc}
                            alt="Camera Stream"
                            className={`w-full h-full object-cover transition-transform duration-500 ${isZoomed ? 'scale-150' : 'scale-100'} ${isPlaying ? '' : 'opacity-30 grayscale blur-sm'}`}
                            onError={() => setHasError(true)}
                        />
                    ) : (
                        <div className="flex flex-col items-center justify-center text-slate-500 z-10">
                            <Camera size={32} className="mb-2" />
                            <span className="text-[10px] uppercase font-bold tracking-widest text-red-500/80">Sin conexión</span>
                        </div>
                    )}
                    <Camera size={32} className="text-slate-800 absolute -z-10" />

                    {!isPlaying && !hasError && (
                        <button
                            onClick={() => setIsPlaying(true)}
                            className="absolute z-20 flex flex-col items-center justify-center bg-emerald-600/90 hover:bg-emerald-500 text-white rounded-full w-14 h-14 transition-transform hover:scale-110 shadow-lg shadow-emerald-900/50 backdrop-blur-sm"
                        >
                            <Play fill="currentColor" size={20} className="ml-1" />
                        </button>
                    )}
                </div>

                {/* Controles Flotantes sobre Video */}
                <div className="absolute bottom-2 right-2 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                        onClick={() => setIsZoomed(!isZoomed)}
                        className={`p-1.5 backdrop-blur-md text-white rounded-md transition-colors ${isZoomed ? 'bg-blue-600/80 hover:bg-blue-600' : 'bg-white/10 hover:bg-white/20'}`}>
                        <ZoomIn size={14} />
                    </button>
                    <button
                        onClick={handleFullscreen}
                        className="p-1.5 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white rounded-md transition-colors">
                        <Maximize2 size={14} />
                    </button>
                </div>
            </div>

            {/* PANEL DE CONTROL LATERAL (Sobrio) */}
            <div className="w-24 flex flex-col justify-between py-0.5">
                <div className="space-y-1.5">
                    <p className="text-[9px] font-bold text-slate-500 uppercase tracking-tighter">Acción</p>
                    <button
                        onClick={handleTakePhoto}
                        className="w-full py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-md flex items-center justify-center gap-1.5 transition-colors shadow-lg shadow-emerald-900/20">
                        <Camera size={12} />
                        <span className="text-[10px] font-bold uppercase">Foto</span>
                    </button>
                    <button
                        onClick={() => setIsPlaying(!isPlaying)}
                        className={`w-full py-1.5 rounded-md flex items-center justify-center gap-1.5 transition-colors border ${isPlaying ? 'bg-red-500/20 text-red-500 hover:bg-red-500/30 border-red-500/30' : 'bg-slate-100 hover:bg-white text-slate-900 border-slate-200'}`}>
                        {isPlaying ? <Square fill="currentColor" size={10} /> : <Play fill="currentColor" size={10} />}
                        <span className="text-[10px] font-bold uppercase">{isPlaying ? 'Detener' : 'Ver'}</span>
                    </button>
                    <button
                        onClick={handleReconnect}
                        className="w-full py-1.5 bg-slate-100 hover:bg-white text-slate-900 rounded-md flex items-center justify-center gap-1.5 transition-colors border border-slate-200">
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