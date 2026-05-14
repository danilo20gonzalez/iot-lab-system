"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.prenderSwitch = prenderSwitch;
exports.apagarSwitch = apagarSwitch;
exports.obtenerSensores = obtenerSensores;
exports.obtenerSwitches = obtenerSwitches;
const axios_1 = __importDefault(require("axios"));
const HA_HOST = process.env.HA_HOST;
const TOKEN = process.env.HA_TOKEN;
async function prenderSwitch(entityId) {
    try {
        await axios_1.default.post(`http://${HA_HOST}/api/services/switch/turn_on`, { entity_id: entityId }, {
            headers: {
                Authorization: `Bearer ${TOKEN}`,
                "Content-Type": "application/json",
            },
        });
        return { success: true };
    }
    catch (error) {
        throw new Error(error.message);
    }
}
async function apagarSwitch(entityId) {
    try {
        await axios_1.default.post(`http://${HA_HOST}/api/services/switch/turn_off`, { entity_id: entityId }, {
            headers: {
                Authorization: `Bearer ${TOKEN}`,
                "Content-Type": "application/json",
            },
        });
        return { success: true };
    }
    catch (error) {
        throw new Error(error.message);
    }
}
async function obtenerSensores() {
    try {
        const response = await axios_1.default.get(`http://${HA_HOST}/api/states`, {
            headers: {
                Authorization: `Bearer ${TOKEN}`,
                "Content-Type": "application/json",
            },
        });
        // Filtrar solo sensores de temperatura y humedad
        const sensores = response.data.filter((entity) => {
            const entityId = entity.entity_id;
            return entityId.startsWith("sensor.") &&
                (entityId.toLowerCase().includes("temperature") ||
                    entityId.toLowerCase().includes("temperatura") ||
                    entityId.toLowerCase().includes("humidity") ||
                    entityId.toLowerCase().includes("sonoff_100296c34a") ||
                    entityId.toLowerCase().includes("humedad"));
        }).map((entity) => {
            const eId = entity.entity_id.toLowerCase();
            return {
                entityId: entity.entity_id,
                nombre: entity.attributes?.friendly_name || entity.entity_id,
                valor: entity.state,
                unidad: entity.attributes?.unit_of_measurement || "",
                tipo: eId.includes("temperature") || eId.includes("temperatura")
                    ? "temperature"
                    : "humidity",
                ubicacion: entity.attributes?.area_id || "Desconocida",
                deviceName: entity.attributes?.device_name || ""
            };
        });
        return sensores;
    }
    catch (error) {
        throw new Error(error.message);
    }
}
async function obtenerSwitches() {
    try {
        const response = await axios_1.default.get(`http://${HA_HOST}/api/states`, {
            headers: {
                Authorization: `Bearer ${TOKEN}`,
                "Content-Type": "application/json",
            },
        });
        // Filtrar solo switches (luces, Sonoff, etc)
        const switches = response.data.filter((entity) => {
            const entityId = entity.entity_id.toLowerCase();
            return entityId.startsWith("light.");
        }).map((entity) => {
            const eId = entity.entity_id.toLowerCase();
            return {
                entityId: entity.entity_id,
                nombre: entity.attributes?.friendly_name || entity.entity_id,
                estado: entity.state, // "on" o "off"
                tipo: "light", // Tipo de dispositivo
                ubicacion: entity.attributes?.area_id || "Desconocida",
                deviceName: entity.attributes?.device_name || "",
                icon: entity.attributes?.icon || "mdi:lightbulb"
            };
        });
        return switches;
    }
    catch (error) {
        throw new Error(error.message);
    }
}
