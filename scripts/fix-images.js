// scripts/fix-images.js
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

// Scholarship Schema (minimal, just for the update)
const ScholarshipSchema = new mongoose.Schema({}, { strict: false });
const Scholarship = mongoose.models.Scholarship || mongoose.model('Scholarship', ScholarshipSchema);

const OLD_IMAGE_ID = '1523050854058-8df90110c9f1';
const NEW_IMAGE_URL = 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=1200&auto=format';

async function fixImages() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');
    
    const result = await Scholarship.updateMany(
      { image: { $regex: OLD_IMAGE_ID } },
      { $set: { image: NEW_IMAGE_URL } }
    );
    
    console.log(`✅ Updated ${result.modifiedCount} scholarship(s)`);
    console.log(`   Matched: ${result.matchedCount}, Modified: ${result.modifiedCount}`);
    
    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

fixImages();
