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
    // Verificar que el usuario esté autenticado
    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: 'Usuario no autenticado' });
    }

    // Verificar que se proporcionen los campos requeridos
    if (!req.body.title) {
      return res.status(400).json({ message: 'El título del entrenamiento es obligatorio' });
    }

    if (!req.body.exercises || !Array.isArray(req.body.exercises) || req.body.exercises.length === 0) {
      return res.status(400).json({ message: 'Debe incluir al menos un ejercicio' });
    }

    // Validar cada ejercicio
    const validatedExercises = [];
    for (const exercise of req.body.exercises) {
      if (!exercise.name || exercise.sets === undefined || !exercise.reps || !exercise.day) {
        return res.status(400).json({ 
          message: 'Cada ejercicio debe incluir nombre, series, repeticiones y día' 
        });
      }

      // Asegurar que los tipos de datos sean correctos según la validación del esquema
      const validatedExercise = {
        name: String(exercise.name),
        sets: Number(exercise.sets),
        reps: String(exercise.reps),
        weight: exercise.weight !== undefined ? Number(exercise.weight) : 0,
        rest: exercise.rest !== undefined ? String(exercise.rest) : '60',
        muscleGroups: Array.isArray(exercise.muscleGroups) ? exercise.muscleGroups.map(String) : [],
        focus: exercise.focus !== undefined ? String(exercise.focus) : '',
        completed: exercise.completed !== undefined ? Boolean(exercise.completed) : false,
        day: String(exercise.day)
      };

      validatedExercises.push(validatedExercise);
    }

    // Crear el objeto de entrenamiento
    const workoutData = {
      title: String(req.body.title),
      exercises: validatedExercises,
      notes: req.body.notes ? String(req.body.notes) : '',
      completed: false,
      user: req.user._id,
    };

    // Crear y guardar el entrenamiento
    const workout = new Workout(workoutData);

    try {
      await workout.validate();
    } catch (validationError) {
      console.error('Error de validación:', validationError);
      return res.status(400).json({ 
        message: 'Error de validación en los datos del entrenamiento',
        error: validationError
      });
    }

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
    // y que los tipos de datos sean correctos
    if (req.body.exercises) {
      // Validar que todos los ejercicios tengan los campos requeridos
      for (const exercise of req.body.exercises) {
        if (!exercise.name || exercise.sets === undefined || !exercise.reps || !exercise.day) {
          return res.status(400).json({ 
            message: 'Cada ejercicio debe incluir nombre, series, repeticiones y día' 
          });
        }
      }

      req.body.exercises = req.body.exercises.map((exercise: any) => ({
        name: String(exercise.name),
        sets: Number(exercise.sets),
        reps: String(exercise.reps),
        weight: exercise.weight !== undefined ? Number(exercise.weight) : 0,
        rest: exercise.rest !== undefined ? String(exercise.rest) : '60',
        muscleGroups: Array.isArray(exercise.muscleGroups) ? exercise.muscleGroups.map(String) : [],
        focus: exercise.focus !== undefined ? String(exercise.focus) : '',
        completed: exercise.completed !== undefined ? Boolean(exercise.completed) : false,
        day: String(exercise.day)
      }));
    }

    // Preparar los datos para la actualización
    const updateData = { ...req.body };
    if (updateData.title) {
      updateData.title = String(updateData.title);
    }
    if (updateData.notes !== undefined) {
      updateData.notes = String(updateData.notes);
    }
    if (updateData.completed !== undefined) {
      updateData.completed = Boolean(updateData.completed);
    }

    // Validar los datos antes de actualizar
    const tempWorkout = new Workout(updateData);
    try {
      // Validar solo los campos que se están actualizando
      await tempWorkout.validate();
    } catch (validationError) {
      console.error('Error de validación:', validationError);
      return res.status(400).json({ 
        message: 'Error de validación en los datos del entrenamiento',
        error: validationError
      });
    }

    const workout = await Workout.findOneAndUpdate(
      {
        _id: req.params.id,
        user: req.user?._id,
      },
      updateData,
      { new: true, runValidators: true }
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