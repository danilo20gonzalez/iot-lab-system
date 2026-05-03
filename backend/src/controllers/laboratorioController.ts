import { pool } from '../config/db';
import { Request, Response } from 'express';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

// ✅ Listar laboratorios
export const getLaboratorios = async (req: Request, res: Response) => {
  try {
    const [rows] = await pool.query<RowDataPacket[]>('CALL OBTENER_LABORATORIOS()');
    const laboratorios = rows[0];
    res.json(laboratorios);
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

    const [result] = await pool.query<RowDataPacket[]>(
      'CALL CREAR_LABORATORIO(?, ?, ?)',
      [name, description, estadoId]
    );
    
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
      'CALL ACTUALIZAR_LABORATORIO(?, ?, ?, ?)',
      [id, name, description, estadoId]
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

    await pool.query('CALL ELIMINAR_LABORATORIO(?)', [id]);

    res.json({ message: 'Laboratorio eliminado correctamente' });
  } catch (error) {
    console.error('Error al eliminar laboratorio:', error);
    res.status(500).json({ message: 'Error al eliminar laboratorio' });
  }
};
