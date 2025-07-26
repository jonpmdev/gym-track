import prisma from '../config/prisma';
import { IExercise } from '../types/models';
import { IExerciseRepository } from '../types/repositories';
import { v4 as uuidv4 } from 'uuid';

export class PrismaExerciseRepository implements IExerciseRepository {
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
}

// Implementación en memoria para pruebas
export class InMemoryExerciseRepository implements IExerciseRepository {
  private exercises: IExercise[] = [];

  async findByWorkoutId(workoutId: string): Promise<IExercise[]> {
    return this.exercises.filter(exercise => exercise.workout_id === workoutId);
  }

  async findById(id: string): Promise<IExercise | null> {
    const exercise = this.exercises.find(exercise => exercise.id === id);
    return exercise || null;
  }

  async create(exerciseData: Omit<IExercise, 'id' | 'created_at' | 'updated_at'>): Promise<IExercise> {
    const newExercise: IExercise = {
      id: uuidv4(),
      ...exerciseData,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    this.exercises.push(newExercise);
    return newExercise;
  }

  async createMany(exercisesData: Omit<IExercise, 'id' | 'created_at' | 'updated_at'>[]): Promise<number> {
    let count = 0;
    for (const exerciseData of exercisesData) {
      await this.create(exerciseData);
      count++;
    }
    return count;
  }

  async update(id: string, exerciseData: Partial<IExercise>): Promise<IExercise | null> {
    const index = this.exercises.findIndex(exercise => exercise.id === id);
    
    if (index === -1) {
      return null;
    }

    this.exercises[index] = {
      ...this.exercises[index],
      ...exerciseData,
      updated_at: new Date().toISOString()
    };

    return this.exercises[index];
  }

  async delete(id: string): Promise<boolean> {
    const initialLength = this.exercises.length;
    this.exercises = this.exercises.filter(exercise => exercise.id !== id);
    return initialLength > this.exercises.length;
  }

  async deleteByWorkoutId(workoutId: string): Promise<number> {
    const initialLength = this.exercises.length;
    this.exercises = this.exercises.filter(exercise => exercise.workout_id !== workoutId);
    return initialLength - this.exercises.length;
  }
} 