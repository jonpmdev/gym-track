import mongoose, { Schema } from 'mongoose';
import { IProgress } from '../types/models';

const progressSchema = new Schema<IProgress>(
  {
    user: {
      type: Schema.Types.ObjectId as any,
      required: true,
      ref: 'User',
    },
    date: {
      type: Date,
      default: Date.now,
    },
    weight: {
      type: Number,
      required: true,
    },
    measurements: {
      chest: { type: Number },
      waist: { type: Number },
      hips: { type: Number },
      biceps: { type: Number },
      thighs: { type: Number },
    },
    notes: String,
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IProgress>('Progress', progressSchema); 