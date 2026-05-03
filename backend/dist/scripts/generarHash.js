"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcrypt_1 = __importDefault(require("bcrypt"));
const generarHash = async () => {
    try {
        const password = '123456'; // Reemplaza con la contraseña que desees
        const hashedPassword = await bcrypt_1.default.hash(password, 10);
        console.log(`Hash de la contraseña: ${hashedPassword}`);
    }
    catch (error) {
        console.error('Error al generar hash:', error);
    }
};
generarHash();
