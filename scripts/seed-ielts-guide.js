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
if (!MONGODB_URI) { console.error('MONGODB_URI not found'); process.exit(1); }

const posts = [
  {
    title: "IELTS Scholarship Guide: Scoring High for Fully Funded Opportunities",
    slug: "ielts-scholarship-guide",
    excerpt: "Everything you need to know about IELTS requirements for top scholarships, including minimum scores, preparation tips, and alternatives.",
    content: `<h2>IELTS Requirements for Major Scholarships</h2>
<ul><li>Chevening: Minimum 6.5 overall</li><li>DAAD: IELTS 6.5-7.0</li><li>Fulbright: Minimum 6.5</li><li>Erasmus Mundus: 6.0-7.0</li></ul>
<h2>Preparation Tips</h2><ul><li>Practice with official materials</li><li>Take full-length tests</li><li>Focus on weak areas</li></ul>
<h2>Alternatives to IELTS</h2><ul><li>TOEFL</li><li>PTE Academic</li><li>Duolingo English Test</li></ul>`,
    category: "Language Tests",
    readTime: "7 min read",
    author: "TheOpenScholarships Team",
    authorRole: "Test Prep Expert",
    image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=1200&h=630&fit=crop",
    tags: ["IELTS", "language test"],
    published: true
  }
];

async function seed() {
  try {
    await mongoose.connect(MONGODB_URI);
    const db = mongoose.connection.db;
    const collection = db.collection('blogposts');
    for (const post of posts) {
      const existing = await collection.findOne({ slug: post.slug });
      if (!existing) {
        await collection.insertOne({ ...post, createdAt: new Date(), updatedAt: new Date() });
        console.log(`Added: ${post.slug}`);
      } else {
        console.log(`Already exists: ${post.slug}`);
      }
    }
    await mongoose.disconnect();
    process.exit(0);
  } catch (e) { console.error(e); process.exit(1); }
}
seed();
