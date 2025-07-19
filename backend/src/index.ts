import express from 'express';
import cors from 'cors';
import config from './config/config';
import authRoutes from './routes/authRoutes';
import workoutRoutes from './routes/workoutRoutes';
import prisma from './config/prisma';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Rutas
app.use('/api/auth', authRoutes);
app.use('/api/workouts', workoutRoutes);

// Ruta de prueba
app.get('/', (req, res) => {
  res.send('API de Gym Track funcionando correctamente');
});

// Iniciar el servidor
const PORT = config.PORT;
app.listen(PORT, async () => {
  try {
    // Verificar conexión con Prisma
    await prisma.$connect();
    console.log('Conexión a la base de datos establecida correctamente');
    console.log(`Servidor corriendo en el puerto ${PORT}`);
  } catch (error) {
    console.error('Error al conectar con la base de datos:', error);
    process.exit(1);
  }
});

// Manejar cierre del servidor
process.on('SIGINT', async () => {
  await prisma.$disconnect();
  console.log('Conexión a la base de datos cerrada');
  process.exit(0);
}); 