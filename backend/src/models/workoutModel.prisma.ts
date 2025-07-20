import prisma from '../config/prisma';
import { IWorkout, IExercise } from '../types/models';
import { v4 as uuidv4 } from 'uuid';
import exerciseModel from './exerciseModel.prisma';

class WorkoutModel {
  async findByUserId(userId: string, limit?: number): Promise<IWorkout[]> {
    const workouts = await prisma.workout.findMany({
      where: { user_id: userId },
      orderBy: { created_at: 'desc' },
      take: limit,
      include: {
        exercises: true
      }
    });

    return workouts.map(workout => ({
      ...workout,
      created_at: workout.created_at?.toISOString() || new Date().toISOString(),
      updated_at: workout.updated_at?.toISOString() || new Date().toISOString()
    })) as IWorkout[];
  }

  async findById(id: string, userId: string): Promise<IWorkout | null> {
    const workout = await prisma.workout.findFirst({
      where: {
        id,
        user_id: userId
      },
      include: {
        exercises: true
      }
    });

    if (!workout) return null;

    return {
      ...workout,
      created_at: workout.created_at?.toISOString() || new Date().toISOString(),
      updated_at: workout.updated_at?.toISOString() || new Date().toISOString()
    } as IWorkout;
  }

  async create(workoutData: Omit<IWorkout, 'id' | 'created_at' | 'updated_at'>): Promise<IWorkout> {
    const { exercises, ...workoutDetails } = workoutData;
    
    // Crear el entrenamiento primero
    const workoutId = uuidv4();
    const workout = await prisma.workout.create({
      data: {
        id: workoutId,
        ...workoutDetails
      }
    });

    // Si hay ejercicios, crearlos asociados al entrenamiento
    if (exercises && exercises.length > 0) {
      const exercisesData = exercises.map(exercise => ({
        ...exercise,
        workout_id: workoutId
      }));
      
      await exerciseModel.createMany(exercisesData);
    }

    // Obtener el entrenamiento con los ejercicios
    return this.findById(workoutId, workoutData.user_id) as Promise<IWorkout>;
  }

  async update(id: string, userId: string, workoutData: Partial<IWorkout>): Promise<IWorkout | null> {
    const { exercises, ...workoutDetails } = workoutData;
    
    try {
      // Actualizar los datos del entrenamiento
      await prisma.workout.update({
        where: {
          id,
          user_id: userId
        },
        data: workoutDetails
      });

      // Si se proporcionan ejercicios, actualizar los ejercicios
      if (exercises) {
        // Eliminar ejercicios existentes
        await exerciseModel.deleteByWorkoutId(id);
        
        // Crear nuevos ejercicios
        if (exercises.length > 0) {
          const exercisesData = exercises.map(exercise => ({
            ...exercise,
            workout_id: id
          }));
          
          await exerciseModel.createMany(exercisesData);
        }
      }

      // Obtener el entrenamiento actualizado con los ejercicios
      return this.findById(id, userId);
    } catch (error) {
      return null;
    }
  }

  async delete(id: string, userId: string): Promise<boolean> {
    try {
      // Al eliminar el entrenamiento, los ejercicios se eliminarán en cascada
      // gracias a la relación definida en el esquema de Prisma
      await prisma.workout.delete({
        where: {
          id,
          user_id: userId
        }
      });
      return true;
    } catch (error) {
      return false;
    }
  }
}

export default new WorkoutModel(); 