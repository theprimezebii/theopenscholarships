import mongoose from 'mongoose';

const SuccessStorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  country: { type: String, required: true },
  scholarship: { type: String, required: true },
  university: { type: String, required: true },
  year: { type: Number, required: true },
  image: { type: String },
  quote: { type: String, required: true },
  fullStory: { type: String, required: true },
  program: { type: String, required: true },
  published: { type: Boolean, default: true },
  order: { type: Number, default: 0 },
}, { timestamps: true });

export default mongoose.models.SuccessStory || mongoose.model('SuccessStory', SuccessStorySchema);
