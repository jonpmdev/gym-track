import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import config from './config/config';
import authRoutes from './routes/authRoutes';
import workoutRoutes from './routes/workoutRoutes';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Rutas
app.use('/api/auth', authRoutes);
app.use('/api/workouts', workoutRoutes);

// Conexión a MongoDB
mongoose
  .connect(config.MONGODB_URI)
  .then(() => {
    console.log('Conectado a MongoDB');
    app.listen(config.PORT, () => {
      console.log(`Servidor corriendo en el puerto ${config.PORT}`);
    });
  })
  .catch((error) => {
    console.error('Error al conectar a MongoDB:', error);
    process.exit(1);
  }); 