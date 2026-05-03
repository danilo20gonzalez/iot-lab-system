"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.apagarLuz = exports.encenderLuz = void 0;
const homeAssistantService_1 = require("../services/homeAssistantService");
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
