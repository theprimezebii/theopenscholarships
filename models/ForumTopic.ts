import mongoose from 'mongoose';

const ForumTopicSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  category: { type: String, required: true },
  content: { type: String, required: true },
  author: { type: String, required: true },
  authorId: { type: String, default: 'guest' },
  replies: { type: Number, default: 0 },
  views: { type: Number, default: 0 },
  likes: { type: Number, default: 0 },
  pinned: { type: Boolean, default: false },
  tags: [{ type: String }],
  lastActivity: { type: Date, default: Date.now },
}, { timestamps: true });

export default mongoose.models.ForumTopic || mongoose.model('ForumTopic', ForumTopicSchema);
