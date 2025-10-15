import { pool } from '../config/db';
import { Request, Response } from 'express';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

// ✅ Listar laboratorios
export const getLaboratorios = async (req: Request, res: Response) => {
  try {
    const [rows] = await pool.query<RowDataPacket[]>(`
      SELECT 
        l.ID_LABORATORIO AS id,
        l.NOMBRE_LABORATORIO AS nombre,
        l.DESCRIPCION_LABORATORIO AS descripcion,
        e.NOMBRE_ESTADO_LABORATORIO AS estado
      FROM laboratorio l
      JOIN estado_laboratorio e ON l.PK_ID_ESTADO_LABORATORIO = e.ID_ESTADO_LABORATORIO
      ORDER BY l.ID_LABORATORIO DESC;
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
    const { nombre, descripcion, estadoId } = req.body;

    const [result] = await pool.query<ResultSetHeader>(
      `INSERT INTO laboratorio (NOMBRE_LABORATORIO, DESCRIPCION_LABORATORIO, PK_ID_ESTADO_LABORATORIO)
       VALUES (?, ?, ?)`,
      [nombre, descripcion, estadoId]
    );

    res.status(201).json({
      message: 'Laboratorio creado correctamente',
      laboratorio: { id: result.insertId, nombre, descripcion, estadoId }
    });
  } catch (error) {
    console.error('Error al crear laboratorio:', error);
    res.status(500).json({ message: 'Error al crear laboratorio' });
  }
};
