import { Request, Response } from 'express';
import { ExerciseService } from '../services/exerciseService';
import { IExercise } from '../types/models';
import container from '../config/di';

class ExerciseController {
  private exerciseService: ExerciseService;

  constructor() {
    // Obtener el servicio del contenedor de inyección de dependencias
    this.exerciseService = container.getService<ExerciseService>('exerciseService');
  }

  // Obtener todos los ejercicios de un entrenamiento
  async getExercisesByWorkout(req: Request, res: Response) {
    try {
      const workoutId = req.params.workoutId;
      
      const exercises = await this.exerciseService.getExercisesByWorkout(workoutId);
      
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
      
      const exercise = await this.exerciseService.getExerciseById(exerciseId);
      
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
      const exerciseData: Omit<IExercise, 'id' | 'created_at' | 'updated_at'> = req.body;
      
      // Validación adicional de datos requeridos
      if (!exerciseData.name || !exerciseData.workout_id) {
        return res.status(400).json({
          success: false,
          message: 'Debe incluir al menos un nombre y un ID de entrenamiento'
        });
      }
      
      const newExercise = await this.exerciseService.createExercise(exerciseData);
      
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
      const exerciseId = req.params.id;
      const exerciseData: Partial<IExercise> = req.body;
      
      const updatedExercise = await this.exerciseService.updateExercise(exerciseId, exerciseData);
      
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
      
      const deleted = await this.exerciseService.deleteExercise(exerciseId);
      
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
      const exerciseId = req.params.id;
      const { completed } = req.body;
      
      const updatedExercise = await this.exerciseService.toggleExerciseCompleted(exerciseId, completed);
      
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