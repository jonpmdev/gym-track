import supabase from '../config/supabase';
import { IExerciseProgress } from '../types/models';

class ExerciseProgressModel {
  private tableName = 'exercise_progress';

  async findByExerciseId(exerciseId: string): Promise<IExerciseProgress[]> {
    const { data, error } = await supabase
      .from(this.tableName)
      .select('*')
      .eq('exercise_id', exerciseId)
      .order('date', { ascending: false });

    if (error) {
      throw new Error(`Error al buscar registros de progreso de ejercicio: ${error.message}`);
    }

    return data as IExerciseProgress[] || [];
  }

  async findById(id: string): Promise<IExerciseProgress | null> {
    const { data, error } = await supabase
      .from(this.tableName)
      .select('*')
      .eq('id', id)
      .single();

    if (error || !data) {
      return null;
    }

    return data as IExerciseProgress;
  }

  async create(progressData: Omit<IExerciseProgress, 'id'>): Promise<IExerciseProgress> {
    const newProgress = {
      ...progressData,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    const { data, error } = await supabase
      .from(this.tableName)
      .insert([newProgress])
      .select()
      .single();

    if (error || !data) {
      throw new Error(`Error al crear registro de progreso de ejercicio: ${error?.message || 'Desconocido'}`);
    }

    return data as IExerciseProgress;
  }

  async update(id: string, progressData: Partial<IExerciseProgress>): Promise<IExerciseProgress | null> {
    const updateData = {
      ...progressData,
      updated_at: new Date().toISOString()
    };

    const { data, error } = await supabase
      .from(this.tableName)
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error || !data) {
      return null;
    }

    return data as IExerciseProgress;
  }

  async delete(id: string): Promise<boolean> {
    const { error } = await supabase
      .from(this.tableName)
      .delete()
      .eq('id', id);

    return !error;
  }
}

export default new ExerciseProgressModel(); 