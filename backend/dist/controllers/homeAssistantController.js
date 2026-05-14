"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCameraStream = exports.getSwitches = exports.getSensores = exports.apagarLuz = exports.encenderLuz = void 0;
const homeAssistantService_1 = require("../services/homeAssistantService");
const axios_1 = __importDefault(require("axios"));
const encenderLuz = async (req, res) => {
    const { entityId } = req.body;
    try {
        const result = await (0, homeAssistantService_1.prenderSwitch)(entityId);
        res.json(result);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.encenderLuz = encenderLuz;
const apagarLuz = async (req, res) => {
    const { entityId } = req.body;
    try {
        const result = await (0, homeAssistantService_1.apagarSwitch)(entityId);
        res.json(result);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.apagarLuz = apagarLuz;
const getSensores = async (req, res) => {
    try {
        const sensores = await (0, homeAssistantService_1.obtenerSensores)();
        res.json(sensores);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.getSensores = getSensores;
const getSwitches = async (req, res) => {
    try {
        const switches = await (0, homeAssistantService_1.obtenerSwitches)();
        res.json(switches);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.getSwitches = getSwitches;
const getCameraStream = async (req, res) => {
    const { entityId } = req.params;
    const HA_HOST = process.env.HA_HOST;
    const TOKEN = process.env.HA_TOKEN;
    try {
        const response = await (0, axios_1.default)({
            method: "get",
            url: `http://${HA_HOST}/api/camera_proxy/${entityId}`,
            responseType: "stream",
            headers: {
                Authorization: `Bearer ${TOKEN}`,
            },
        });
        if (response.headers['content-type']) {
            res.set('Content-Type', response.headers['content-type']);
        }
        response.data.pipe(res);
    }
    catch (error) {
        console.error(`[HA Camera Proxy Error] al solicitar ${entityId}:`, error.message);
        if (error.response) {
            console.error(`[HA Camera Proxy Error] Status: ${error.response.status}`);
        }
        res.status(500).json({ error: "Failed to fetch camera stream" });
    }
};
exports.getCameraStream = getCameraStream;
