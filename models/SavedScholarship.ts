import mongoose from 'mongoose';

const SavedScholarshipSchema = new mongoose.Schema({
  sessionId: { type: String, required: true, index: true },
  scholarshipId: { type: String, required: true },
}, { timestamps: true });

// Prevent duplicate saves for same session
SavedScholarshipSchema.index({ sessionId: 1, scholarshipId: 1 }, { unique: true });

export default mongoose.models.SavedScholarship || mongoose.model('SavedScholarship', SavedScholarshipSchema);
