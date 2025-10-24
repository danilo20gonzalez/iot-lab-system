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

// export const getUsers = async (req: Request, res: Response) => {
//   try {
//     const [rows] = await pool.query<RowDataPacket[]>(`
//       SELECT 
//         u.ID_USUARIO AS id,
//         u.NAME AS name,
//         u.USERNAME AS username,
//         u.EMAIL AS email,
//         u.STATUS AS status,
//         r.NOMBRE_ROL AS role,
//         u.CREADO_EN AS createdAt
//       FROM usuario u
//       JOIN rol r ON u.FK_ID_ROL = r.ID_ROL
//       ORDER BY u.ID_USUARIO DESC;
//     `);
//     res.json(rows);
//   } catch (error) {
//     console.error('Error al obtener usuarios:', error);
//     res.status(500).json({ message: 'Error al obtener los usuarios' });
//   }
// };



// Importa RowDataPacket del paquete de mysql2

interface UserRow extends RowDataPacket {
  id: number;
  username: string;
  email: string | null;
  role: string;
  createdAt: Date; // o string si usas dateStrings: true en la conexión
}

export const getUsers = async (req: Request, res: Response) => {
  try {
    const sql = `
      SELECT 
        u.ID_USUARIO AS id,
        u.USERNAME AS username,
        u.EMAIL AS email,
        r.NOMBRE_ROL AS role,
        u.CREADO_EN AS createdAt
      FROM \`USUARIO\` u
      JOIN \`ROL\` r ON u.FK_ID_ROL = r.ID_ROL
      ORDER BY u.ID_USUARIO DESC;
    `;

    // OJO: el genérico debe ser UserRow[]
    const [rows] = await pool.query<UserRow[]>(sql);

    res.json(rows);
  }catch (error: any) {
  console.error('Error al obtener usuarios:', {
    name: error?.name,
    code: error?.code,         // p.ej. ER_NO_SUCH_TABLE, ER_BAD_FIELD_ERROR
    errno: error?.errno,
    sqlState: error?.sqlState,
    sqlMessage: error?.sqlMessage,
    sql: error?.sql,
    message: error?.message,
  });
  res.status(500).json({ message: 'Error al obtener los usuarios' });
}
};
