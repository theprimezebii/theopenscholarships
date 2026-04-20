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
    title: "How to Write a Winning Personal Statement",
    slug: "how-to-write-winning-personal-statement",
    excerpt: "Learn how to craft a compelling personal statement that stands out to scholarship committees. Includes examples and templates.",
    content: `<h2>Why Your Personal Statement Matters</h2><p>The personal statement is your opportunity to tell your unique story. Scholarship committees read hundreds of applications—your personal statement is what makes you memorable.</p><h2>Before You Start Writing</h2><ul><li>Research the scholarship's mission and values</li><li>List your key achievements and experiences</li><li>Identify 3-5 core themes that define you</li><li>Read successful sample statements</li></ul><h2>Structure of a Winning Personal Statement</h2><h3>1. Compelling Opening Hook</h3><p>Start with a specific moment, question, or insight that captures attention immediately.</p><h3>2. Your Academic Journey</h3><p>Explain what drew you to your field of study.</p><h3>3. Relevant Experiences</h3><p>Describe work, volunteer, research, or leadership experiences.</p><h3>4. Why This Scholarship?</h3><p>Connect your goals to the scholarship's mission.</p><h3>5. Future Vision</h3><p>Be specific about your career goals.</p><h3>6. Strong Closing</h3><p>End with confidence and gratitude.</p>`,
    category: "Writing Tips",
    readTime: "8 min read",
    author: "TheOpenScholarships Team",
    authorRole: "Scholarship Expert",
    image: "https://images.unsplash.com/photo-1455390582262-044cdead277a?q=80&w=1200&auto=format",
    tags: ["personal statement", "writing tips", "application", "essay"],
    published: true,
    type: "guide"
  },
  {
    title: "Country Comparison: Best Places to Study Abroad in 2026",
    slug: "country-comparison-study-abroad",
    excerpt: "Compare top study destinations: UK, USA, Germany, Canada, Australia. Tuition, living costs, scholarships, and post-study work visas.",
    content: `<h2>Choosing Your Study Destination</h2><p>Choosing where to study is one of the biggest decisions you'll make. This guide compares the top 6 destinations for international students.</p><h2>1. United Kingdom</h2><p><strong>Pros:</strong> World-renowned universities, shorter degree programs.</p><h2>2. United States</h2><p><strong>Pros:</strong> Most top-ranked universities, flexible programs.</p><h2>3. Germany</h2><p><strong>Pros:</strong> Low or no tuition fees, strong engineering programs.</p><h2>4. Canada</h2><p><strong>Pros:</strong> High quality of life, welcoming immigration policies.</p><h2>5. Australia</h2><p><strong>Pros:</strong> High-ranked universities, great weather.</p><h2>6. Netherlands</h2><p><strong>Pros:</strong> Many English-taught programs, central European location.</p>`,
    category: "Country Guide",
    readTime: "15 min read",
    author: "TheOpenScholarships Team",
    authorRole: "Education Consultant",
    image: "https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?q=80&w=1200&auto=format",
    tags: ["country comparison", "study destinations", "UK", "USA", "Germany", "Canada", "Australia"],
    published: true,
    type: "guide"
  },
  {
    title: "Scholarship Interview Guide: 50+ Questions and Proven Answers",
    slug: "scholarship-interview-guide",
    excerpt: "Master your scholarship interview with 50+ real questions, sample answers, and proven strategies from successful scholars.",
    content: `<h2>Why the Interview Matters</h2><p>If you've been invited for a scholarship interview, congratulations! You're already in the top tier of applicants.</p><h2>Before the Interview: Preparation Checklist</h2><ul><li>Research the scholarship thoroughly</li><li>Review your entire application</li><li>Prepare 5-7 stories about your leadership</li><li>Practice with mock interviews</li></ul><h2>Common Interview Questions and How to Answer</h2><h3>About You</h3><p><strong>1. Tell us about yourself.</strong><br/>Focus on your academic journey and key achievements.</p><h3>Academic and Career Goals</h3><p><strong>4. Why did you choose your field of study?</strong></p><h3>Leadership and Experience</h3><p><strong>7. Tell us about a time you demonstrated leadership.</strong></p>`,
    category: "Interview Guide",
    readTime: "12 min read",
    author: "TheOpenScholarships Team",
    authorRole: "Interview Coach",
    image: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?q=80&w=1200&auto=format",
    tags: ["interview", "scholarship tips", "preparation", "questions"],
    published: true,
    type: "guide"
  },
  {
    title: "Top 10 Fully Funded Scholarships for International Students 2026",
    slug: "top-10-scholarships-2026",
    excerpt: "A curated list of the most prestigious fully funded scholarships available for international students in 2026.",
    content: `<h2>1. Chevening Scholarship (UK)</h2><p>Full tuition, monthly stipend, travel costs.</p><h2>2. DAAD Scholarship (Germany)</h2><p>Full funding for master's and PhD students from developing countries.</p><h2>3. Fulbright Foreign Student Program (USA)</h2><p>Prestigious fully funded master's and PhD opportunities.</p><h2>4. MEXT Scholarship (Japan)</h2><p>Japanese government scholarship covering all expenses.</p><h2>5. Vanier Canada Graduate Scholarship</h2><p>CAD 50,000 per year for 3 years for PhD students.</p>`,
    category: "Scholarship Lists",
    readTime: "10 min read",
    author: "TheOpenScholarships Team",
    authorRole: "Scholarship Researcher",
    image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=1200&auto=format",
    tags: ["top scholarships", "fully funded", "2026"],
    published: true,
    type: "article"
  }
];

async function seed() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');
    
    const db = mongoose.connection.db;
    const collection = db.collection('blogposts');
    
    for (const post of posts) {
      const existing = await collection.findOne({ slug: post.slug });
      if (!existing) {
        await collection.insertOne({ ...post, createdAt: new Date(), updatedAt: new Date() });
        console.log(`Inserted: ${post.slug}`);
      } else {
        console.log(`Already exists: ${post.slug}`);
      }
    }
    
    console.log('\nSeeding complete.');
    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

seed();
