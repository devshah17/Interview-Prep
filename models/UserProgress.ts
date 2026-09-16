import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IUserProgress extends Document {
  userId: mongoose.Types.ObjectId;
  topicId: mongoose.Types.ObjectId;
  status: 'Completed' | 'InProgress';
  lastAccessed: Date;
}

const UserProgressSchema: Schema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  topicId: {
    type: Schema.Types.ObjectId,
    ref: 'Topic',
    required: true,
  },
  status: {
    type: String,
    enum: ['Completed', 'InProgress'],
    default: 'InProgress',
  },
  lastAccessed: {
    type: Date,
    default: Date.now,
  },
});

export const UserProgress: Model<IUserProgress> = mongoose.models.UserProgress || mongoose.model<IUserProgress>('UserProgress', UserProgressSchema);
