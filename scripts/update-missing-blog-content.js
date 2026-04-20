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
    content: `<h2>Why Your Personal Statement Matters</h2>
<p>The personal statement is your opportunity to tell your unique story. Scholarship committees read hundreds of applications—your personal statement is what makes you memorable.</p>
<h2>Before You Start Writing</h2>
<ul><li>Research the scholarship's mission and values</li><li>List your key achievements and experiences</li><li>Identify 3-5 core themes that define you</li><li>Read successful sample statements</li></ul>
<h2>Structure of a Winning Personal Statement</h2>
<h3>1. Compelling Opening Hook</h3>
<p>Start with a specific moment, question, or insight that captures attention immediately. Avoid clichés like "I have always wanted to..."</p>
<h3>2. Your Academic Journey</h3>
<p>Explain what drew you to your field of study. Mention specific courses, projects, or professors that shaped your interests.</p>
<h3>3. Relevant Experiences</h3>
<p>Describe work, volunteer, research, or leadership experiences. Use concrete examples and quantify impact where possible.</p>
<h3>4. Why This Scholarship?</h3>
<p>Connect your goals to the scholarship's mission. Show you've done your research about the program and institution.</p>
<h3>5. Future Vision</h3>
<p>Be specific about your career goals and how this opportunity will help you achieve them. Explain how you'll contribute to your community.</p>
<h3>6. Strong Closing</h3>
<p>End with confidence, gratitude, and a forward-looking statement.</p>
<h2>Common Mistakes to Avoid</h2>
<ul><li>Being too generic—tailor each statement</li><li>Exceeding word limits</li><li>Focusing only on achievements without reflection</li><li>Spelling and grammar errors</li><li>Using clichés and vague language</li></ul>
<h2>Sample Opening Hooks</h2>
<p>"At age twelve, I watched my grandmother struggle to access basic healthcare in our village. That moment sparked my commitment to public health."</p>
<p>"During my internship at a local NGO, I realized that policy changes—not just charity—create lasting impact. I want to study public policy to drive systemic change."</p>`,
    category: "Writing Tips",
    readTime: "8 min read",
    author: "TheOpenScholarships Team",
    authorRole: "Scholarship Expert",
    image: "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=1200&h=630&fit=crop",
    tags: ["personal statement", "writing tips", "application", "essay"],
    published: true
  },
  {
    title: "How to Get Strong Recommendation Letters",
    slug: "how-to-get-strong-recommendation-letters",
    excerpt: "A step-by-step guide to securing powerful recommendation letters from professors and employers.",
    content: `<h2>Why Recommendation Letters Matter</h2>
<p>A strong letter validates your achievements and provides third-party credibility that your personal statement cannot. Admissions committees rely on letters to understand your character, work ethic, and potential.</p>
<h2>Who to Ask</h2>
<ul><li><strong>Professors</strong> who know your academic work well—ideally from upper-level courses where you excelled</li><li><strong>Supervisors</strong> from internships, jobs, or volunteer positions relevant to your field</li><li><strong>Mentors</strong> who can speak to your leadership and personal qualities</li><li>Avoid family friends unless they have direct professional experience with you</li></ul>
<h2>How to Ask (With Scripts)</h2>
<h3>In Person or Email?</h3>
<p>If possible, ask in person. Otherwise, send a polite, personalized email.</p>
<h3>Sample Email Request</h3>
<pre>Subject: Recommendation Letter Request – [Your Name] – [Scholarship Name]

Dear [Professor/Supervisor Name],

I hope this email finds you well. I am applying for the [Scholarship Name] and would be honored if you could write a letter of recommendation on my behalf.

I thoroughly enjoyed [specific course/project] because [genuine reason]. Your guidance helped me develop [specific skill/insight].

The deadline is [date]. If you agree, I'll provide my CV, draft personal statement, and a summary of key points to highlight.

Thank you for considering my request.

Best regards,
[Your Name]</pre>
<h2>What to Provide Your Recommender</h2>
<ul><li>Your updated CV/resume</li><li>Draft of your personal statement</li><li>Scholarship details and deadline</li><li>Submission instructions (online portal link or email address)</li><li>Bullet points of achievements you'd like emphasized</li></ul>
<h2>Following Up</h2>
<ul><li>Send a gentle reminder 2 weeks before the deadline</li><li>Thank them regardless of outcome</li><li>Update them on your final result—they'll be happy to know!</li></ul>
<h2>Red Flags to Avoid</h2>
<ul><li>Asking too close to the deadline</li><li>Providing incomplete information</li><li>Choosing someone who barely knows you</li><li>Not waiving your right to view the letter (confidential letters carry more weight)</li></ul>`,
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
<ul><li><strong>Chevening (UK):</strong> Minimum 6.5 overall, no band below 5.5</li><li><strong>DAAD (Germany):</strong> IELTS 6.5-7.0 depending on program; some programs accept TOEFL</li><li><strong>Fulbright (USA):</strong> Minimum 6.5, competitive applicants have 7.0+</li><li><strong>Erasmus Mundus:</strong> 6.0-7.0 depending on consortium</li><li><strong>Australia Awards:</strong> Minimum 6.5 overall, no band below 6.0</li></ul>
<h2>When to Take the IELTS</h2>
<p>Plan to take the test at least 3-4 months before scholarship deadlines. Results take 13 days, and you may need to retake if scores aren't competitive.</p>
<h2>IELTS Test Format</h2>
<ul><li><strong>Listening:</strong> 30 minutes, 4 sections</li><li><strong>Reading:</strong> 60 minutes, 3 passages</li><li><strong>Writing:</strong> 60 minutes, 2 tasks</li><li><strong>Speaking:</strong> 11-14 minutes, face-to-face interview</li></ul>
<h2>Preparation Tips</h2>
<ul><li>Use official IELTS practice materials from British Council or IDP</li><li>Take full-length practice tests under timed conditions</li><li>Focus on your weakest section first</li><li>Improve vocabulary by reading academic articles</li><li>Practice speaking with a language partner or record yourself</li><li>Consider an online prep course if self-study isn't enough</li></ul>
<h2>Alternatives to IELTS</h2>
<ul><li><strong>TOEFL iBT:</strong> Widely accepted in USA and Canada (minimum 90-100)</li><li><strong>PTE Academic:</strong> Growing acceptance, especially in Australia</li><li><strong>Duolingo English Test:</strong> Accepted by some universities as a cheaper alternative</li><li><strong>Cambridge English Exams (C1 Advanced/C2 Proficiency):</strong> Valid for life</li></ul>
<h2>Score Validity and Retakes</h2>
<p>IELTS scores are valid for 2 years. Plan accordingly. If you need to retake, you can do so as often as you like (waiting periods may apply).</p>`,
    category: "Language Tests",
    readTime: "7 min read",
    author: "TheOpenScholarships Team",
    authorRole: "Test Prep Expert",
    image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=1200&h=630&fit=crop",
    tags: ["IELTS", "language test", "English proficiency", "TOEFL"],
    published: true
  }
];

async function updatePosts() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');
    
    const db = mongoose.connection.db;
    const collection = db.collection('blogposts');
    
    for (const post of posts) {
      const result = await collection.updateOne(
        { slug: post.slug },
        { $set: { ...post, updatedAt: new Date() } },
        { upsert: true }
      );
      if (result.upsertedCount > 0) {
        console.log(`Created: ${post.slug}`);
      } else if (result.modifiedCount > 0) {
        console.log(`Updated: ${post.slug}`);
      } else {
        console.log(`No changes: ${post.slug}`);
      }
    }
    
    console.log('\nBlog posts updated successfully.');
    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

updatePosts();
