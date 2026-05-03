import { pool } from '../config/db';
import { Request, Response } from 'express';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

// ✅ Listar laboratorios
export const getLaboratorios = async (req: Request, res: Response) => {
  try {
    const [rows] = await pool.query<RowDataPacket[]>(`
    SELECT 
      l.ID_MODULO_LABORATORIO AS id,
      CONCAT('LAB-', LPAD(l.ID_MODULO_LABORATORIO, 3, '0')) AS code,
      l.NOMBRE_MODULO_MODULO_LABORATORIO AS name,
      l.DESCRIPCION_MODULO_LABORATORIO AS description,
      23.5 AS temperature, -- Se mantiene quemado
      45 AS humidity,      -- Se mantiene quemado
      CASE 
          WHEN e.ID_ESTADO_MODULO_LABORATORIO = 1 THEN 'active'
          WHEN e.ID_ESTADO_MODULO_LABORATORIO = 2 THEN 'maintenance'
          ELSE 'inactive'
      END AS status,
    
    -- CAMBIO AQUÍ: Trae el conteo real de la tabla usuario
      (SELECT COUNT(*) FROM usuario) AS associatedUsers,
    
      NOW() AS createdAt,
      'on' AS automationStatus, -- Se mantiene quemado
      false AS isZoneDisabled,   -- Se mantiene quemado
      12 AS activeSensors,       -- Se mantiene quemado
      18 AS devices              -- Se mantiene quemado
    FROM modulo_laboratorio l
    JOIN estado_modulo_laboratorio e ON l.PK_ID_ESTADO_MODULO_LABORATORIO = e.ID_ESTADO_MODULO_LABORATORIO
    ORDER BY l.ID_MODULO_LABORATORIO DESC;
    `);
    res.json(rows);
  } catch (error) {
    console.error('Error al obtener laboratorios:', error);
    res.status(500).json({ message: 'Error al obtener laboratorios' });
  }
};

// ✅ Crear laboratorio
export const createLaboratorio = async (req: Request, res: Response) => {
  try {
    const { name, description, status } = req.body;
    // Map status to estadoId
    const estadoId = status === 'active' ? 1 : status === 'maintenance' ? 2 : 3;

    const [result] = await pool.query<ResultSetHeader>(
      `INSERT INTO modulo_laboratorio (NOMBRE_MODULO_MODULO_LABORATORIO, DESCRIPCION_MODULO_LABORATORIO, PK_ID_ESTADO_MODULO_LABORATORIO)
       VALUES (?, ?, ?)`,
      [name, description, estadoId]
    );

    const newLab = {
      id: result.insertId,
      code: `LAB-${String(result.insertId).padStart(3, '0')}`,
      name,
      description,
      temperature: 23.5,
      humidity: 45,
      status,
      associatedUsers: 0,
      createdAt: new Date().toISOString(),
      automationStatus: 'on' as 'on' | 'off',
      isZoneDisabled: false,
      activeSensors: 0,
      devices: 0
    };

    res.status(201).json({
      message: 'Laboratorio creado correctamente',
      laboratorio: newLab
    });
  } catch (error) {
    console.error('Error al crear laboratorio:', error);
    res.status(500).json({ message: 'Error al crear laboratorio' });
  }
};

// ✅ Actualizar laboratorio
export const updateLaboratorio = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, description, status } = req.body;
    const estadoId = status === 'active' ? 1 : status === 'maintenance' ? 2 : 3;

    await pool.query(
      `UPDATE modulo_laboratorio SET NOMBRE_MODULO_MODULO_LABORATORIO = ?, DESCRIPCION_MODULO_LABORATORIO = ?, PK_ID_ESTADO_MODULO_LABORATORIO = ? WHERE ID_MODULO_LABORATORIO = ?`,
      [name, description, estadoId, id]
    );

    res.json({ message: 'Laboratorio actualizado correctamente' });
  } catch (error) {
    console.error('Error al actualizar laboratorio:', error);
    res.status(500).json({ message: 'Error al actualizar laboratorio' });
  }
};

// ✅ Eliminar laboratorio
export const deleteLaboratorio = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    await pool.query('DELETE FROM modulo_laboratorio WHERE ID_MODULO_LABORATORIO = ?', [id]);

    res.json({ message: 'Laboratorio eliminado correctamente' });
  } catch (error) {
    console.error('Error al eliminar laboratorio:', error);
    res.status(500).json({ message: 'Error al eliminar laboratorio' });
  }
};
