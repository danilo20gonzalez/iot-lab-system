"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRoles = void 0;
const db_1 = require("../config/db");
// Obtener todos los roles
const getRoles = async (req, res) => {
    try {
        const [rows] = await db_1.pool.query('CALL OBTENER_ROLES()');
        const roles = rows[0];
        res.json(roles);
    }
    catch (error) {
        console.error('Error al obtener roles:', error);
        res.status(500).json({ message: 'Error al obtener los roles' });
    }
};
exports.getRoles = getRoles;
