import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes';
import userRoutes from './routes/userRoutes';
import laboratorioRoutes from './routes/laboratorioRoutes';
import modulosRoutes from './routes/modulosRoutes';
import proyectosRoutes from './routes/proyectosRoutes';
import { pool } from './config/db';
import homeAssistantRoutes from './routes/homeAssistantRoutes';
import rolRoutes from './routes/rolRoutes';
import dashboardRoutes from './routes/dashboardRoutes';
import { startHAWebsocketServer } from './services/haWebSocketService';

dotenv.config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Rutas
app.use('/api', authRoutes);
app.use('/api', userRoutes);
app.use('/api', laboratorioRoutes);
app.use('/api', modulosRoutes);
app.use('/api', proyectosRoutes);
app.use('/api', homeAssistantRoutes);
app.use('/api', rolRoutes);
app.use('/api', dashboardRoutes);

// Ruta raíz
app.get('/', (req: Request, res: Response) => {
  res.send('Backend de LabControl Pro corriendo...');
});

// Iniciar servidor
const PORT = process.env.PORT || 4000;

const startServer = async () => {
  try {
    const connection = await pool.getConnection();
    console.log('Conexión a MySQL establecida');
    connection.release();
    app.listen(PORT, () => {
      console.log(`Servidor corriendo en http://localhost:${PORT}`);
      // Iniciar el puente WebSocket para Unity y Home Assistant
      startHAWebsocketServer();
    });
  } catch (error) {
    console.error('Error al iniciar el servidor:', error);
  }
};

startServer();