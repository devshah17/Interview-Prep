import mongoose, { Document, Model, Schema } from 'mongoose';

export interface ITopic extends Document {
  techId: mongoose.Types.ObjectId;
  title: string;
  content: string;
  order: number;
}

const TopicSchema: Schema = new Schema({
  techId: {
    type: Schema.Types.ObjectId,
    ref: 'Technology',
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  order: {
    type: Number,
    required: true,
    default: 0,
  },
});

export const Topic: Model<ITopic> = mongoose.models.Topic || mongoose.model<ITopic>('Topic', TopicSchema);
