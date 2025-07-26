import { IExercise } from '../types/models';
import { IExerciseRepository } from '../types/repositories';

export class ExerciseService {
  private repository: IExerciseRepository;

  constructor(repository: IExerciseRepository) {
    this.repository = repository;
  }

  async getExercisesByWorkout(workoutId: string): Promise<IExercise[]> {
    return this.repository.findByWorkoutId(workoutId);
  }

  async getExerciseById(id: string): Promise<IExercise | null> {
    return this.repository.findById(id);
  }

  async createExercise(exerciseData: Omit<IExercise, 'id' | 'created_at' | 'updated_at'>): Promise<IExercise> {
    return this.repository.create(exerciseData);
  }

  async updateExercise(id: string, exerciseData: Partial<IExercise>): Promise<IExercise | null> {
    return this.repository.update(id, exerciseData);
  }

  async deleteExercise(id: string): Promise<boolean> {
    return this.repository.delete(id);
  }

  async toggleExerciseCompleted(id: string, completed: boolean): Promise<IExercise | null> {
    return this.repository.updateCompleted(id, completed);
  }
} 