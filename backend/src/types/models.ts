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

export interface IExercise {
  name: string;
  sets: number;
  reps: string;
  weight?: number;
  rest?: string;
  muscleGroups?: string[];
  focus?: string;
  completed: boolean;
  day: string;
}

export interface IWorkout extends Document {
  user: string;
  title: string;
  exercises: IExercise[];
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