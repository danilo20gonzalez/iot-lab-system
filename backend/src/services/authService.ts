import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import Joi from 'joi';
import User from '../models/User';

const loginSchema = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().required(),
});

export const login = async (username: string, password: string) => {
  // Validar datos de entrada
  const { error } = loginSchema.validate({ username, password });
  if (error) throw new Error(error.details[0].message);

  // Buscar usuario en la base de datos
  const user = await User.findOne({ where: { username } });
  if (!user) throw new Error('Usuario o contraseña inválidos');

  // Verificar contraseña
  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) throw new Error('Usuario o contraseña inválidos');

  // Generar token JWT
  const token = jwt.sign(
    { id: user.id, rolId: user.rolId },
    process.env.JWT_SECRET!,
    { expiresIn: '1h' }
  );

  return {
    token,
    user: {
      id: user.id,
      username: user.username,
      rolId: user.rolId,
    },
  };
};