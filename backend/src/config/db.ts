import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

const sequelize = new Sequelize(
  process.env.DB_NAME!,
  process.env.DB_USER!,
  process.env.DB_PASSWORD!,
  {
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    dialect: 'mysql',
    logging: false, // Desactiva logs de SQL para no llenar la consola
  }
);

// Probar conexión
(async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Conectado a MySQL con Sequelize');
  } catch (err) {
    console.error('❌ Error de conexión a MySQL:', err);
  }
})();

export default sequelize;