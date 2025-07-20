import express from 'express';
import { 
  getExerciseProgress,
  getExerciseProgressById,
  createExerciseProgress,
  updateExerciseProgress,
  deleteExerciseProgress
} from '../controllers/exerciseProgressController';
import { auth } from '../middleware/auth';

const router = express.Router();

// Todas las rutas requieren autenticación
router.use(auth);

// Obtener todos los registros de progreso de un ejercicio
router.get('/exercise/:exerciseId', getExerciseProgress);

// Obtener un registro de progreso específico
router.get('/:id', getExerciseProgressById);

// Crear un nuevo registro de progreso
router.post('/', createExerciseProgress);

// Actualizar un registro de progreso
router.put('/:id', updateExerciseProgress);

// Eliminar un registro de progreso
router.delete('/:id', deleteExerciseProgress);

export default router; 