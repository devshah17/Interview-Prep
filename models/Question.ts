import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IQuestion extends Document {
  topicId?: mongoose.Types.ObjectId;
  techId: mongoose.Types.ObjectId;
  text: string;
  options: string[];
  correctAnswer: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  explanation?: string;
}

const QuestionSchema: Schema = new Schema({
  topicId: {
    type: Schema.Types.ObjectId,
    ref: 'Topic',
  },
  techId: {
    type: Schema.Types.ObjectId,
    ref: 'Technology',
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  options: [{
    type: String,
    required: true,
  }],
  correctAnswer: {
    type: String,
    required: true,
  },
  difficulty: {
    type: String,
    enum: ['Easy', 'Medium', 'Hard'],
    required: true,
  },
  explanation: {
    type: String,
  },
});

export const Question: Model<IQuestion> = mongoose.models.Question || mongoose.model<IQuestion>('Question', QuestionSchema);
