import bcrypt from 'bcrypt';
import User from '../models/User';
import sequelize from '../config/db';

const seedUser = async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync({ alter: true });

    const adminhashedPassword = await bcrypt.hash('admin123', 10);
    await User.create({
      username: 'admin',
      password: adminhashedPassword, // Usa la contraseña cifrada
      email: 'admin@example.com', // Agrega un email válido
      rolId: 1, // Asigna el rol de admin (ajusta según sea necesario)
    });

    const userhashedPassword = await bcrypt.hash('user123', 10);
    await User.create({
      username: 'user',
      password: userhashedPassword,
      email: 'user@example.com',
      rolId: 2,
    });

    console.log('✅ Usuarios creados');
  } catch (error) {
    console.error('❌ Error al crear usuarios:', error);
  }
};

seedUser();