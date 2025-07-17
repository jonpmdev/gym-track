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

export interface Workout {
  id: string;
  title: string;
  exercises: Exercise[];
  notes?: string;
  completed: boolean;
  createdAt?: string;
  updatedAt?: string;
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