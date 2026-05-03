"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUser = exports.deleteUser = exports.getUsers = void 0;
const db_1 = require("../config/db");
// Obtener todos los usuarios
const getUsers = async (req, res) => {
    try {
        const [rows] = await db_1.pool.query('CALL OBTENER_USUARIOS()');
        // Al usar CALL, mysql2 devuelve un arreglo de arreglos
        const users = rows[0];
        res.json(users);
    }
    catch (error) {
        console.error('Error al obtener usuarios:', error);
        res.status(500).json({ message: 'Error al obtener los usuarios' });
    }
};
exports.getUsers = getUsers;
// Eliminar un usuario
const deleteUser = async (req, res) => {
    const { id } = req.params;
    try {
        await db_1.pool.query('CALL ELIMINAR_USUARIO(?)', [id]);
        res.json({ message: 'Usuario eliminado correctamente' });
    }
    catch (error) {
        console.error('Error al eliminar usuario:', error);
        res.status(500).json({ message: 'Error interno al eliminar usuario' });
    }
};
exports.deleteUser = deleteUser;
// Editar un usuario
const updateUser = async (req, res) => {
    const { id } = req.params;
    const { nombre_completo, username, email, estado, fk_id_rol } = req.body;
    try {
        await db_1.pool.query('CALL ACTUALIZAR_USUARIO(?, ?, ?, ?, ?, ?)', [id, nombre_completo, username, email, estado, fk_id_rol]);
        res.json({ message: 'Usuario actualizado correctamente' });
    }
    catch (error) {
        console.error('Error al actualizar usuario:', error);
        res.status(500).json({ message: 'Error interno al actualizar usuario' });
    }
};
exports.updateUser = updateUser;
