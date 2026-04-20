import mongoose from 'mongoose';

const ForumReplySchema = new mongoose.Schema({
  topicId: { type: mongoose.Schema.Types.ObjectId, ref: 'ForumTopic', required: true },
  content: { type: String, required: true },
  author: { type: String, required: true },
  authorId: { type: String, default: 'guest' },
  likes: { type: Number, default: 0 },
}, { timestamps: true });

export default mongoose.models.ForumReply || mongoose.model('ForumReply', ForumReplySchema);
