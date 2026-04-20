import mongoose from 'mongoose';

const FaqSchema = new mongoose.Schema({
  question: String,
  answer: String
});

const ScholarshipSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  provider: { type: String, required: true },
  hostCountries: [{ type: String, required: true }],
  region: [{ type: String, enum: ['Europe','North America','Asia Pacific','Middle East','Africa','Latin America','Global'], default: ['Global'] }],
  fields: [{ type: String, required: true }],
  degreeLevel: [{ type: String, enum: ['Bachelor','Masters','PhD','All Levels'], required: true }],
  fundingType: [{ type: String, default: ['Fully Funded'] }],
  programMode: [{ type: String, enum: ['online','on-campus','hybrid','part-time','full-time'], default: ['on-campus'] }],
  programDuration: [{ type: String, enum: ['1-year','2-years','3-years','4-years'], default: ['2-years'] }],
  programLevel: [{ type: String, enum: ['executive','regular','research'], default: ['regular'] }],
  // New deadline fields
  deadlineMonth: { type: Number, min: 0, max: 11 }, // 0 = Jan, 11 = Dec
  deadlinePeriod: { type: String, enum: ['early', 'mid', 'late'] },
  // Keep old deadline for backward compatibility (optional)
  deadline: { type: Date },
  description: { type: String, required: true },
  benefits: [{ type: String }],
  eligibility: [{ type: String }],
  howToApply: [{ type: String }],
  requiredDocuments: [{ type: String }],
  applicationTips: { type: String },
  importantDates: {
    resultsAnnouncement: String,
    programmeStart: String
  },
  faqs: [FaqSchema],
  officialLink: { type: String, required: true },
  featured: { type: Boolean, default: false },
  views: { type: Number, default: 0 },
  image: { type: String }
}, { timestamps: true });

export default mongoose.models.Scholarship || mongoose.model('Scholarship', ScholarshipSchema);
