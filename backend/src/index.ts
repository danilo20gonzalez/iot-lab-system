import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import sequelize from './config/db';
import authRoutes from './routes/authRoutes';

dotenv.config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Rutas
app.use('/api', authRoutes);

// Ruta raíz
app.get('/', (req: Request, res: Response) => {
  res.send('🚀 Backend de LabControl Pro corriendo...');
});

// Iniciar servidor
const PORT = process.env.PORT || 4000;

const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Conexión a MySQL establecida');
    await sequelize.sync({ alter: true }); // Sincroniza modelos, ajusta tabla si es necesario
    console.log('✅ Tablas sincronizadas');
    app.listen(PORT, () => {
      console.log(`✅ Servidor corriendo en http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('❌ Error al iniciar el servidor:', error);
  }
};

startServer();