import { Router } from 'express';
import { check } from 'express-validator';
import {
  getWorkouts,
  getWorkout,
  createWorkout,
  updateWorkout,
  deleteWorkout,
} from '../controllers/workoutController';
import { auth } from '../middleware/auth';

const router = Router();

// Todas las rutas requieren autenticación
router.use(auth);

// Obtener todos los entrenamientos
router.get('/', getWorkouts);

// Obtener un entrenamiento específico
router.get('/:id', getWorkout);

// Crear un nuevo entrenamiento
router.post(
  '/',
  [
    check('name', 'El nombre del entrenamiento es obligatorio').not().isEmpty(),
    check('exercises', 'Debe incluir al menos un ejercicio').isArray({ min: 1 }),
    check('exercises.*.name', 'El nombre del ejercicio es obligatorio').not().isEmpty(),
    check('exercises.*.sets', 'Debe incluir al menos una serie').isArray({ min: 1 }),
    check('exercises.*.sets.*.reps', 'El número de repeticiones es obligatorio').isNumeric(),
    check('exercises.*.sets.*.weight', 'El peso es obligatorio').isNumeric(),
  ],
  createWorkout
);

// Actualizar un entrenamiento
router.put(
  '/:id',
  [
    check('name', 'El nombre del entrenamiento es obligatorio').optional().not().isEmpty(),
    check('exercises').optional().isArray(),
    check('exercises.*.name', 'El nombre del ejercicio es obligatorio').optional().not().isEmpty(),
    check('exercises.*.sets').optional().isArray(),
    check('exercises.*.sets.*.reps', 'El número de repeticiones es obligatorio')
      .optional()
      .isNumeric(),
    check('exercises.*.sets.*.weight', 'El peso es obligatorio').optional().isNumeric(),
  ],
  updateWorkout
);

// Eliminar un entrenamiento
router.delete('/:id', deleteWorkout);

export default router; 