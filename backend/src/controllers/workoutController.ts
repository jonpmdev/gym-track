import { Request, Response } from 'express';
import Workout from '../models/workoutModel';
import { IUser } from '../types/models';

interface AuthRequest extends Request {
  user?: IUser;
}

// Obtener todos los entrenamientos del usuario
export const getWorkouts = async (req: AuthRequest, res: Response) => {
  try {
    const workouts = await Workout.find({ user: req.user?._id })
      .sort({ createdAt: -1 });
    res.json(workouts);
  } catch (error) {
    console.error('Error al obtener los entrenamientos:', error);
    res.status(500).json({ message: 'Error al obtener los entrenamientos' });
  }
};

// Obtener un entrenamiento específico
export const getWorkout = async (req: AuthRequest, res: Response) => {
  try {
    const workout = await Workout.findOne({
      _id: req.params.id,
      user: req.user?._id,
    });

    if (!workout) {
      return res.status(404).json({ message: 'Entrenamiento no encontrado' });
    }

    res.json(workout);
  } catch (error) {
    console.error('Error al obtener el entrenamiento:', error);
    res.status(500).json({ message: 'Error al obtener el entrenamiento' });
  }
};

// Crear un nuevo entrenamiento
export const createWorkout = async (req: AuthRequest, res: Response) => {
  try {
    // Asegurarse de que cada ejercicio tenga el campo completed
    const exercises = req.body.exercises.map((exercise: any) => ({
      ...exercise,
      completed: exercise.completed !== undefined ? exercise.completed : false
    }));

    const workout = new Workout({
      ...req.body,
      exercises,
      user: req.user?._id,
    });

    await workout.save();
    res.status(201).json(workout);
  } catch (error) {
    console.error('Error al crear el entrenamiento:', error);
    res.status(500).json({ 
      message: 'Error al crear el entrenamiento',
      error: error instanceof Error ? error.message : 'Error desconocido'
    });
  }
};

// Actualizar un entrenamiento
export const updateWorkout = async (req: AuthRequest, res: Response) => {
  try {
    // Si se actualizan ejercicios, asegurarse de que cada uno tenga el campo completed
    if (req.body.exercises) {
      req.body.exercises = req.body.exercises.map((exercise: any) => ({
        ...exercise,
        completed: exercise.completed !== undefined ? exercise.completed : false
      }));
    }

    const workout = await Workout.findOneAndUpdate(
      {
        _id: req.params.id,
        user: req.user?._id,
      },
      req.body,
      { new: true }
    );

    if (!workout) {
      return res.status(404).json({ message: 'Entrenamiento no encontrado' });
    }

    res.json(workout);
  } catch (error) {
    console.error('Error al actualizar el entrenamiento:', error);
    res.status(500).json({ 
      message: 'Error al actualizar el entrenamiento',
      error: error instanceof Error ? error.message : 'Error desconocido'
    });
  }
};

// Eliminar un entrenamiento
export const deleteWorkout = async (req: AuthRequest, res: Response) => {
  try {
    const workout = await Workout.findOneAndDelete({
      _id: req.params.id,
      user: req.user?._id,
    });

    if (!workout) {
      return res.status(404).json({ message: 'Entrenamiento no encontrado' });
    }

    res.json({ message: 'Entrenamiento eliminado correctamente' });
  } catch (error) {
    console.error('Error al eliminar el entrenamiento:', error);
    res.status(500).json({ message: 'Error al eliminar el entrenamiento' });
  }
}; 