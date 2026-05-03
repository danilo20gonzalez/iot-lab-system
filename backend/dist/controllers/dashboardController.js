"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRecentActivity = exports.getAlerts = exports.getStats = void 0;
const db_1 = require("../config/db");
const getStats = async (req, res) => {
    try {
        const [rows] = await db_1.pool.query('CALL OBTENER_ESTADISTICAS_DASHBOARD()');
        const stats = rows[0][0]; // Extract the first row of the first result set
        res.json(stats);
    }
    catch (error) {
        console.error('Error al obtener estadísticas del dashboard:', error);
        res.status(500).json({ message: 'Error al obtener estadísticas' });
    }
};
exports.getStats = getStats;
const getAlerts = async (req, res) => {
    try {
        const [rows] = await db_1.pool.query('CALL OBTENER_TODAS_LAS_ALERTAS()');
        const alerts = rows[0];
        res.json(alerts);
    }
    catch (error) {
        console.error('Error al obtener alertas del dashboard:', error);
        res.status(500).json({ message: 'Error al obtener alertas' });
    }
};
exports.getAlerts = getAlerts;
const getRecentActivity = async (req, res) => {
    try {
        const [rows] = await db_1.pool.query('CALL OBTENER_ACTIVIDAD_RECIENTE()');
        const activities = rows[0];
        res.json(activities);
    }
    catch (error) {
        console.error('Error al obtener actividad reciente:', error);
        res.status(500).json({ message: 'Error al obtener actividad reciente' });
    }
};
exports.getRecentActivity = getRecentActivity;
