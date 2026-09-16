import mongoose, { Document, Model, Schema } from 'mongoose';

export interface ITechnology extends Document {
  name: string;
  description?: string;
  iconURL?: string;
}

const TechnologySchema: Schema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  description: {
    type: String,
  },
  iconURL: {
    type: String,
  },
});

export const Technology: Model<ITechnology> = mongoose.models.Technology || mongoose.model<ITechnology>('Technology', TechnologySchema);
