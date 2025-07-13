import mongoose, { Schema } from 'mongoose';
import { IWorkout, IExercise } from '../types/models';

const exerciseSchema = new Schema<IExercise>({
  name: {
    type: String,
    required: true,
  },
  sets: [
    {
      reps: { type: Number, required: true },
      weight: { type: Number, required: true },
      completed: { type: Boolean, default: false },
    },
  ],
  notes: String,
});

const workoutSchema = new Schema<IWorkout>(
  {
    user: {
      type: Schema.Types.ObjectId as any,
      required: true,
      ref: 'User',
    },
    name: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      default: Date.now,
    },
    exercises: [exerciseSchema],
    duration: {
      type: Number, // duración en minutos
      default: 0,
    },
    notes: String,
    completed: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IWorkout>('Workout', workoutSchema); 