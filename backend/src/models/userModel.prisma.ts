import prisma from '../config/prisma';
import { IUser } from '../types/models';

class UserModel {
  async findByEmail(email: string): Promise<IUser | null> {
    const user = await prisma.user.findUnique({
      where: { email }
    });
    
    if (!user) return null;
    
    // Convertir las fechas a string para mantener compatibilidad con IUser
    return {
      ...user,
      created_at: user.created_at.toISOString(),
      updated_at: user.updated_at.toISOString(),
      measurements: user.measurements as any
    } as IUser;
  }

  async findById(id: string): Promise<IUser | null> {
    const user = await prisma.user.findUnique({
      where: { id }
    });
    
    if (!user) return null;
    
    return {
      ...user,
      created_at: user.created_at.toISOString(),
      updated_at: user.updated_at.toISOString(),
      measurements: user.measurements as any
    } as IUser;
  }

  async create(userData: Partial<IUser>): Promise<IUser> {
    const user = await prisma.user.create({
      data: userData as any
    });
    
    return {
      ...user,
      created_at: user.created_at.toISOString(),
      updated_at: user.updated_at.toISOString(),
      measurements: user.measurements as any
    } as IUser;
  }

  async update(id: string, userData: Partial<IUser>): Promise<IUser | null> {
    const user = await prisma.user.update({
      where: { id },
      data: userData as any
    });
    
    return {
      ...user,
      created_at: user.created_at.toISOString(),
      updated_at: user.updated_at.toISOString(),
      measurements: user.measurements as any
    } as IUser;
  }
}

export default new UserModel(); 