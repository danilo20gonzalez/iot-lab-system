"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = exports.registerUser = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const joi_1 = __importDefault(require("joi"));
const db_1 = require("../config/db");
const registerSchema = joi_1.default.object({
    nombre_completo: joi_1.default.string().required(),
    username: joi_1.default.string().required(),
    password: joi_1.default.string().required(),
    fk_id_rol: joi_1.default.number().required(),
    email: joi_1.default.string().required(),
});
const loginSchema = joi_1.default.object({
    username: joi_1.default.string().required(),
    password: joi_1.default.string().required(),
});
const registerUser = async (nombre_completo, username, password, fk_id_rol, email) => {
    // Validar todos los campos antes de seguir
    const { error } = registerSchema.validate({ nombre_completo, username, password, fk_id_rol, email });
    if (error)
        throw new Error(error.details[0].message);
    const hashedPassword = await bcrypt_1.default.hash(password, 10);
    try {
        // El procedimiento crear_usuario ahora recibe el estado (1 por defecto)
        const estado_default = 1;
        const [result] = await db_1.pool.query('CALL crear_usuario(?, ?, ?, ?, ?, ?)', [nombre_completo, username, hashedPassword, email, estado_default, fk_id_rol]);
        return result;
    }
    catch (error) {
        if (error.sqlState === '45000') {
            throw new Error(error.message); // El mensaje que lanza el SP "El usuario o email ya existe"
        }
        throw error;
    }
};
exports.registerUser = registerUser;
const login = async (username, password) => {
    // Validar datos de entrada
    const { error } = loginSchema.validate({ username, password });
    if (error)
        throw new Error(error.details[0].message);
    // Consultar usuario con procedimiento almacenado
    const [rows] = await db_1.pool.query('CALL OBTENER_USUARIO_POR_USERNAME(?)', [username]);
    // En SPs, rows[0] contiene los resultados del SELECT
    const users = rows[0];
    const user = users[0];
    if (!user)
        throw new Error('Usuario o contraseña inválidos');
    // Verificar contraseña
    const isValid = await bcrypt_1.default.compare(password, user.password);
    if (!isValid)
        throw new Error('Usuario o contraseña inválidos');
    // Generar token JWT
    const token = jsonwebtoken_1.default.sign({ id_usuario: user.id_usuario, fk_id_rol: user.fk_id_rol }, process.env.JWT_SECRET, { expiresIn: '1h' });
    return {
        token,
        user: {
            id_usuario: user.id_usuario,
            username: user.username,
            fk_id_rol: user.fk_id_rol,
        },
    };
};
exports.login = login;
