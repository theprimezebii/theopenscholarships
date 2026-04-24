// scripts/seed-blog-posts.js
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

const blogPostsData = require('./blog-data.js');

function slugify(text) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').substring(0, 60);
}

// Define schema (must match your actual BlogPost model)
const blogPostSchema = new mongoose.Schema({
  title: String,
  slug: { type: String, unique: true },
  type: { type: String, enum: ['blog', 'guide', 'news'], default: 'blog' },
  category: String,
  excerpt: String,
  content: String,
  author: String,
  authorRole: String,
  readTime: String,
  image: String,
  tags: [String],
  published: { type: Boolean, default: false },
  views: { type: Number, default: 0 },
  faqs: [{ question: String, answer: String }]
}, { timestamps: true });

const BlogPost = mongoose.model('BlogPost', blogPostSchema);

async function seed() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    let added = 0;
    let skipped = 0;

    for (const data of blogPostsData) {
      let slug = data.slug || slugify(data.title);
      const existing = await BlogPost.findOne({ slug });
      if (existing) {
        console.log(`⏭️ Skipping existing: ${data.title} (slug: ${slug})`);
        skipped++;
        continue;
      }
      await BlogPost.create({ ...data, slug });
      console.log(`➕ Added: ${data.title} [${data.type}]`);
      added++;
    }

    console.log(`\n🎉 Done: ${added} new posts, ${skipped} skipped (already exist).`);
    process.exit(0);
  } catch (err) {
    console.error('❌ Error:', err);
    process.exit(1);
  }
}

seed();