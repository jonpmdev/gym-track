import { Request, Response } from 'express';
import exerciseProgressModel from '../models/exerciseProgressModel';
import exerciseModel from '../models/exerciseModel';

export const getExerciseProgress = async (req: Request, res: Response) => {
  try {
    const { exerciseId } = req.params;
    
    const progress = await exerciseProgressModel.findByExerciseId(exerciseId);
    
    return res.status(200).json(progress);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

export const getExerciseProgressById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const progress = await exerciseProgressModel.findById(id);
    
    if (!progress) {
      return res.status(404).json({ error: 'Registro de progreso no encontrado' });
    }
    
    return res.status(200).json(progress);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

export const createExerciseProgress = async (req: Request, res: Response) => {
  try {
    const { exercise_id, weight, notes } = req.body;
    
    if (!exercise_id || !weight) {
      return res.status(400).json({ error: 'Faltan campos requeridos' });
    }
    
    // Verificar que el ejercicio existe
    const exercise = await exerciseModel.findById(exercise_id);
    if (!exercise) {
      return res.status(404).json({ error: 'Ejercicio no encontrado' });
    }
    
    const newProgress = await exerciseProgressModel.create({
      exercise_id,
      weight,
      date: new Date().toISOString(),
      notes: notes || ''
    });
    
    // Actualizar el peso actual del ejercicio
    await exerciseModel.update(exercise_id, { weight });
    
    return res.status(201).json(newProgress);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

export const updateExerciseProgress = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { weight, notes } = req.body;
    
    const progress = await exerciseProgressModel.findById(id);
    
    if (!progress) {
      return res.status(404).json({ error: 'Registro de progreso no encontrado' });
    }
    
    const updatedProgress = await exerciseProgressModel.update(id, {
      weight,
      notes
    });
    
    return res.status(200).json(updatedProgress);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

export const deleteExerciseProgress = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const progress = await exerciseProgressModel.findById(id);
    
    if (!progress) {
      return res.status(404).json({ error: 'Registro de progreso no encontrado' });
    }
    
    await exerciseProgressModel.delete(id);
    
    return res.status(200).json({ message: 'Registro de progreso eliminado correctamente' });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
}; 