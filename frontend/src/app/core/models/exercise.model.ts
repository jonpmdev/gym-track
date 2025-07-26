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
  day: string;
  createdAt?: string;
  updatedAt?: string;
  created_at?: string; // Para compatibilidad con el backend
  updated_at?: string; // Para compatibilidad con el backend
} 