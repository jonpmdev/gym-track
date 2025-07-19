import prisma from '../config/prisma';
import { IProgress } from '../types/models';

class ProgressModel {
  async findByUserId(userId: string): Promise<IProgress[]> {
    const progressRecords = await prisma.progress.findMany({
      where: { user_id: userId },
      orderBy: { date: 'desc' }
    });

    return progressRecords.map(progress => ({
      ...progress,
      date: progress.date.toISOString(),
      measurements: progress.measurements as any,
      created_at: progress.created_at.toISOString(),
      updated_at: progress.updated_at.toISOString()
    })) as IProgress[];
  }

  async findById(id: string, userId: string): Promise<IProgress | null> {
    const progress = await prisma.progress.findFirst({
      where: {
        id,
        user_id: userId
      }
    });

    if (!progress) return null;

    return {
      ...progress,
      date: progress.date.toISOString(),
      measurements: progress.measurements as any,
      created_at: progress.created_at.toISOString(),
      updated_at: progress.updated_at.toISOString()
    } as IProgress;
  }

  async create(progressData: Omit<IProgress, 'id'>): Promise<IProgress> {
    const progress = await prisma.progress.create({
      data: {
        user_id: progressData.user_id,
        date: new Date(progressData.date),
        weight: progressData.weight,
        measurements: progressData.measurements as any,
        notes: progressData.notes
      }
    });

    return {
      ...progress,
      date: progress.date.toISOString(),
      measurements: progress.measurements as any,
      created_at: progress.created_at.toISOString(),
      updated_at: progress.updated_at.toISOString()
    } as IProgress;
  }

  async update(id: string, userId: string, progressData: Partial<IProgress>): Promise<IProgress | null> {
    try {
      // Extraer solo los campos que necesitamos actualizar
      const updateData: any = {};
      
      if (progressData.date) updateData.date = new Date(progressData.date);
      if (progressData.weight !== undefined) updateData.weight = progressData.weight;
      if (progressData.measurements) updateData.measurements = progressData.measurements;
      if (progressData.notes !== undefined) updateData.notes = progressData.notes;
      
      const progress = await prisma.progress.update({
        where: {
          id,
          user_id: userId
        },
        data: updateData
      });

      return {
        ...progress,
        date: progress.date.toISOString(),
        measurements: progress.measurements as any,
        created_at: progress.created_at.toISOString(),
        updated_at: progress.updated_at.toISOString()
      } as IProgress;
    } catch (error) {
      return null;
    }
  }

  async delete(id: string, userId: string): Promise<boolean> {
    try {
      await prisma.progress.delete({
        where: {
          id,
          user_id: userId
        }
      });
      return true;
    } catch (error) {
      return false;
    }
  }
}

export default new ProgressModel(); 