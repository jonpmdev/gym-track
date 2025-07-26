import { IExercise, IWorkout, IUser, IProgress, IExerciseProgress } from './models';

export interface IRepository<T> {
  findById(id: string): Promise<T | null>;
  create(data: Omit<T, 'id' | 'created_at' | 'updated_at'>): Promise<T>;
  update(id: string, data: Partial<T>): Promise<T | null>;
  delete(id: string): Promise<boolean>;
}

export interface IExerciseRepository extends IRepository<IExercise> {
  findByWorkoutId(workoutId: string): Promise<IExercise[]>;
  createMany(exercisesData: Omit<IExercise, 'id' | 'created_at' | 'updated_at'>[]): Promise<number>;
  deleteByWorkoutId(workoutId: string): Promise<number>;
}

export interface IWorkoutRepository extends IRepository<IWorkout> {
  findByUserId(userId: string): Promise<IWorkout[]>;
  updateCompleted(id: string, completed: boolean): Promise<IWorkout | null>;
}

export interface IUserRepository extends IRepository<IUser> {
  findByEmail(email: string): Promise<IUser | null>;
}

export interface IProgressRepository extends IRepository<IProgress> {
  findByUserId(userId: string): Promise<IProgress[]>;
}

export interface IExerciseProgressRepository extends IRepository<IExerciseProgress> {
  findByExerciseId(exerciseId: string): Promise<IExerciseProgress[]>;
} 