export interface User {
  id: string;
  name: string;
  email: string;
  weight?: number;
  height?: number;
  measurements?: {
    chest?: number;
    waist?: number;
    hips?: number;
    biceps?: number;
    thighs?: number;
  };
}

export interface Exercise {
  id?: string;
  workout_id?: string;
  name: string;
  sets: number;
  reps: string;
  weight?: number;
  rest?: string;
  muscleGroups?: string[];
  muscle_groups?: string[]; // Para compatibilidad con el backend
  focus?: string;
  completed?: boolean;
  day: string;
  createdAt?: string;
  updatedAt?: string;
  created_at?: string; // Para compatibilidad con el backend
  updated_at?: string; // Para compatibilidad con el backend
}

export interface Workout {
  id: string;
  user_id?: string;
  title: string;
  exercises: Exercise[];
  notes?: string;
  completed?: boolean;
  createdAt?: string;
  updatedAt?: string;
  created_at?: string; // Para compatibilidad con el backend
  updated_at?: string; // Para compatibilidad con el backend
}

export interface Progress {
  id: string;
  date: string;
  weight: number;
  measurements?: {
    chest?: number;
    waist?: number;
    hips?: number;
    biceps?: number;
    thighs?: number;
  };
  notes?: string;
} 