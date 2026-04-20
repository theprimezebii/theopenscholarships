const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');

const envPath = path.join(__dirname, '../.env.local');
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
  console.error('MONGODB_URI not found');
  process.exit(1);
}

// Working Unsplash image IDs for scholarship/education themes
const fallbackImages = {
  personalStatement: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=1200&h=630&fit=crop',
  recommendation: 'https://images.unsplash.com/photo-1586281380349-632531db7ed6?w=1200&h=630&fit=crop',
  ielts: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=1200&h=630&fit=crop',
  top10: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=1200&h=630&fit=crop', // Graduation cap
  interview: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=1200&h=630&fit=crop',
  finance: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=1200&h=630&fit=crop',
  country: 'https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?w=1200&h=630&fit=crop',
  guide: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=1200&h=630&fit=crop'
};

const updates = [
  { slug: 'how-to-write-winning-personal-statement', image: fallbackImages.personalStatement },
  { slug: 'how-to-get-strong-recommendation-letters', image: fallbackImages.recommendation },
  { slug: 'ielts-scholarship-guide', image: fallbackImages.ielts },
  { slug: 'top-10-scholarships-2026', image: fallbackImages.top10 },
  { slug: 'scholarship-interview-guide', image: fallbackImages.interview },
  { slug: 'complete-financial-guide-study-abroad', image: fallbackImages.finance },
  { slug: 'country-comparison-study-abroad', image: fallbackImages.country },
  { slug: 'ultimate-scholarship-guide-2026', image: fallbackImages.guide },
];

async function fixImages() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');
    
    const db = mongoose.connection.db;
    const collection = db.collection('blogposts');
    
    for (const update of updates) {
      const result = await collection.updateOne(
        { slug: update.slug },
        { $set: { image: update.image } }
      );
      if (result.modifiedCount > 0) {
        console.log(`Updated image for: ${update.slug}`);
      } else {
        console.log(`No changes for: ${update.slug} (may not exist)`);
      }
    }
    
    console.log('\nImage fixes applied.');
    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

fixImages();
