const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');

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
  console.error('❌ MONGODB_URI not found');
  process.exit(1);
}

const ScholarshipSchema = new mongoose.Schema({}, { strict: false });
const Scholarship = mongoose.models.Scholarship || mongoose.model('Scholarship', ScholarshipSchema);

async function listImages() {
  await mongoose.connect(MONGODB_URI);
  const images = await Scholarship.distinct('image', { image: { $regex: 'unsplash' } });
  console.log('Unsplash URLs in database:');
  images.forEach((url, i) => console.log(`${i+1}. ${url}`));
  await mongoose.disconnect();
  process.exit(0);
}

listImages().catch(console.error);
