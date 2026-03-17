import { pool } from '../config/db';
import { Request, Response } from "express";
import { RowDataPacket } from 'mysql2';

// Obtener todos los usuarios
export const getUsers = async (req: Request, res: Response) => {
  try {
    const [rows] = await pool.query<RowDataPacket[]>(`
      SELECT 
        id_usuario,
        nombre_completo,
        username,
        email,
        estado,
        fk_id_rol,
        created_at
      FROM usuario
      ORDER BY id_usuario DESC;
    `);

    res.json(rows);
  } catch (error) {
    console.error('Error al obtener usuarios:', error);
    res.status(500).json({ message: 'Error al obtener los usuarios' });
  }
};

// Eliminar un usuario
export const deleteUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const [result] = await pool.query<RowDataPacket[]>('DELETE FROM usuario WHERE id_usuario = ?', [id]);

    if ((result as any).affectedRows === 0) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    res.json({ message: 'Usuario eliminado correctamente' });
  } catch (error) {
    console.error('Error al eliminar usuario:', error);
    res.status(500).json({ message: 'Error interno al eliminar usuario' });
  }
};

// Editar un usuario
export const updateUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { nombre_completo, username, email, estado, fk_id_rol } = req.body;

  try {
    const [result] = await pool.query(
      `UPDATE usuario 
       SET nombre_completo = ?, username = ?, email = ?, estado = ?, fk_id_rol = ? 
       WHERE id_usuario = ?`,
      [nombre_completo, username, email, estado, fk_id_rol, id]
    );

    if ((result as any).affectedRows === 0) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    res.json({ message: 'Usuario actualizado correctamente' });
  } catch (error) {
    console.error('Error al actualizar usuario:', error);
    res.status(500).json({ message: 'Error interno al actualizar usuario' });
  }
};