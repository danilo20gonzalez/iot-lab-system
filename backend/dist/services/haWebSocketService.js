"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.broadcastToUnity = broadcastToUnity;
exports.startHAWebsocketServer = startHAWebsocketServer;
const ws_1 = require("ws");
const axios_1 = __importDefault(require("axios"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const HA_TOKEN = process.env.HA_TOKEN || "";
const HA_HOST = process.env.HA_HOST || "192.168.1.12:8123";
const HA_WS_URL = `ws://${HA_HOST}/api/websocket`;
const HA_HTTP_URL = `http://${HA_HOST}/api`;
let haWs = null;
const unityClients = new Set();
function broadcastToUnity(messageObj) {
    const jsonString = JSON.stringify(messageObj);
    unityClients.forEach(client => {
        if (client.readyState === ws_1.WebSocket.OPEN) {
            // Enviamos el objeto parseado para que Unity lo entienda
            client.send(jsonString);
        }
    });
}
function connectToHA() {
    haWs = new ws_1.WebSocket(HA_WS_URL);
    haWs.on('open', () => {
        console.log('Conectado a HA WebSocket');
        // Autenticación
        haWs?.send(JSON.stringify({ type: 'auth', access_token: HA_TOKEN }));
    });
    haWs.on('message', (data) => {
        try {
            const msg = JSON.parse(data);
            if (msg.type === 'auth_ok') {
                // Suscribirse a cambios de estado
                haWs?.send(JSON.stringify({ id: 1, type: 'subscribe_events', event_type: 'state_changed' }));
            } // Aceptamos entidades que contengan 'switch' o 'sensor'
            else if (msg.type === 'event' && msg.event?.data?.new_state && (msg.event.data.entity_id.includes('switch') || msg.event.data.entity_id.includes('sensor'))) {
                // Reenviar a todos los clientes Unity
                broadcastToUnity({
                    type: 'state_change',
                    entity: msg.event.data.entity_id,
                    state: msg.event.data.new_state?.state
                });
            }
        }
        catch (e) {
            console.error("Error al procesar mensaje de HA WebSocket:", e);
        }
    });
    haWs.on('error', (err) => {
        console.error('Error en HA WebSocket:', err);
    });
    haWs.on('close', () => {
        console.log('Desconectado de HA WebSocket, reintentando en 5s...');
        setTimeout(connectToHA, 5000);
    });
}
function startHAWebsocketServer() {
    const wss = new ws_1.WebSocketServer({ port: 8080 });
    wss.on('connection', (ws) => {
        console.log('Cliente Unity conectado (WebSocket puerto 8080)');
        unityClients.add(ws);
        ws.on('message', async (data) => {
            try {
                const message = JSON.parse(data);
                if (message.action === 'turn_on' || message.action === 'turn_off') {
                    const entityId = message.entity;
                    const service = message.action === 'turn_on' ? 'switch/turn_on' : 'switch/turn_off';
                    try {
                        await axios_1.default.post(`${HA_HTTP_URL}/services/${service}`, { entity_id: entityId }, { headers: { Authorization: `Bearer ${HA_TOKEN}`, 'Content-Type': 'application/json' } });
                        console.log(`Comando ${message.action} enviado a ${entityId}`);
                    }
                    catch (err) {
                        console.error('Error al enviar comando a HA:', err.message);
                        ws.send(JSON.stringify({ type: 'error', message: err.message }));
                    }
                }
            }
            catch (e) {
                console.error("Error al procesar mensaje de Unity:", e);
            }
        });
        ws.on('close', () => {
            unityClients.delete(ws);
            console.log('Cliente Unity desconectado');
        });
    });
    // Iniciar la conexión a Home Assistant
    connectToHA();
    console.log('Servidor WebSocket para Unity escuchando en puerto 8080');
}
