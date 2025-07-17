import { Router } from 'express';
import { check, validationResult } from 'express-validator';
import {
  getWorkouts,
  getWorkout,
  createWorkout,
  updateWorkout,
  deleteWorkout,
} from '../controllers/workoutController';
import { auth } from '../middleware/auth';

const router = Router();

// Middleware para validar errores
const validateErrors = (req: any, res: any, next: any) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ 
      message: 'Error de validación', 
      errors: errors.array() 
    });
  }
  next();
};

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
    check('title', 'El título del entrenamiento es obligatorio').not().isEmpty(),
    check('exercises', 'Debe incluir al menos un ejercicio').isArray({ min: 1 }),
    check('exercises.*.name', 'El nombre del ejercicio es obligatorio').not().isEmpty(),
    check('exercises.*.sets', 'El número de series es obligatorio').isNumeric(),
    check('exercises.*.reps', 'El número de repeticiones es obligatorio').not().isEmpty(),
    check('exercises.*.day', 'El día del ejercicio es obligatorio').not().isEmpty(),
  ],
  validateErrors,
  createWorkout
);

// Actualizar un entrenamiento
router.put(
  '/:id',
  [
    check('title', 'El título del entrenamiento es obligatorio').optional().not().isEmpty(),
    check('exercises').optional().isArray(),
    check('exercises.*.name', 'El nombre del ejercicio es obligatorio').optional().not().isEmpty(),
    check('exercises.*.sets', 'El número de series es obligatorio').optional().isNumeric(),
    check('exercises.*.reps', 'El número de repeticiones es obligatorio').optional().not().isEmpty(),
    check('exercises.*.day', 'El día del ejercicio es obligatorio').optional().not().isEmpty(),
  ],
  validateErrors,
  updateWorkout
);

// Eliminar un entrenamiento
router.delete('/:id', deleteWorkout);

export default router; 