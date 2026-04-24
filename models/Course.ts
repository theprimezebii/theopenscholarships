import mongoose from 'mongoose';

const FaqSchema = new mongoose.Schema({
  question: String,
  answer: String,
});

const CourseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  provider: { type: String, required: true },
  platform: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  level: { type: String, enum: ['Beginner', 'Intermediate', 'Advanced', 'All Levels'] },
  duration: { type: String },
  language: { type: String, default: 'English' },
  certificateOffered: { type: Boolean, default: false },
  officialLink: { type: String, required: true },
  image: { type: String },
  featured: { type: Boolean, default: false },
  views: { type: Number, default: 0 },
  tags: [String],
  
  // New fields
  instructor: { type: String },
  requirements: [String],
  syllabus: [String],
  platformDetails: { type: String },
  enrolledCount: { type: String },
  rating: { type: Number },
  faqs: [FaqSchema],
}, { timestamps: true });

export default mongoose.models.Course || mongoose.model('Course', CourseSchema);