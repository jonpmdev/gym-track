import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import exerciseModel from '../models/exerciseModel.prisma';
import { IExercise } from '../types/models';

class ExerciseController {
  // Obtener todos los ejercicios de un entrenamiento
  async getExercisesByWorkout(req: Request, res: Response) {
    try {
      const workoutId = req.params.workoutId;
      
      const exercises = await exerciseModel.findByWorkoutId(workoutId);
      
      return res.status(200).json({
        success: true,
        data: exercises
      });
    } catch (error) {
      console.error('Error al obtener ejercicios:', error);
      return res.status(500).json({
        success: false,
        message: 'Error al obtener ejercicios'
      });
    }
  }

  // Obtener un ejercicio por su ID
  async getExerciseById(req: Request, res: Response) {
    try {
      const exerciseId = req.params.id;
      
      const exercise = await exerciseModel.findById(exerciseId);
      
      if (!exercise) {
        return res.status(404).json({
          success: false,
          message: 'Ejercicio no encontrado'
        });
      }
      
      return res.status(200).json({
        success: true,
        data: exercise
      });
    } catch (error) {
      console.error('Error al obtener ejercicio:', error);
      return res.status(500).json({
        success: false,
        message: 'Error al obtener ejercicio'
      });
    }
  }

  // Crear un nuevo ejercicio
  async createExercise(req: Request, res: Response) {
    try {
      // Verificar errores de validación
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          errors: errors.array()
        });
      }
      
      const exerciseData: Omit<IExercise, 'id' | 'created_at' | 'updated_at'> = req.body;
      
      // Validación adicional
      if (!exerciseData.name || !exerciseData.workout_id) {
        return res.status(400).json({
          success: false,
          message: 'Debe incluir al menos un ejercicio'
        });
      }
      
      const newExercise = await exerciseModel.create(exerciseData);
      
      return res.status(201).json({
        success: true,
        data: newExercise
      });
    } catch (error) {
      console.error('Error al crear ejercicio:', error);
      return res.status(500).json({
        success: false,
        message: 'Error al crear ejercicio'
      });
    }
  }

  // Actualizar un ejercicio existente
  async updateExercise(req: Request, res: Response) {
    try {
      // Verificar errores de validación
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          errors: errors.array()
        });
      }
      
      const exerciseId = req.params.id;
      const exerciseData: Partial<IExercise> = req.body;
      
      const updatedExercise = await exerciseModel.update(exerciseId, exerciseData);
      
      if (!updatedExercise) {
        return res.status(404).json({
          success: false,
          message: 'Ejercicio no encontrado'
        });
      }
      
      return res.status(200).json({
        success: true,
        data: updatedExercise
      });
    } catch (error) {
      console.error('Error al actualizar ejercicio:', error);
      return res.status(500).json({
        success: false,
        message: 'Error al actualizar ejercicio'
      });
    }
  }

  // Eliminar un ejercicio
  async deleteExercise(req: Request, res: Response) {
    try {
      const exerciseId = req.params.id;
      
      const deleted = await exerciseModel.delete(exerciseId);
      
      if (!deleted) {
        return res.status(404).json({
          success: false,
          message: 'Ejercicio no encontrado'
        });
      }
      
      return res.status(200).json({
        success: true,
        message: 'Ejercicio eliminado correctamente'
      });
    } catch (error) {
      console.error('Error al eliminar ejercicio:', error);
      return res.status(500).json({
        success: false,
        message: 'Error al eliminar ejercicio'
      });
    }
  }

  // Marcar ejercicio como completado/no completado
  async toggleExerciseCompleted(req: Request, res: Response) {
    try {
      // Verificar errores de validación
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          errors: errors.array()
        });
      }
      
      const exerciseId = req.params.id;
      const { completed } = req.body;
      
      if (typeof completed !== 'boolean') {
        return res.status(400).json({
          success: false,
          message: 'El valor de "completed" debe ser un booleano'
        });
      }
      
      const updatedExercise = await exerciseModel.updateCompleted(exerciseId, completed);
      
      if (!updatedExercise) {
        return res.status(404).json({
          success: false,
          message: 'Ejercicio no encontrado'
        });
      }
      
      return res.status(200).json({
        success: true,
        data: updatedExercise
      });
    } catch (error) {
      console.error('Error al actualizar estado del ejercicio:', error);
      return res.status(500).json({
        success: false,
        message: 'Error al actualizar estado del ejercicio'
      });
    }
  }
}

export default new ExerciseController(); 