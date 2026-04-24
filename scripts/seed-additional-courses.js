// scripts/seed-additional-courses.js
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

// Import course data from separate file
const additionalCourses = require('./courses-data.js');

function slugify(text) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').substring(0, 60);
}

// Define schema (adjust to match your actual Course model)
const courseSchema = new mongoose.Schema({
  title: String,
  slug: { type: String, unique: true },
  provider: String,
  platform: String,
  category: String,
  level: String,
  duration: String,
  language: String,
  certificateOffered: Boolean,
  officialLink: String,
  image: String,
  tags: [String],
  featured: Boolean,
  description: String,
  instructor: String,
  requirements: [String],
  syllabus: [String],
  platformDetails: String,
  enrolledCount: String,
  rating: Number,
  faqs: [{ question: String, answer: String }]
}, { timestamps: true });

const Course = mongoose.model('Course', courseSchema);

// Remove malformed course (description contains "Already listed as #3")
const cleanedCourses = additionalCourses.filter(course => {
  const isBad = course.description && course.description.includes("Already listed as #3");
  if (isBad) console.warn(`⚠️ Skipping malformed course: ${course.title}`);
  return !isBad;
});

async function addCourses() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    let added = 0, skipped = 0;

    for (const courseData of cleanedCourses) {
      const slug = slugify(courseData.title);
      const exists = await Course.findOne({ slug });
      if (exists) {
        console.log(`⏭️ Skipping existing: ${courseData.title}`);
        skipped++;
        continue;
      }
      await Course.create({ ...courseData, slug });
      console.log(`➕ Added: ${courseData.title}`);
      added++;
    }

    console.log(`\n🎉 Done: ${added} new courses added, ${skipped} skipped (already existed).`);
    process.exit(0);
  } catch (err) {
    console.error('❌ Error:', err);
    process.exit(1);
  }
}

addCourses();