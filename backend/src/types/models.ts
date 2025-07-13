import { Document } from 'mongoose';

export interface IMeasurements {
  chest?: number;
  waist?: number;
  hips?: number;
  biceps?: number;
  thighs?: number;
}

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  weight?: number;
  height?: number;
  measurements?: IMeasurements;
  createdAt: Date;
  updatedAt: Date;
}

export interface ISet {
  reps: number;
  weight: number;
  completed: boolean;
}

export interface IExercise {
  name: string;
  sets: ISet[];
  notes?: string;
}

export interface IWorkout extends Document {
  user: string;
  name: string;
  date: Date;
  exercises: IExercise[];
  duration?: number;
  notes?: string;
  completed: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface IProgress extends Document {
  user: string;
  date: Date;
  weight: number;
  measurements?: IMeasurements;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
} 