import { v4 as uuidv4 } from 'uuid';
import { IExercise } from '../types/models';

class ExerciseModel {
  private exercises: IExercise[] = [];

  async findByWorkoutId(workoutId: string): Promise<IExercise[]> {
    return this.exercises.filter(exercise => exercise.workout_id === workoutId);
  }

  async findById(id: string): Promise<IExercise | null> {
    const exercise = this.exercises.find(exercise => exercise.id === id);
    return exercise || null;
  }

  async create(exerciseData: Omit<IExercise, 'id'>): Promise<IExercise> {
    const newExercise: IExercise = {
      id: uuidv4(),
      ...exerciseData,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    this.exercises.push(newExercise);
    return newExercise;
  }

  async update(id: string, exerciseData: Partial<IExercise>): Promise<IExercise | null> {
    const index = this.exercises.findIndex(exercise => exercise.id === id);
    
    if (index === -1) {
      return null;
    }

    this.exercises[index] = {
      ...this.exercises[index],
      ...exerciseData,
      updated_at: new Date().toISOString()
    };

    return this.exercises[index];
  }

  async delete(id: string): Promise<boolean> {
    const initialLength = this.exercises.length;
    this.exercises = this.exercises.filter(exercise => exercise.id !== id);
    return initialLength > this.exercises.length;
  }
}

export default new ExerciseModel(); 