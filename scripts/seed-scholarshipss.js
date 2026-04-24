// scripts/seed-scholarships.js
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');

// Load .env.local
const envPath = path.join(__dirname, '..', '.env.local');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  envContent.split('\n').forEach(line => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#')) {
      const [key, ...valueParts] = trimmed.split('=');
      const value = valueParts.join('=').replace(/^["']|["']$/g, '');
      if (key && value) process.env[key] = value;
    }
  });
}

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  console.error('❌ MONGODB_URI not found in .env.local');
  process.exit(1);
}

// Import the data
const scholarships = require('./scholarships-data.js');

function slugify(text) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').substring(0, 60);
}

// Define schema (must match your Scholarship model)
const scholarshipSchema = new mongoose.Schema({
  title: String,
  slug: { type: String, unique: true },
  provider: String,
  hostCountries: [String],
  degreeLevel: [String],
  fundingType: [String],
  deadline: Date,
  status: String,
  description: String,
  benefits: [String],
  eligibility: [String],
  howToApply: [String],
  requiredDocuments: [String],
  importantDates: mongoose.Schema.Types.Mixed,
  applicationTips: String,
  officialLink: String,
  image: String,
  featured: Boolean,
  views: { type: Number, default: 0 }
}, { timestamps: true });

const Scholarship = mongoose.model('Scholarship', scholarshipSchema);

async function seed() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    let added = 0;
    let skipped = 0;

    for (const data of scholarships) {
      let slug = data.slug || slugify(data.title);
      const existing = await Scholarship.findOne({ slug });
      if (existing) {
        console.log(`⏭️ Skipping existing: ${data.title} (slug: ${slug})`);
        skipped++;
        continue;
      }
      await Scholarship.create({ ...data, slug });
      console.log(`➕ Added: ${data.title}`);
      added++;
    }

    console.log(`\n🎉 Done: ${added} new scholarships, ${skipped} skipped (already exist).`);
    process.exit(0);
  } catch (err) {
    console.error('❌ Error:', err);
    process.exit(1);
  }
}

seed();