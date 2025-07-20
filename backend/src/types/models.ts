import { Decimal } from '@prisma/client/runtime/library';

export interface IMeasurements {
  chest?: number;
  waist?: number;
  hips?: number;
  biceps?: number;
  thighs?: number;
}

export interface IUser {
  id: string;
  name: string;
  email: string;
  password: string;
  weight?: Decimal | string;
  height?: Decimal | string;
  measurements?: IMeasurements;
  created_at?: string;
  updated_at?: string;
}

export interface IExercise {
  id: string;
  workout_id: string;
  name: string;
  sets: number;
  reps: string;
  weight?: number | Decimal;
  rest?: string;
  muscle_groups?: string[];
  focus?: string;
  completed?: boolean;
  day: string;
  created_at?: string;
  updated_at?: string;
  exerciseProgress?: IExerciseProgress[];
}

export interface IWorkout {
  id: string;
  user_id: string;
  title: string;
  exercises?: IExercise[];
  notes?: string;
  completed?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface IProgress {
  id: string;
  user_id: string;
  date: string;
  weight: Decimal | string;
  measurements?: IMeasurements;
  notes?: string;
  created_at?: string;
  updated_at?: string;
}

export interface IExerciseProgress {
  id: string;
  exercise_id: string;
  weight: Decimal | string;
  date: string;
  notes?: string;
  created_at?: string;
  updated_at?: string;
} 