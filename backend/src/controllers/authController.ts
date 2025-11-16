import { Request, Response } from 'express';
import * as authService from '../services/authService';

export const login = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;
    const result = await authService.login(username, password);
    res.status(200).json(result);
  } catch (error: any) {
    console.error('Error en la autenticación:', error);
    res.status(401).json({ error: 'Usuario o contraseña inválidos' });
  }
};