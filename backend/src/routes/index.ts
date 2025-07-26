import express, { Router } from 'express';
import authRoutes from './authRoutes';
import workoutRoutes from './workoutRoutes';
import exerciseRoutes from './exerciseRoutes';
import exerciseProgressRoutes from './exerciseProgressRoutes';

// Clase para manejar todas las rutas de la aplicación
export class RouteManager {
  private router: Router;

  constructor() {
    this.router = express.Router();
    this.setupRoutes();
  }

  // Configurar todas las rutas
  private setupRoutes(): void {
    // Rutas de autenticación
    this.router.use('/auth', authRoutes);
    
    // Rutas de entrenamiento
    this.router.use('/workouts', workoutRoutes);
    
    // Rutas de ejercicios
    this.router.use('/exercises', exerciseRoutes);
    
    // Rutas de progreso de ejercicios
    this.router.use('/exercise-progress', exerciseProgressRoutes);
    
    // Ruta de prueba
    this.router.get('/', (req, res) => {
      res.send('API de Gym Track funcionando correctamente');
    });
  }

  // Obtener el router configurado
  getRouter(): Router {
    return this.router;
  }
}

// Exportar una instancia del router configurado
export default new RouteManager().getRouter(); 