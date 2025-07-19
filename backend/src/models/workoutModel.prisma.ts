import prisma from '../config/prisma';
import { IWorkout } from '../types/models';
import { v4 as uuidv4 } from 'uuid';

class WorkoutModel {
  async findByUserId(userId: string, limit?: number): Promise<IWorkout[]> {
    const workouts = await prisma.workout.findMany({
      where: { user_id: userId },
      orderBy: { created_at: 'desc' },
      take: limit
    });

    return workouts.map(workout => ({
      ...workout,
      exercises: workout.exercises as any,
      created_at: workout.created_at?.toISOString() || new Date().toISOString(),
      updated_at: workout.updated_at?.toISOString() || new Date().toISOString()
    })) as IWorkout[];
  }

  async findById(id: string, userId: string): Promise<IWorkout | null> {
    const workout = await prisma.workout.findFirst({
      where: {
        id,
        user_id: userId
      }
    });

    if (!workout) return null;

    return {
      ...workout,
      exercises: workout.exercises as any,
      created_at: workout.created_at?.toISOString() || new Date().toISOString(),
      updated_at: workout.updated_at?.toISOString() || new Date().toISOString()
    } as IWorkout;
  }

  async create(workoutData: Omit<IWorkout, 'id'>): Promise<IWorkout> {
    // Asegurar que cada ejercicio tenga un ID único
    const exercises = workoutData.exercises.map(exercise => ({
      ...exercise,
      id: exercise.id || uuidv4()
    }));

    const workout = await prisma.workout.create({
      data: {
        ...workoutData,
        exercises: exercises as any
      }
    });

    return {
      ...workout,
      exercises: workout.exercises as any,
      created_at: workout.created_at?.toISOString() || new Date().toISOString(),
      updated_at: workout.updated_at?.toISOString() || new Date().toISOString()
    } as IWorkout;
  }

  async update(id: string, userId: string, workoutData: Partial<IWorkout>): Promise<IWorkout | null> {
    // Si hay ejercicios, asegurar que cada uno tenga un ID
    if (workoutData.exercises) {
      workoutData.exercises = workoutData.exercises.map(exercise => ({
        ...exercise,
        id: exercise.id || uuidv4()
      }));
    }

    try {
      const workout = await prisma.workout.update({
        where: {
          id,
          user_id: userId
        },
        data: {
          ...workoutData,
          exercises: workoutData.exercises ? workoutData.exercises as any : undefined
        }
      });

      return {
        ...workout,
        exercises: workout.exercises as any,
        created_at: workout.created_at?.toISOString() || new Date().toISOString(),
        updated_at: workout.updated_at?.toISOString() || new Date().toISOString()
      } as IWorkout;
    } catch (error) {
      return null;
    }
  }

  async delete(id: string, userId: string): Promise<boolean> {
    try {
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