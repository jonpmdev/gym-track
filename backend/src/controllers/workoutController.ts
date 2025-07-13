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
      .sort({ date: -1 });
    res.json(workouts);
  } catch (error) {
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
    res.status(500).json({ message: 'Error al obtener el entrenamiento' });
  }
};

// Crear un nuevo entrenamiento
export const createWorkout = async (req: AuthRequest, res: Response) => {
  try {
    const workout = new Workout({
      ...req.body,
      user: req.user?._id,
    });

    await workout.save();
    res.status(201).json(workout);
  } catch (error) {
    res.status(500).json({ message: 'Error al crear el entrenamiento' });
  }
};

// Actualizar un entrenamiento
export const updateWorkout = async (req: AuthRequest, res: Response) => {
  try {
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
    res.status(500).json({ message: 'Error al actualizar el entrenamiento' });
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
    res.status(500).json({ message: 'Error al eliminar el entrenamiento' });
  }
}; 