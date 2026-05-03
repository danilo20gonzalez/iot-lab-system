"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteLaboratorio = exports.updateLaboratorio = exports.createLaboratorio = exports.getLaboratorios = void 0;
const db_1 = require("../config/db");
// ✅ Listar laboratorios
const getLaboratorios = async (req, res) => {
    try {
        const [rows] = await db_1.pool.query('CALL OBTENER_LABORATORIOS()');
        const laboratorios = rows[0];
        res.json(laboratorios);
    }
    catch (error) {
        console.error('Error al obtener laboratorios:', error);
        res.status(500).json({ message: 'Error al obtener laboratorios' });
    }
};
exports.getLaboratorios = getLaboratorios;
// ✅ Crear laboratorio
const createLaboratorio = async (req, res) => {
    try {
        const { name, description, status } = req.body;
        // Map status to estadoId
        const estadoId = status === 'active' ? 1 : status === 'maintenance' ? 2 : 3;
        const [result] = await db_1.pool.query('CALL CREAR_LABORATORIO(?, ?, ?)', [name, description, estadoId]);
        const insertId = result[0][0].insertId;
        const newLab = {
            id: insertId,
            code: `LAB-${String(insertId).padStart(3, '0')}`,
            name,
            description,
            temperature: 23.5,
            humidity: 45,
            status,
            associatedUsers: 0,
            createdAt: new Date().toISOString(),
            automationStatus: 'on',
            isZoneDisabled: false,
            activeSensors: 0,
            devices: 0
        };
        res.status(201).json({
            message: 'Laboratorio creado correctamente',
            laboratorio: newLab
        });
    }
    catch (error) {
        console.error('Error al crear laboratorio:', error);
        res.status(500).json({ message: 'Error al crear laboratorio' });
    }
};
exports.createLaboratorio = createLaboratorio;
// ✅ Actualizar laboratorio
const updateLaboratorio = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description, status } = req.body;
        const estadoId = status === 'active' ? 1 : status === 'maintenance' ? 2 : 3;
        await db_1.pool.query('CALL ACTUALIZAR_LABORATORIO(?, ?, ?, ?)', [id, name, description, estadoId]);
        res.json({ message: 'Laboratorio actualizado correctamente' });
    }
    catch (error) {
        console.error('Error al actualizar laboratorio:', error);
        res.status(500).json({ message: 'Error al actualizar laboratorio' });
    }
};
exports.updateLaboratorio = updateLaboratorio;
// ✅ Eliminar laboratorio
const deleteLaboratorio = async (req, res) => {
    try {
        const { id } = req.params;
        await db_1.pool.query('CALL ELIMINAR_LABORATORIO(?)', [id]);
        res.json({ message: 'Laboratorio eliminado correctamente' });
    }
    catch (error) {
        console.error('Error al eliminar laboratorio:', error);
        res.status(500).json({ message: 'Error al eliminar laboratorio' });
    }
};
exports.deleteLaboratorio = deleteLaboratorio;
