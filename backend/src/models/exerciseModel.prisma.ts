import prisma from '../config/prisma';
import { IExercise } from '../types/models';
import { v4 as uuidv4 } from 'uuid';
import { Prisma } from '@prisma/client';

class ExerciseModel {
  async findByWorkoutId(workoutId: string): Promise<IExercise[]> {
    const exercises = await prisma.exercise.findMany({
      where: { workout_id: workoutId },
      orderBy: { created_at: 'asc' }
    });

    return exercises.map(exercise => ({
      ...exercise,
      muscle_groups: exercise.muscle_groups as string[],
      created_at: exercise.created_at?.toISOString() || new Date().toISOString(),
      updated_at: exercise.updated_at?.toISOString() || new Date().toISOString()
    })) as IExercise[];
  }

  async findById(id: string): Promise<IExercise | null> {
    const exercise = await prisma.exercise.findUnique({
      where: { id }
    });

    if (!exercise) return null;

    return {
      ...exercise,
      muscle_groups: exercise.muscle_groups as string[],
      created_at: exercise.created_at?.toISOString() || new Date().toISOString(),
      updated_at: exercise.updated_at?.toISOString() || new Date().toISOString()
    } as IExercise;
  }

  async create(exerciseData: Omit<IExercise, 'id' | 'created_at' | 'updated_at'>): Promise<IExercise> {
    const exercise = await prisma.exercise.create({
      data: {
        id: uuidv4(),
        ...exerciseData,
        muscle_groups: exerciseData.muscle_groups || []
      }
    });

    return {
      ...exercise,
      muscle_groups: exercise.muscle_groups as string[],
      created_at: exercise.created_at?.toISOString() || new Date().toISOString(),
      updated_at: exercise.updated_at?.toISOString() || new Date().toISOString()
    } as IExercise;
  }

  async createMany(exercisesData: Omit<IExercise, 'id' | 'created_at' | 'updated_at'>[]): Promise<number> {
    // Prisma no soporta createMany con arrays, así que tenemos que crear uno por uno
    let count = 0;
    for (const exerciseData of exercisesData) {
      await this.create(exerciseData);
      count++;
    }
    return count;
  }

  async update(id: string, exerciseData: Partial<IExercise>): Promise<IExercise | null> {
    try {
      const exercise = await prisma.exercise.update({
        where: { id },
        data: {
          ...exerciseData,
          muscle_groups: exerciseData.muscle_groups !== undefined 
            ? exerciseData.muscle_groups 
            : undefined
        }
      });

      return {
        ...exercise,
        muscle_groups: exercise.muscle_groups as string[],
        created_at: exercise.created_at?.toISOString() || new Date().toISOString(),
        updated_at: exercise.updated_at?.toISOString() || new Date().toISOString()
      } as IExercise;
    } catch (error) {
      return null;
    }
  }

  async delete(id: string): Promise<boolean> {
    try {
      await prisma.exercise.delete({
        where: { id }
      });
      return true;
    } catch (error) {
      return false;
    }
  }

  async deleteByWorkoutId(workoutId: string): Promise<number> {
    const result = await prisma.exercise.deleteMany({
      where: { workout_id: workoutId }
    });
    return result.count;
  }

  async updateCompleted(id: string, completed: boolean): Promise<IExercise | null> {
    try {
      const exercise = await prisma.exercise.update({
        where: { id },
        data: { completed }
      });

      return {
        ...exercise,
        muscle_groups: exercise.muscle_groups as string[],
        created_at: exercise.created_at?.toISOString() || new Date().toISOString(),
        updated_at: exercise.updated_at?.toISOString() || new Date().toISOString()
      } as IExercise;
    } catch (error) {
      return null;
    }
  }
}

export default new ExerciseModel(); 