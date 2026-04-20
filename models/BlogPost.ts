import mongoose from 'mongoose';

const FaqSchema = new mongoose.Schema({
  question: { type: String, required: true },
  answer: { type: String, required: true },
});

const BlogPostSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  excerpt: { type: String, required: true },
  content: { type: String, required: true },
  category: { type: String, required: true },
  readTime: { type: String, default: '5 min read' },
  author: { type: String, default: 'TheOpenScholarships Team' },
  authorRole: { type: String },
  image: { type: String },
  tags: [{ type: String }],
  published: { type: Boolean, default: true },
  preview: { type: Boolean, default: false },
  views: { type: Number, default: 0 },
  faqs: [FaqSchema], // NEW: FAQs array
}, { timestamps: true });

export default mongoose.models.BlogPost || mongoose.model('BlogPost', BlogPostSchema);
