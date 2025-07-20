import express from 'express';
import { body, param } from 'express-validator';
import exerciseController from '../controllers/exerciseController';
import { auth } from '../middleware/auth';

const router = express.Router();

// Aplicar middleware de autenticación a todas las rutas
router.use(auth);

// Rutas para ejercicios
router.get('/workout/:workoutId', exerciseController.getExercisesByWorkout);
router.get('/:id', exerciseController.getExerciseById);

// Validaciones para crear ejercicio
router.post('/', [
  body('name').notEmpty().withMessage('El nombre del ejercicio es obligatorio'),
  body('workout_id').notEmpty().withMessage('El ID del entrenamiento es obligatorio'),
  body('sets').isInt({ min: 1 }).withMessage('Las series deben ser un número entero mayor a 0'),
  body('reps').notEmpty().withMessage('Las repeticiones son obligatorias'),
  body('day').notEmpty().withMessage('El día es obligatorio')
], exerciseController.createExercise);

// Validaciones para actualizar ejercicio
router.put('/:id', [
  param('id').isString().withMessage('ID de ejercicio inválido'),
  body('name').optional().notEmpty().withMessage('El nombre no puede estar vacío'),
  body('sets').optional().isInt({ min: 1 }).withMessage('Las series deben ser un número entero mayor a 0'),
  body('reps').optional().notEmpty().withMessage('Las repeticiones no pueden estar vacías'),
], exerciseController.updateExercise);

router.delete('/:id', exerciseController.deleteExercise);

// Validaciones para marcar ejercicio como completado
router.patch('/:id/completed', [
  param('id').isString().withMessage('ID de ejercicio inválido'),
  body('completed').isBoolean().withMessage('El valor de "completed" debe ser un booleano')
], exerciseController.toggleExerciseCompleted);

export default router; 