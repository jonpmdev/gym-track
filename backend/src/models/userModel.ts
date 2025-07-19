import supabase from '../config/supabase';
import { IUser } from '../types/models';

class UserModel {
  private tableName = 'users';

  async findByEmail(email: string): Promise<IUser | null> {
    const { data, error } = await supabase
      .from(this.tableName)
      .select('*')
      .eq('email', email)
      .single();

    if (error || !data) {
      return null;
    }

    return data as IUser;
  }

  async findById(id: string): Promise<IUser | null> {
    const { data, error } = await supabase
      .from(this.tableName)
      .select('*')
      .eq('id', id)
      .single();

    if (error || !data) {
      return null;
    }

    return data as IUser;
  }

  async create(userData: Partial<IUser>): Promise<IUser | null> {
    const { data, error } = await supabase
      .from(this.tableName)
      .insert([userData])
      .select()
      .single();

    if (error || !data) {
      throw new Error(`Error al crear usuario: ${error?.message || 'Desconocido'}`);
    }

    return data as IUser;
  }

  async update(id: string, userData: Partial<IUser>): Promise<IUser | null> {
    const { data, error } = await supabase
      .from(this.tableName)
      .update(userData)
      .eq('id', id)
      .select()
      .single();

    if (error || !data) {
      return null;
    }

    return data as IUser;
  }
}

export default new UserModel(); 