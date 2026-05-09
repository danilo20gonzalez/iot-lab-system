"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.prenderSwitch = prenderSwitch;
exports.apagarSwitch = apagarSwitch;
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
