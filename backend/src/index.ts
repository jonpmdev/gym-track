import express, { Request, Response } from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

// Cargar variables de entorno
dotenv.config();

// Crear la aplicación Express
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Rutas básicas
app.get('/', (_req: Request, res: Response) => {
  res.json({ message: 'API de Gym Track funcionando correctamente' });
});

// Importar rutas
// app.use('/api/users', require('./routes/userRoutes'));
// app.use('/api/workouts', require('./routes/workoutRoutes'));
// app.use('/api/exercises', require('./routes/exerciseRoutes'));
// app.use('/api/progress', require('./routes/progressRoutes'));

// Puerto
const PORT = process.env.PORT || 5000;

// Conectar a MongoDB y iniciar servidor
mongoose
  .connect(process.env.MONGODB_URI as string)
  .then(() => {
    console.log('Conectado a MongoDB');
    app.listen(PORT, () => {
      console.log(`Servidor corriendo en puerto ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Error al conectar a MongoDB:', err.message);
  }); 