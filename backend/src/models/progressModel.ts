import supabase from '../config/supabase';
import { IProgress } from '../types/models';

class ProgressModel {
  private tableName = 'progress';

  async findByUserId(userId: string): Promise<IProgress[]> {
    const { data, error } = await supabase
      .from(this.tableName)
      .select('*')
      .eq('user_id', userId)
      .order('date', { ascending: false });

    if (error) {
      throw new Error(`Error al buscar registros de progreso: ${error.message}`);
    }

    return data as IProgress[] || [];
  }

  async findById(id: string, userId: string): Promise<IProgress | null> {
    const { data, error } = await supabase
      .from(this.tableName)
      .select('*')
      .eq('id', id)
      .eq('user_id', userId)
      .single();

    if (error || !data) {
      return null;
    }

    return data as IProgress;
  }

  async create(progressData: Omit<IProgress, 'id'>): Promise<IProgress> {
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
      throw new Error(`Error al crear registro de progreso: ${error?.message || 'Desconocido'}`);
    }

    return data as IProgress;
  }

  async update(id: string, userId: string, progressData: Partial<IProgress>): Promise<IProgress | null> {
    const updateData = {
      ...progressData,
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

    return data as IProgress;
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

export default new ProgressModel(); 