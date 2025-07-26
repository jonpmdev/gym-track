import express from 'express';
import { body, param } from 'express-validator';
import exerciseController from '../controllers/exerciseController';
import { auth } from '../middleware/auth';
import { ValidationService } from '../services/validationService';

const router = express.Router();

// Aplicar middleware de autenticación a todas las rutas
router.use(auth);

// Validaciones para ejercicios
const createExerciseValidations = [
  body('name').notEmpty().withMessage('El nombre del ejercicio es obligatorio'),
  body('workout_id').notEmpty().withMessage('El ID del entrenamiento es obligatorio'),
  body('sets').isInt({ min: 1 }).withMessage('Las series deben ser un número entero mayor a 0'),
  body('reps').notEmpty().withMessage('Las repeticiones son obligatorias'),
  body('day').notEmpty().withMessage('El día es obligatorio')
];

const updateExerciseValidations = [
  param('id').isString().withMessage('ID de ejercicio inválido'),
  body('name').optional().notEmpty().withMessage('El nombre no puede estar vacío'),
  body('sets').optional().isInt({ min: 1 }).withMessage('Las series deben ser un número entero mayor a 0'),
  body('reps').optional().notEmpty().withMessage('Las repeticiones no pueden estar vacías'),
];

const toggleCompletedValidations = [
  param('id').isString().withMessage('ID de ejercicio inválido'),
  body('completed').isBoolean().withMessage('El valor de "completed" debe ser un booleano')
];

// Rutas para ejercicios
router.get('/workout/:workoutId', exerciseController.getExercisesByWorkout);
router.get('/:id', exerciseController.getExerciseById);
router.post('/', ValidationService.validate(createExerciseValidations), exerciseController.createExercise);
router.put('/:id', ValidationService.validate(updateExerciseValidations), exerciseController.updateExercise);
router.delete('/:id', exerciseController.deleteExercise);
router.patch('/:id/completed', ValidationService.validate(toggleCompletedValidations), exerciseController.toggleExerciseCompleted);

export default router; 