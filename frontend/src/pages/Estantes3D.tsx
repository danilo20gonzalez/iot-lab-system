import { useState, useRef, useEffect, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Text, Html } from '@react-three/drei';
import * as THREE from 'three';
import { Droplet } from 'react-feather';
import {
  Building2,
  Plus,
  Settings,
  Eye,
  Edit3,
  Trash2,
  Layers,
  Zap,
  ZapOff,
  Home,
  Mail,
  Cpu,
  Bell
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

// ----------------------------------------------------------------
// #region INTERFACES
// ----------------------------------------------------------------

interface Estante3D {
  id: number;
  nombre: string;
  numero: string;
  estado: 'activo' | 'mantenimiento' | 'inactivo';
  filas: Fila3D[];
  posicion: [number, number, number];
  rotacion: [number, number, number];
  dimensiones: { ancho: number; alto: number; profundidad: number };
}

interface Fila3D {
  id: number;
  numero: number;
  tipoCultivo: string;
  luzEncendida: boolean;
  riegoActivo: boolean;
}

type ModoType = 'monitoreo' | 'edicion' | 'configuracion';

interface CameraFocusProps {
  targetPosition: [number, number, number] | null;
  active: boolean;
}

// #endregion

// ----------------------------------------------------------------
// #region COMPONENTES 3D
// ----------------------------------------------------------------

/**
 * Hook/Componente para enfocar la cámara en una posición objetivo.
 */
function CameraFocus({ targetPosition, active }: CameraFocusProps) {
  const { camera, controls: orbitControls } = useThree();
  const controls = orbitControls as any;

  useFrame((state, delta) => {
    if (active && targetPosition && controls) {
      const targetVec = new THREE.Vector3(...targetPosition);

      // Posición de la cámara: ligeramente por encima y en frente del objetivo.
      const cameraTargetPos = targetVec.clone().add(new THREE.Vector3(0, 1.5, 3));

      // Mover la cámara y el punto de control (target) suavemente
      camera.position.lerp(cameraTargetPos, 3 * delta);
      controls.target.lerp(targetVec, 3 * delta);
      controls.update();
    }
  });

  return null;
}

// Componente 3D de Fila
function FilaModel({ fila, posicion, onDelete, onFilaClick, material, estanteId, isSelected }: {
  fila: Fila3D;
  posicion: [number, number, number];
  estanteId: number;
  onDelete: (estanteId: number, filaId: number) => void;
  onFilaClick: (filaId: number) => void;
  material: THREE.Material;
  isSelected: boolean;
}) {

  // **INICIO DE LA CORRECCIÓN DE LA LUZ**
  // Aseguramos que la luz se configure solo una vez, si es necesario.
  const lightColor = useMemo(() => new THREE.Color('#ffeb3b'), []);

  return (
    <group
      position={posicion}
      onClick={(e) => {
        e.stopPropagation();
        onFilaClick(fila.id);
      }}
    >
      {/* Representación de la bandeja de cultivo */}
      <mesh>
        <boxGeometry args={[1.6, 0.05, 0.4]} />
        <primitive object={material} attach="material" />
      </mesh>

      {/* Borde de selección */}
      {isSelected && (
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[1.65, 0.08, 0.45]} />
          {/* Usamos MeshBasicMaterial transparente y sin wireframe para un efecto de resaltado suave */}
          <meshBasicMaterial color="#3b82f6" transparent opacity={0.3} />
        </mesh>
      )}

      {/* Cinta de luz LED sobre la fila */}
      <mesh position={[0, 0.15, 0]}>
        <boxGeometry args={[1.6, 0.02, 0.06]} />
        <meshStandardMaterial
          color={fila.luzEncendida ? lightColor.clone().multiplyScalar(0.5) : '#424242'} // Color base de la cinta
          emissive={fila.luzEncendida ? lightColor : '#000000'} // Emisión de luz si está encendida
          emissiveIntensity={fila.luzEncendida ? 0.8 : 0} // Intensidad de la emisión
        />
      </mesh>

      {/* Luz puntual. SIEMPRE RENDERIZADA, INTENSIDAD CONTROLADA. */}
      <pointLight
        position={[0, 0.2, 0]}
        intensity={fila.luzEncendida ? 0.5 : 0} // Intensidad a 0 cuando está apagada
        color="#ffeb3b"
        distance={2}
      />
      {/* **FIN DE LA CORRECCIÓN DE LA LUZ** */}

      {/* Indicador de fila con botón de eliminar */}
      <Html
        position={[0.7, 0.1, 0.2]}
        pointerEvents="none"
      >
        <div className="flex items-center gap-1 bg-black bg-opacity-70 text-white px-2 py-1 rounded text-xs">
          <span className='font-bold'>Fila {fila.numero}</span>
          <button
            className='ml-2 text-red-400 hover:text-red-600'
            onClick={(e) => {
              e.stopPropagation();
              onDelete(estanteId, fila.id);
            }}
            style={{ pointerEvents: 'auto' }} // Solo el botón recibe eventos
          >
            <Trash2 size={12} />
          </button>
        </div>
      </Html>
    </group>
  );
}

// Componente 3D de Estante (Metálico) - DISEÑO DEL ESTANTE SOLICITADO
function EstanteModel({ estante, onEstanteClick, isSelected, onDelete, onFilaClick, onDeleteFila, filaSeleccionadaId }: {
  estante: Estante3D;
  onEstanteClick: (estante: Estante3D) => void;
  isSelected: boolean;
  onDelete: (id: number) => void;
  onFilaClick: (estanteId: number, filaId: number, posicion: [number, number, number]) => void;
  onDeleteFila: (estanteId: number, filaId: number) => void;
  filaSeleccionadaId: number | null;
}) {
  const groupRef = useRef<any>(null);

  // Materiales Metálicos
  const metalMaterial = new THREE.MeshStandardMaterial({
    color: '#708090', // Gris metalizado
    metalness: 0.8,
    roughness: 0.4
  });

  const plataformaMaterial = new THREE.MeshStandardMaterial({
    color: '#C0C0C0', // Plata claro para las bandejas
    metalness: 0.6,
    roughness: 0.5,
  });

  useFrame((state) => {
    // Pequeña animación de flotación al seleccionar
    if (groupRef.current && isSelected) {
      groupRef.current.position.y = estante.posicion[1] + Math.sin(state.clock.elapsedTime * 1.5) * 0.03;
    } else if (groupRef.current) {
      // Asegurar que vuelva a su posición original
      groupRef.current.position.y = estante.posicion[1];
    }
  });

  const getColor = () => {
    switch (estante.estado) {
      case 'activo': return '#10b981';
      case 'mantenimiento': return '#f59e0b';
      case 'inactivo': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const { ancho, alto, profundidad } = estante.dimensiones;
  const separacionVertical = 0.5;
  // Limitamos a 4 niveles para que encaje en el diseño
  const numNiveles = 4;
  const nivelY = (nivel: number) => (alto / 2) - 0.1 - (nivel * separacionVertical);

  const getFilaPosicion = (index: number): [number, number, number] => {
    const nivel = index;
    return [0, nivelY(nivel), 0];
  };

  // Función para calcular posición global (necesaria para el enfoque de cámara)
  const calcularPosicionGlobal = (posLocal: [number, number, number]): [number, number, number] => {
    const vector = new THREE.Vector3(...posLocal);
    vector.applyEuler(new THREE.Euler(...estante.rotacion));
    vector.add(new THREE.Vector3(...estante.posicion));
    return [vector.x, vector.y, vector.z];
  };

  return (
    <group
      ref={groupRef}
      position={estante.posicion}
      rotation={estante.rotacion}
      onClick={(e) => {
        e.stopPropagation();
        onEstanteClick(estante);
      }}
    >
      {/* Patas verticales (4 esquinas) */}
      {[
        [-ancho / 2 + 0.025, 0, -profundidad / 2 + 0.025],
        [ancho / 2 - 0.025, 0, -profundidad / 2 + 0.025],
        [-ancho / 2 + 0.025, 0, profundidad / 2 - 0.025],
        [ancho / 2 - 0.025, 0, profundidad / 2 - 0.025]
      ].map(([x, y, z], index) => (
        <mesh key={`pata-${index}`} position={[x, y, z]}>
          <boxGeometry args={[0.05, alto * 2, 0.05]} />
          <primitive object={metalMaterial.clone()} attach="material" />
        </mesh>
      ))}

      {/* Niveles horizontales (plataformas/travesaños) */}
      {[...Array(numNiveles)].map((_, nivel) => (
        <group key={`nivel-${nivel}`}>
          {/* Travesaños frontales y traseros */}
          <mesh position={[0, nivelY(nivel), -profundidad / 2]}>
            <boxGeometry args={[ancho, 0.04, 0.04]} />
            <primitive object={metalMaterial.clone()} attach="material" />
          </mesh>
          <mesh position={[0, nivelY(nivel), profundidad / 2]}>
            <boxGeometry args={[ancho, 0.04, 0.04]} />
            <primitive object={metalMaterial.clone()} attach="material" />
          </mesh>

          {/* Travesaños laterales */}
          <mesh position={[-ancho / 2, nivelY(nivel), 0]}>
            <boxGeometry args={[0.04, 0.04, profundidad]} />
            <primitive object={metalMaterial.clone()} attach="material" />
          </mesh>
          <mesh position={[ancho / 2, nivelY(nivel), 0]}>
            <boxGeometry args={[0.04, 0.04, profundidad]} />
            <primitive object={metalMaterial.clone()} attach="material" />
          </mesh>
        </group>
      ))}

      {/* Filas/bandejas - Mapeo de filas */}
      {estante.filas.slice(0, numNiveles).map((fila, index) => {
        const [x, y, z] = getFilaPosicion(index);

        // Calcular posición global
        const globalPos = calcularPosicionGlobal([x, y, z]);

        return (
          <FilaModel
            key={fila.id}
            fila={fila}
            posicion={[x, y, z]}
            estanteId={estante.id}
            onDelete={onDeleteFila}
            onFilaClick={(filaId) => onFilaClick(estante.id, filaId, globalPos)}
            material={plataformaMaterial}
            isSelected={filaSeleccionadaId === fila.id}
          />
        );
      })}

      {/* Indicador de estado */}
      <mesh position={[-ancho / 2 + 0.05, alto / 2, profundidad / 2 + 0.01]}>
        <sphereGeometry args={[0.08, 16, 16]} />
        <meshStandardMaterial color={getColor()} />
      </mesh>

      {/* Controles flotantes (Html) */}
      {isSelected && (
        <Html
          position={[0, alto * 1.5, 0]}
          pointerEvents="none"
        >
          <div className="flex gap-2 bg-black bg-opacity-70 rounded-lg p-2 shadow-xl">
            <button
              onClick={(e) => { e.stopPropagation(); onEstanteClick(estante); }}
              className="p-1 bg-blue-500 hover:bg-blue-600 rounded text-white transition-all"
              title="Ver detalles"
              style={{ pointerEvents: 'auto' }}
            >
              <Eye size={16} />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); onDelete(estante.id); }}
              className="p-1 bg-red-500 hover:bg-red-600 rounded text-white transition-all"
              title="Eliminar estante"
              style={{ pointerEvents: 'auto' }}
            >
              <Trash2 size={16} />
            </button>
          </div>
        </Html>
      )}

      {/* Efecto de selección en el piso */}
      {isSelected && (
        <mesh position={[0, -alto / 2, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[ancho / 2, ancho / 2 + 0.1, 32]} />
          <meshBasicMaterial color="#3b82f6" transparent opacity={0.4} />
        </mesh>
      )}
    </group>
  );
}

// #endregion

// ----------------------------------------------------------------
// #region COMPONENTE DE UI
// ----------------------------------------------------------------

// Panel de Control
function ControlPanel({
  modo,
  onModoChange,
  onCrearEstante,
  onCrearFila,
  estanteSeleccionado,
  filaSeleccionada,
  onDesenfocar,
  estantes,
  onToggleLuz,
  onToggleRiego
}: {
  modo: ModoType;
  onModoChange: (modo: ModoType) => void;
  onCrearEstante: () => void;
  onCrearFila: () => void;
  estanteSeleccionado?: Estante3D;
  filaSeleccionada?: Fila3D;
  onDesenfocar: () => void;
  estantes: Estante3D[];
  onToggleLuz: () => void;
  onToggleRiego: () => void;
}) {
  // Utilizamos una función de utilidad para obtener el ID de la fila para la eliminación
  const getFilaIdToDelete = () => filaSeleccionada?.id || null;

  return (
    <div className="absolute top-4 left-4 bg-white rounded-xl shadow-2xl border border-gray-200 p-4 min-w-80 max-w-96 z-20">
      <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2 border-b pb-3">
        <Cpu size={20} className='text-blue-500' />
        Panel de Control IoT
      </h2>

      {/* Estadísticas rápidas */}
      <div className="grid grid-cols-2 gap-2 mb-4">
        <div className="bg-gray-50 p-2 rounded-lg text-center shadow-inner">
          <div className="text-sm text-gray-600">Estantes</div>
          <div className="font-bold text-lg">{estantes.length}</div>
        </div>
        <div className="bg-gray-50 p-2 rounded-lg text-center shadow-inner">
          <div className="text-sm text-gray-600">Filas Totales</div>
          <div className="font-bold text-lg">
            {estantes.reduce((total, estante) => total + estante.filas.length, 0)}
          </div>
        </div>
      </div>

      {/* Selector de Modo */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Modo de Interacción
        </label>
        <div className="flex gap-2">
          {[
            { id: 'monitoreo' as ModoType, icon: Eye, label: 'Monitoreo' },
            { id: 'edicion' as ModoType, icon: Edit3, label: 'Edición' },
          ].map((modoItem) => (
            <button
              key={modoItem.id}
              onClick={() => onModoChange(modoItem.id)}
              className={`flex-1 flex items-center justify-center gap-1 p-2 rounded-lg border transition-all shadow-sm ${modo === modoItem.id
                ? 'bg-indigo-500 border-indigo-700 text-white shadow-indigo-300'
                : 'bg-gray-100 border-gray-300 text-gray-600 hover:bg-gray-200'
                }`}
            >
              <modoItem.icon size={14} />
              <span className="text-xs">{modoItem.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Información y Acciones del Estante Seleccionado */}
      {estanteSeleccionado && (
        <div className="p-3 bg-blue-50 rounded-lg border border-blue-200 mb-4 shadow-md">
          <h3 className="font-semibold text-blue-900 text-sm mb-1 flex items-center justify-between">
            <Layers size={14} className='mr-1' /> {estanteSeleccionado.nombre}
            <button
              onClick={onDesenfocar}
              className='p-1 bg-gray-300 hover:bg-gray-400 rounded-full text-gray-700 transition-all'
              title='Volver a vista general'
            >
              <Home size={14} />
            </button>
          </h3>
          <div className="text-blue-700 text-xs space-y-1 mt-2">
            <div>Código: {estanteSeleccionado.numero}</div>
            <div>Capacidad: {estanteSeleccionado.filas.length}/4 Filas</div>
          </div>

          <div className='flex gap-2 mt-3'>
            <button
              onClick={onCrearFila}
              className="flex-1 flex items-center justify-center gap-1 p-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium transition-colors text-xs shadow-md disabled:bg-gray-400 disabled:cursor-not-allowed"
              disabled={modo === 'monitoreo' || estanteSeleccionado.filas.length >= 4}
            >
              <Plus size={14} />
              Añadir Fila
            </button>

          </div>
        </div>
      )}

      {filaSeleccionada && (
        <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-300 mb-4 shadow-md">
          <h4 className="font-semibold text-yellow-900 text-sm mb-2 flex items-center gap-2">
            <Layers size={14} /> Fila Enfocada: {filaSeleccionada.numero}
          </h4>
          <div className="text-yellow-700 text-xs space-y-1 mb-3 border-b pb-2">
            <div>Cultivo: <span className='font-medium'>{filaSeleccionada.tipoCultivo}</span></div>
          </div>

          {/* Controles IoT */}
          <div className="space-y-2 pt-2">
            <div className="text-xs font-medium text-yellow-900 mb-2">Controles IoT</div>

            <button
              onClick={onToggleLuz}
              className={`w-full flex items-center justify-between p-2 rounded-lg font-medium transition-colors text-xs shadow-sm disabled:opacity-50 ${filaSeleccionada.luzEncendida
                ? 'bg-yellow-400 hover:bg-yellow-500 text-yellow-900'
                : 'bg-gray-300 hover:bg-gray-400 text-gray-700'
                }`}
              disabled={modo === 'monitoreo'}
            >
              <div className="flex items-center gap-2">
                {filaSeleccionada.luzEncendida ? <Zap size={14} /> : <ZapOff size={14} />}
                <span>Luz LED</span>
              </div>
              <span className="font-bold">{filaSeleccionada.luzEncendida ? 'ON' : 'OFF'}</span>
            </button>

            <button
              // onClick={onToggleRiego} // Desactivado temporalmente
              className={`w-full flex items-center justify-between p-2 rounded-lg font-medium transition-colors text-xs shadow-sm disabled:opacity-50 ${filaSeleccionada.riegoActivo
                ? 'bg-blue-400 hover:bg-blue-500 text-blue-900'
                : 'bg-gray-300 hover:bg-gray-400 text-gray-700'
                }`}
              disabled={modo === 'monitoreo'}
            >
              <div className="flex items-center gap-2">
                <Droplet size={14} />
                <span>Sistema de Riego</span>
              </div>
              <span className="font-bold">{filaSeleccionada.riegoActivo ? 'ABIERTO' : 'CERRADO'}</span>
            </button>
          </div>
        </div>
      )}

      {/* Acciones Rápidas Generales */}
      <div className="space-y-2 pt-4 border-t border-gray-100">
        <button
          onClick={onCrearEstante}
          className="w-full flex items-center justify-center gap-2 p-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold transition-colors text-sm shadow-lg shadow-indigo-500/50 disabled:bg-gray-400 disabled:cursor-not-allowed"
          disabled={modo === 'monitoreo'}
        >
          <Plus size={16} />
          Agregar Nuevo Estante 3D
        </button>
      </div>
    </div>
  );
}

// #endregion

// ----------------------------------------------------------------
// #region COMPONENTE PRINCIPAL (Incluye Navbar y Footer)
// ----------------------------------------------------------------

export default function Estantes3D() {
  const [estantes, setEstantes] = useState<Estante3D[]>([]);
  const [modo, setModo] = useState<ModoType>('monitoreo');
  const [estanteSeleccionado, setEstanteSeleccionado] = useState<Estante3D | null>(null);
  const [filaSeleccionada, setFilaSeleccionada] = useState<Fila3D | null>(null);
  const [cameraTarget, setCameraTarget] = useState<[number, number, number] | null>(null);

  const ESTANTE_ESPACIO_X = 3.5;

  // Genera la posición ordenada para el nuevo estante
  const getNextEstantePosition = (index: number): [number, number, number] => {
    const x = index * ESTANTE_ESPACIO_X;
    return [x, 0.75, 0]; // Altura ajustada
  };

  // Cargar datos de ejemplo al inicio
  useEffect(() => {
    const initialEstantes: Estante3D[] = [
      {
        id: 1,
        nombre: 'Estante Principal',
        numero: 'EST-001',
        estado: 'activo',
        posicion: getNextEstantePosition(0),
        rotacion: [0, 0, 0],
        dimensiones: { ancho: 2, alto: 1.5, profundidad: 0.8 },
        filas: [
          { id: 1, numero: 1, tipoCultivo: 'Tomates', luzEncendida: true, riegoActivo: false },
          { id: 2, numero: 2, tipoCultivo: 'Lechugas', luzEncendida: false, riegoActivo: true },
          { id: 3, numero: 3, tipoCultivo: 'Fresas', luzEncendida: true, riegoActivo: false }
        ]
      },
      {
        id: 2,
        nombre: 'Estante Secundario',
        numero: 'EST-002',
        estado: 'mantenimiento',
        posicion: getNextEstantePosition(1),
        rotacion: [0, 0, 0],
        dimensiones: { ancho: 1.8, alto: 1.2, profundidad: 0.6 },
        filas: [
          { id: 4, numero: 1, tipoCultivo: 'Experimentales', luzEncendida: false, riegoActivo: false }
        ]
      }
    ];
    setEstantes(initialEstantes);
  }, []);

  // Manejador para la selección de estantes
  const handleEstanteClick = (estante: Estante3D) => {
    setEstanteSeleccionado(estante);
    setFilaSeleccionada(null);
    // Enfocar en la posición del estante
    setCameraTarget([estante.posicion[0], estante.posicion[1], estante.posicion[2]]);
  };

  // Manejador para la creación de estantes (ordenado)
  const handleCrearEstante = () => {
    if (modo === 'monitoreo') return;
    const newIndex = estantes.length;
    const nuevoEstante: Estante3D = {
      id: Date.now(),
      nombre: `Estante ${newIndex + 1}`,
      numero: `EST-${String(newIndex + 1).padStart(3, '0')}`,
      estado: 'activo',
      posicion: getNextEstantePosition(newIndex),
      rotacion: [0, 0, 0],
      dimensiones: { ancho: 2, alto: 1.5, profundidad: 0.8 },
      filas: []
    };
    setEstantes(prev => [...prev, nuevoEstante]);
    handleEstanteClick(nuevoEstante);
  };

  // Manejador para la eliminación de estantes (con reordenamiento)
  const handleEliminarEstante = (id: number) => {
    if (modo === 'monitoreo' || !window.confirm('¿Estás seguro de que quieres eliminar este estante?')) return;

    setEstantes(prev => {
      const updated = prev.filter(estante => estante.id !== id);
      return updated.map((estante, index) => ({
        ...estante,
        posicion: getNextEstantePosition(index)
      }));
    });
    if (estanteSeleccionado?.id === id) {
      handleDesenfocar();
    }
  };

  // Manejador para la selección y enfoque de filas - LÓGICA IMPORTANTE PRESERVADA
  const handleFilaClick = (estanteId: number, filaId: number, globalPos: [number, number, number]) => {
    // Buscar el estante y la fila correspondientes
    const estante = estantes.find(e => e.id === estanteId);
    const fila = estante?.filas.find(f => f.id === filaId);

    if (estante && fila) {
      setEstanteSeleccionado(estante);
      setFilaSeleccionada(fila);
      // Enfocar en la posición global de la fila
      setCameraTarget(globalPos);
    }
  };

  // Manejador para crear filas en el estante seleccionado
  const handleCrearFila = () => {
    if (!estanteSeleccionado || modo === 'monitoreo' || estanteSeleccionado.filas.length >= 4) return;

    const nuevaFila: Fila3D = {
      id: Date.now(),
      numero: estanteSeleccionado.filas.length + 1,
      tipoCultivo: 'Nuevo Cultivo',
      luzEncendida: false,
      riegoActivo: false
    };

    setEstantes(prev => prev.map(estante => {
      if (estante.id === estanteSeleccionado.id) {
        const updatedEstante = { ...estante, filas: [...estante.filas, nuevaFila] };
        setEstanteSeleccionado(updatedEstante);
        return updatedEstante;
      }
      return estante;
    }));
    setFilaSeleccionada(nuevaFila);
  };

  // Manejador para eliminar filas y re-numerar
  const handleEliminarFilaDirecta = (estanteId: number, filaId: number) => {
    if (modo === 'monitoreo') return;

    const estante = estantes.find(e => e.id === estanteId);
    const fila = estante?.filas.find(f => f.id === filaId);

    // Se usa window.confirm ya que no se permiten alerts/confirms nativos de navegador en React con THREE.js por restricciones de entorno.
    if (!window.confirm(`¿Estás seguro de que quieres eliminar la Fila ${fila?.numero}?`)) return;

    setEstantes(prev => prev.map(estante => {
      if (estante.id === estanteId) {
        const updatedFilas = estante.filas
          .filter(fila => fila.id !== filaId)
          .map((fila, index) => ({ ...fila, numero: index + 1 }));

        const updatedEstante = { ...estante, filas: updatedFilas };

        if (estanteSeleccionado?.id === estanteId) {
          setEstanteSeleccionado(updatedEstante);
        }

        if (filaSeleccionada?.id === filaId) {
          setFilaSeleccionada(null);
          // Volver a enfocar el estante al eliminar la fila
          setCameraTarget([estante.posicion[0], estante.posicion[1], estante.posicion[2]]);
        }

        return updatedEstante;
      }
      return estante;
    }));
  };

  // Manejador para desenfocar y volver a la vista general
  const handleDesenfocar = () => {
    setEstanteSeleccionado(null);
    setFilaSeleccionada(null);
    setCameraTarget(null); // Volver a la vista inicial/general
  }

  // Controladores IoT (mantienen la lógica de actualización de estado)
  const handleToggleLuz = () => {
    if (!filaSeleccionada || !estanteSeleccionado) return;

    setEstantes(prev => prev.map(estante => {
      if (estante.id === estanteSeleccionado.id) {
        const updatedFilas = estante.filas.map(fila =>
          fila.id === filaSeleccionada.id
            ? { ...fila, luzEncendida: !fila.luzEncendida }
            : fila
        );
        const updatedEstante = { ...estante, filas: updatedFilas };
        setEstanteSeleccionado(updatedEstante);
        setFilaSeleccionada(updatedFilas.find(f => f.id === filaSeleccionada.id) || null);
        return updatedEstante;
      }
      return estante;
    }));
  };

  const handleToggleRiego = () => {
    if (!filaSeleccionada || !estanteSeleccionado) return;

    setEstantes(prev => prev.map(estante => {
      if (estante.id === estanteSeleccionado.id) {
        const updatedFilas = estante.filas.map(fila =>
          fila.id === filaSeleccionada.id
            ? { ...fila, riegoActivo: !fila.riegoActivo }
            : fila
        );
        const updatedEstante = { ...estante, filas: updatedFilas };
        setEstanteSeleccionado(updatedEstante);
        setFilaSeleccionada(updatedFilas.find(f => f.id === filaSeleccionada.id) || null);
        return updatedEstante;
      }
      return estante;
    }));
  };

  return (
    <div className="flex-1 w-full bg-gradient-to-br from-gray-900 to-gray-800 relative" style={{ height: 'calc(100vh - 80px)' }}>
      <Navbar />

      {/* Este div debe ocupar todo el espacio restante */}
      <div className="flex-1 w-full bg-gradient-to-br from-gray-900 to-gray-800 relative" style={{ height: 'calc(100vh - 80px)' }}>
        {/* Canvas 3D - debe ocupar todo el contenedor padre */}
        <Canvas 
          camera={{ position: [5, 5, 15], fov: 50 }}
          style={{ width: '100%', height: '100%' }}
        >
          <ambientLight intensity={0.6} />
          <pointLight position={[10, 10, 10]} intensity={0.8} />
          <spotLight position={[0, 10, 0]} intensity={0.5} angle={0.3} />

          <OrbitControls
            enablePan={true}
            enableZoom={true}
            enableRotate={true}
            minDistance={3}
            maxDistance={50}
          />

          {/* Cámara de Enfoque */}
          {cameraTarget && <CameraFocus targetPosition={cameraTarget} active={!!cameraTarget} />}

          {/* Piso */}
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1, 0]}>
            <planeGeometry args={[50, 50]} />
            <meshStandardMaterial color="#374151" transparent opacity={0.5} />
          </mesh>

          {/* Renderizar estantes */}
          {estantes.map(estante => (
            <EstanteModel
              key={estante.id}
              estante={estante}
              onEstanteClick={handleEstanteClick}
              isSelected={estanteSeleccionado?.id === estante.id}
              onDelete={handleEliminarEstante}
              onFilaClick={handleFilaClick}
              onDeleteFila={handleEliminarFilaDirecta}
              filaSeleccionadaId={filaSeleccionada?.id || null}
            />
          ))}
        </Canvas>

        {/* Panel de Control UI y otros elementos overlay */}
        <ControlPanel
          modo={modo}
          onModoChange={setModo}
          onCrearEstante={handleCrearEstante}
          onCrearFila={handleCrearFila}
          estanteSeleccionado={estanteSeleccionado || undefined}
          filaSeleccionada={filaSeleccionada || undefined}
          onDesenfocar={handleDesenfocar}
          estantes={estantes} 
          onToggleLuz={handleToggleLuz} 
          onToggleRiego={handleToggleRiego} 
        />

        {/* Stats en esquina */}
        <div className="absolute top-4 right-4 bg-black bg-opacity-50 text-white p-3 rounded-lg z-10">
          <div className="text-sm space-y-1">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>Activos: {estantes.filter(e => e.estado === 'activo').length}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
              <span>Mantenimiento: {estantes.filter(e => e.estado === 'mantenimiento').length}</span>
            </div>
            <div className="text-xs text-gray-300 mt-2">
              Modo: {modo}
            </div>
          </div>
        </div>

        {/* Instrucciones */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-50 text-white p-3 rounded-lg text-sm max-w-lg text-center z-10">
          {filaSeleccionada
            ? `Fila ${filaSeleccionada.numero} enfocada. Usa los controles IoT o el botón de eliminar en la fila.`
            : estanteSeleccionado
              ? `Estante "${estanteSeleccionado.nombre}" seleccionado. Haz clic en una fila para enfocarla y controlarla.`
              : 'Haz clic en un estante para seleccionarlo. Luego selecciona una fila para controlar sus dispositivos IoT.'
          }
        </div>
      </div>


    </div>
  );
}