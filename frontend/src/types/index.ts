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
  sets: {
    reps: number;
    weight: number;
    completed: boolean;
  }[];
  notes?: string;
}

export interface Workout {
  id: string;
  name: string;
  date: string;
  exercises: Exercise[];
  duration?: number;
  notes?: string;
  completed: boolean;
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