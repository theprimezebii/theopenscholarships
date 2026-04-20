// Load environment variables
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

const missingPosts = [
  {
    title: "How to Write a Winning Personal Statement",
    slug: "how-to-write-winning-personal-statement",
    excerpt: "Learn how to craft a compelling personal statement that stands out to scholarship committees. Includes examples and templates.",
    content: `<h2>Why Your Personal Statement Matters</h2>
<p>The personal statement is your chance to tell your story. It's often the deciding factor when qualifications are similar.</p>
<h2>Before You Start Writing</h2>
<ul><li>Research the scholarship's values and mission</li><li>List your key achievements and experiences</li><li>Identify 3-5 core themes you want to convey</li></ul>
<h2>Structure of a Winning Statement</h2>
<h3>1. Opening Hook</h3>
<p>Start with a compelling story or insight that grabs attention.</p>
<h3>2. Academic Journey</h3>
<p>Explain your educational background and what drove your interest in this field.</p>
<h3>3. Relevant Experience</h3>
<p>Describe work, volunteer, or research experiences that shaped you.</p>
<h3>4. Why This Scholarship?</h3>
<p>Connect your goals to the scholarship's mission and the specific program.</p>
<h3>5. Future Plans</h3>
<p>Be specific about what you will do after graduation and how you'll create impact.</p>
<h3>6. Closing</h3>
<p>End with confidence and gratitude.</p>
<h2>Common Mistakes to Avoid</h2>
<ul><li>Being too generic</li><li>Exceeding word limits</li><li>Focusing only on achievements without reflection</li><li>Spelling and grammar errors</li></ul>
<h2>Sample Opening Hooks</h2>
<p>"When I was eight years old, I watched my grandmother die from a preventable disease. That moment set me on a path to public health."</p>`,
    category: "Writing Tips",
    readTime: "8 min read",
    author: "TheOpenScholarships Team",
    authorRole: "Scholarship Expert",
    image: "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=1200&h=630&fit=crop",
    tags: ["personal statement", "writing tips", "application"],
    published: true
  },
  {
    title: "How to Get Strong Recommendation Letters",
    slug: "how-to-get-strong-recommendation-letters",
    excerpt: "A step-by-step guide to securing powerful recommendation letters from professors and employers.",
    content: `<h2>Why Recommendation Letters Matter</h2>
<p>A strong letter can validate your achievements and provide insight that numbers alone cannot.</p>
<h2>Who to Ask</h2>
<ul><li>Professors who know your work well</li><li>Supervisors from relevant work or volunteer positions</li><li>Mentors who can speak to your character</li><li>Avoid family friends unless they have professional standing</li></ul>
<h2>How to Ask</h2>
<ul><li>Ask at least 4-6 weeks before the deadline</li><li>Schedule a brief meeting or send a polite email</li><li>Provide your CV, draft personal statement, and scholarship details</li><li>Offer to provide a bullet-point list of key points to highlight</li></ul>
<h2>What to Provide Your Recommender</h2>
<ul><li>Deadline and submission instructions</li><li>Your updated CV/resume</li><li>A summary of the scholarship and why you're applying</li><li>Specific achievements or projects you'd like mentioned</li></ul>
<h2>Following Up</h2>
<ul><li>Send a gentle reminder 2 weeks before deadline</li><li>Thank them regardless of outcome</li><li>Update them on your results</li></ul>
<h2>Sample Request Email</h2>
<pre>Subject: Request for Recommendation Letter - [Your Name]

Dear [Professor Name],

I hope this email finds you well. I am applying for the [Scholarship Name] and would be honored if you could write a letter of recommendation on my behalf...</pre>`,
    category: "Recommendations",
    readTime: "6 min read",
    author: "TheOpenScholarships Team",
    authorRole: "Application Advisor",
    image: "https://images.unsplash.com/photo-1586281380349-632531db7ed6?w=1200&h=630&fit=crop",
    tags: ["recommendation letters", "references", "application tips"],
    published: true
  },
  {
    title: "IELTS Scholarship Guide: Scoring High for Fully Funded Opportunities",
    slug: "ielts-scholarship-guide",
    excerpt: "Everything you need to know about IELTS requirements for top scholarships, including minimum scores, preparation tips, and alternatives.",
    content: `<h2>IELTS Requirements for Major Scholarships</h2>
<ul><li>Chevening: Minimum 6.5 overall, no band below 5.5</li><li>DAAD: IELTS 6.5-7.0 depending on program</li><li>Fulbright: Minimum 6.5, competitive 7.0+</li><li>Erasmus Mundus: 6.0-7.0 depending on consortium</li></ul>
<h2>When to Take the IELTS</h2>
<p>Plan to take the test at least 3-4 months before scholarship deadlines. Results take 13 days, and you may need to retake.</p>
<h2>Preparation Tips</h2>
<ul><li>Familiarize yourself with the test format</li><li>Practice with official materials</li><li>Focus on your weakest section</li><li>Take full-length practice tests under timed conditions</li><li>Consider a prep course if self-study isn't enough</li></ul>
<h2>Alternatives to IELTS</h2>
<ul><li>TOEFL: Widely accepted in USA and Canada</li><li>PTE Academic: Growing acceptance</li><li>Duolingo English Test: Accepted by some universities</li><li>Cambridge English Exams</li></ul>
<h2>Score Validity</h2>
<p>IELTS scores are valid for 2 years. Plan your test date accordingly.</p>`,
    category: "Language Tests",
    readTime: "7 min read",
    author: "TheOpenScholarships Team",
    authorRole: "Test Prep Expert",
    image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=1200&h=630&fit=crop",
    tags: ["IELTS", "language test", "English proficiency"],
    published: true
  },
  {
    title: "Top 10 Fully Funded Scholarships for International Students 2026",
    slug: "top-10-scholarships-2026",
    excerpt: "A curated list of the most prestigious fully funded scholarships available for international students in 2026.",
    content: `<h2>1. Chevening Scholarship (UK)</h2>
<p>Full tuition, monthly stipend, travel costs.</p>
<h2>2. DAAD Scholarship (Germany)</h2>
<p>Full funding for master's and PhD students from developing countries.</p>
<h2>3. Fulbright Foreign Student Program (USA)</h2>
<p>Prestigious fully funded master's and PhD opportunities.</p>
<h2>4. MEXT Scholarship (Japan)</h2>
<p>Japanese government scholarship covering all expenses.</p>
<h2>5. Vanier Canada Graduate Scholarship</h2>
<p>CAD 50,000 per year for 3 years for PhD students.</p>
<h2>6. Erasmus Mundus Joint Masters</h2>
<p>Study in multiple European countries with full funding.</p>
<h2>7. Swiss Government Excellence Scholarship</h2>
<p>For PhD and postdoctoral research in Switzerland.</p>
<h2>8. Australia Awards Scholarships</h2>
<p>For students from developing countries to study in Australia.</p>
<h2>9. Gates Cambridge Scholarship</h2>
<p>Full-cost award for postgraduate study at University of Cambridge.</p>
<h2>10. Knight-Hennessy Scholars (Stanford)</h2>
<p>Full funding for graduate studies at Stanford University.</p>`,
    category: "Scholarship Lists",
    readTime: "10 min read",
    author: "TheOpenScholarships Team",
    authorRole: "Scholarship Researcher",
    image: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1200&h=630&fit=crop",
    tags: ["top scholarships", "fully funded", "2026"],
    published: true
  }
];

async function seed() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');
    
    const db = mongoose.connection.db;
    const collection = db.collection('blogposts');
    
    for (const post of missingPosts) {
      const existing = await collection.findOne({ slug: post.slug });
      if (existing) {
        console.log(`Post "${post.slug}" already exists. Skipping.`);
        continue;
      }
      
      const now = new Date();
      await collection.insertOne({
        ...post,
        createdAt: now,
        updatedAt: now
      });
      console.log(`Added: ${post.title}`);
    }
    
    console.log('\nMissing blog posts seeded successfully.');
    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('Error seeding:', error.message);
    process.exit(1);
  }
}

seed();
