import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import workoutModel from '../models/workoutModel.prisma'; // Cambiado a la versión de Prisma
import { IWorkout } from '../types/models';

// Extender la interfaz Request para incluir el usuario autenticado
interface AuthRequest extends Request {
  user?: {
    id: string;
  };
}

// Obtener todos los entrenamientos del usuario
export const getWorkouts = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    
    console.log('getWorkouts - ID de usuario:', userId);
    
    if (!userId) {
      return res.status(401).json({ message: 'No autorizado' });
    }

    // Obtener el límite de la consulta
    const limit = req.query.limit ? parseInt(req.query.limit as string) : undefined;
    console.log('getWorkouts - Límite:', limit);

    const workouts = await workoutModel.findByUserId(userId, limit);
    console.log(`getWorkouts - Encontrados ${workouts.length} entrenamientos`);
    
    res.status(200).json(workouts);
  } catch (error: any) {
    console.error('Error al obtener entrenamientos:', error);
    res.status(500).json({ message: 'Error en el servidor', error: error.message });
  }
};

// Obtener un entrenamiento específico
export const getWorkout = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const workoutId = req.params.id;
    
    if (!userId) {
      return res.status(401).json({ message: 'No autorizado' });
    }

    const workout = await workoutModel.findById(workoutId, userId);
    
    if (!workout) {
      return res.status(404).json({ message: 'Entrenamiento no encontrado' });
    }
    
    res.status(200).json({ workout });
  } catch (error: any) {
    console.error('Error al obtener entrenamiento:', error);
    res.status(500).json({ message: 'Error en el servidor', error: error.message });
  }
};

// Crear un nuevo entrenamiento
export const createWorkout = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    
    if (!userId) {
      return res.status(401).json({ message: 'No autorizado' });
    }

    const { title, exercises, notes, completed } = req.body;
    
    const newWorkout = await workoutModel.create({
      user_id: userId,
      title,
      exercises,
      notes,
      completed: completed || false
    });
    
    res.status(201).json({ 
      message: 'Entrenamiento creado exitosamente',
      workout: newWorkout 
    });
  } catch (error: any) {
    console.error('Error al crear entrenamiento:', error);
    res.status(500).json({ message: 'Error en el servidor', error: error.message });
  }
};

// Actualizar un entrenamiento existente
export const updateWorkout = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const workoutId = req.params.id;
    
    if (!userId) {
      return res.status(401).json({ message: 'No autorizado' });
    }

    const { title, exercises, notes, completed } = req.body;
    
    const updatedWorkout = await workoutModel.update(workoutId, userId, {
      title,
      exercises,
      notes,
      completed
    });
    
    if (!updatedWorkout) {
      return res.status(404).json({ message: 'Entrenamiento no encontrado' });
    }
    
    res.status(200).json({ 
      message: 'Entrenamiento actualizado exitosamente',
      workout: updatedWorkout 
    });
  } catch (error: any) {
    console.error('Error al actualizar entrenamiento:', error);
    res.status(500).json({ message: 'Error en el servidor', error: error.message });
  }
};

// Eliminar un entrenamiento
export const deleteWorkout = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const workoutId = req.params.id;
    
    if (!userId) {
      return res.status(401).json({ message: 'No autorizado' });
    }

    const success = await workoutModel.delete(workoutId, userId);
    
    if (!success) {
      return res.status(404).json({ message: 'Entrenamiento no encontrado' });
    }
    
    res.status(200).json({ message: 'Entrenamiento eliminado exitosamente' });
  } catch (error: any) {
    console.error('Error al eliminar entrenamiento:', error);
    res.status(500).json({ message: 'Error en el servidor', error: error.message });
  }
}; 