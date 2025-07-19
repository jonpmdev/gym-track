import supabase from '../config/supabase';
import { IWorkout } from '../types/models';
import { v4 as uuidv4 } from 'uuid';

class WorkoutModel {
  private tableName = 'workouts';

  async findByUserId(userId: string): Promise<IWorkout[]> {
    const { data, error } = await supabase
      .from(this.tableName)
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Error al buscar entrenamientos: ${error.message}`);
    }

    return data as IWorkout[] || [];
  }

  async findById(id: string, userId: string): Promise<IWorkout | null> {
    const { data, error } = await supabase
      .from(this.tableName)
      .select('*')
      .eq('id', id)
      .eq('user_id', userId)
      .single();

    if (error || !data) {
      return null;
    }

    return data as IWorkout;
  }

  async create(workoutData: Omit<IWorkout, 'id'>): Promise<IWorkout> {
    // Asegurar que cada ejercicio tenga un ID único
    const exercises = workoutData.exercises.map(exercise => ({
      ...exercise,
      id: exercise.id || uuidv4()
    }));

    const newWorkout = {
      ...workoutData,
      exercises,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    const { data, error } = await supabase
      .from(this.tableName)
      .insert([newWorkout])
      .select()
      .single();

    if (error || !data) {
      throw new Error(`Error al crear entrenamiento: ${error?.message || 'Desconocido'}`);
    }

    return data as IWorkout;
  }

  async update(id: string, userId: string, workoutData: Partial<IWorkout>): Promise<IWorkout | null> {
    // Si hay ejercicios, asegurar que cada uno tenga un ID
    if (workoutData.exercises) {
      workoutData.exercises = workoutData.exercises.map(exercise => ({
        ...exercise,
        id: exercise.id || uuidv4()
      }));
    }

    const updateData = {
      ...workoutData,
      updated_at: new Date().toISOString()
    };

    const { data, error } = await supabase
      .from(this.tableName)
      .update(updateData)
      .eq('id', id)
      .eq('user_id', userId)
      .select()
      .single();

    if (error || !data) {
      return null;
    }

    return data as IWorkout;
  }

  async delete(id: string, userId: string): Promise<boolean> {
    const { error } = await supabase
      .from(this.tableName)
      .delete()
      .eq('id', id)
      .eq('user_id', userId);

    return !error;
  }
}

export default new WorkoutModel(); 