import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import Joi from 'joi';
import { pool } from '../config/db';
import { RowDataPacket } from 'mysql2';

const loginSchema = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().required(),
});

interface User extends RowDataPacket{
  id_usuario: number;
  username: string;
  password: string;
  fk_id_rol: 'admin' | 'user';
}

export const login = async (username: string, password: string) => {
  // Validar datos de entrada
  const { error } = loginSchema.validate({ username, password });
  if (error) throw new Error(error.details[0].message);

  // Consultar usuario con SQL crudo
  const [rows] = await pool.query<User[]>(
    'SELECT id_usuario, username, password, fk_id_rol FROM usuario WHERE username = ?',
    [username] 
  );
  const user = rows[0];
  if (!user) throw new Error('Usuario o contraseña inválidos');

  // Verificar contraseña
  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) throw new Error('Usuario o contraseña inválidos');

  // Generar token JWT
  const token = jwt.sign(
    { id_usuario: user.id_usuario, fk_id_rol: user.fk_id_rol },
    process.env.JWT_SECRET!,
    { expiresIn: '1h' }
  );

  return {
    token,
    user: { 
      id_usuario: user.id_usuario,
      username: user.username,
      fk_id_rol: user.fk_id_rol,
    },
  };
};