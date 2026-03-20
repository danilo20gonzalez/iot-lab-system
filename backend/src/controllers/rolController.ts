import { pool } from '../config/db';
import { Request, Response } from 'express';
import { RowDataPacket } from 'mysql2';

// Obtener todos los roles
export const getRoles = async (req: Request, res: Response) => {
  try {
    const [rows] = await pool.query<RowDataPacket[]>(`
      SELECT * FROM rol ORDER BY id_rol ASC;
    `);

    res.json(rows);
  } catch (error) {
    console.error('Error al obtener roles:', error);
    res.status(500).json({ message: 'Error al obtener los roles' });
  }
};
