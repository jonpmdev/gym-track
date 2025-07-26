import { Exercise } from './exercise.model';

export interface Workout {
  id: string;
  user_id?: string;
  title: string;
  exercises: Exercise[];
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
  created_at?: string; // Para compatibilidad con el backend
  updated_at?: string; // Para compatibilidad con el backend
} 