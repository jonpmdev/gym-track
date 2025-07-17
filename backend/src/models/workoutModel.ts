import mongoose, { Schema } from 'mongoose';
import { IWorkout, IExercise } from '../types/models';

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
  },
  rest: String,
  muscleGroups: [String],
  focus: String,
  completed: {
    type: Boolean,
    default: false,
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
    exercises: [exerciseSchema],
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