import mongoose, { Schema } from 'mongoose';
import { IWorkout, IExercise } from '../types/models';

// Esquema modificado para coincidir exactamente con la validación de initDb.ts
const exerciseSchema = new Schema<IExercise>({
  name: {
    type: String,
    required: true,
  },
  sets: {
    type: Number,
    required: true,
  },
  reps: {
    type: String,
    required: true,
  },
  weight: {
    type: Number,
    default: 0,
  },
  rest: {
    type: String,
    default: '60',
  },
  muscleGroups: {
    type: [String],
    default: [],
  },
  focus: {
    type: String,
    default: '',
  },
  completed: {
    type: Boolean,
    default: false,
    required: true,
  },
  day: {
    type: String,
    required: true,
  },
});

const workoutSchema = new Schema<IWorkout>(
  {
    user: {
      type: Schema.Types.ObjectId as any,
      required: true,
      ref: 'User',
    },
    title: {
      type: String,
      required: true,
    },
    exercises: {
      type: [exerciseSchema],
      required: true,
      validate: {
        validator: function(exercises: any[]) {
          return exercises.length > 0;
        },
        message: 'Debe incluir al menos un ejercicio'
      }
    },
    notes: {
      type: String,
      default: '',
    },
    completed: {
      type: Boolean,
      default: false,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Desactivar la validación estricta para permitir que mongoose maneje la validación
// en lugar de depender de la validación de MongoDB
workoutSchema.set('validateBeforeSave', true);
workoutSchema.set('strict', false);

export default mongoose.model<IWorkout>('Workout', workoutSchema); 