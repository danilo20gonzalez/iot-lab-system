import { pool } from '../config/db';
const bcrypt = require('bcrypt');
import { Request, Response } from "express";
import { RowDataPacket } from 'mysql2';

export const createUser = async (req: Request, res: Response) => {
  try {
    const { name, username, password, email, fk_id_rol, status } = req.body;

    // Verificar si el usuario ya existe
    const [existingUser] = await pool.query<RowDataPacket[]>('SELECT * FROM usuario WHERE username = ?', [username]);
    if (existingUser.length > 0) {
      return res.status(400).json({ message: 'El usuario ya existe' });
    }

    // Encriptar la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crear el usuario
    const [user] = await pool.query('INSERT INTO usuario (name, username, password, email, fk_id_rol, status) VALUES (?, ?, ?, ?, ?, ?)',
      [name, username, hashedPassword, email, fk_id_rol, status]);
    res.json({ message: 'Usuario creado correctamente', user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al crear el usuario' });
  }
};