// scripts/seed-all-content.js
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');

// 加载环境变量
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
  // GUIDES
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
    image: "https://images.unsplash.com/photo-1455390582262-044cdead277a?q=80&w=1200&auto=format",
    tags: ["personal statement", "writing tips", "application", "essay"],
    published: true,
    type: "guide",
    faqs: [
      { question: "How long should my personal statement be?", answer: "Most scholarships specify a word limit (usually 500-1000 words). Always adhere to the limit—going over may disqualify you." },
      { question: "Should I use a formal or creative tone?", answer: "Maintain a professional tone, but let your personality shine through. Avoid slang, but don't be overly stiff." }
    ]
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
<ul><li>Your updated CV/resume</li><li>Draft of your personal statement</li><li>Scholarship details and deadline</li><li>Submission instructions</li><li>Bullet points of achievements you'd like emphasized</li></ul>
<h2>Following Up</h2>
<ul><li>Send a gentle reminder 2 weeks before the deadline</li><li>Thank them regardless of outcome</li><li>Update them on your final result—they'll be happy to know!</li></ul>
<h2>Red Flags to Avoid</h2>
<ul><li>Asking too close to the deadline</li><li>Providing incomplete information</li><li>Choosing someone who barely knows you</li><li>Not waiving your right to view the letter (confidential letters carry more weight)</li></ul>`,
    category: "Recommendations",
    readTime: "6 min read",
    author: "TheOpenScholarships Team",
    authorRole: "Application Advisor",
    image: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=1200&auto=format",
    tags: ["recommendation letters", "references", "application tips"],
    published: true,
    type: "guide",
    faqs: [
      { question: "How many recommendation letters do I need?", answer: "Most scholarships require 2-3 letters. Check the specific requirements for each application." }
    ]
  },
  {
    title: "IELTS Scholarship Guide: Scoring High for Fully Funded Opportunities",
    slug: "ielts-scholarship-guide",
    excerpt: "Everything you need to know about IELTS requirements for top scholarships, including minimum scores, preparation tips, and alternatives.",
    content: `<h2>IELTS Requirements for Major Scholarships</h2>
<ul><li><strong>Chevening (UK):</strong> Minimum 6.5 overall, no band below 5.5</li><li><strong>DAAD (Germany):</strong> IELTS 6.5-7.0 depending on program</li><li><strong>Fulbright (USA):</strong> Minimum 6.5, competitive 7.0+</li><li><strong>Erasmus Mundus:</strong> 6.0-7.0 depending on consortium</li><li><strong>Australia Awards:</strong> Minimum 6.5 overall, no band below 6.0</li></ul>
<h2>When to Take the IELTS</h2>
<p>Plan to take the test at least 3-4 months before scholarship deadlines. Results take 13 days, and you may need to retake.</p>
<h2>Preparation Tips</h2>
<ul><li>Use official IELTS practice materials</li><li>Take full-length practice tests under timed conditions</li><li>Focus on your weakest section first</li><li>Improve vocabulary by reading academic articles</li><li>Practice speaking with a language partner</li></ul>`,
    category: "Language Tests",
    readTime: "7 min read",
    author: "TheOpenScholarships Team",
    authorRole: "Test Prep Expert",
    image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?q=80&w=1200&auto=format",
    tags: ["IELTS", "language test", "English proficiency"],
    published: true,
    type: "guide"
  },
  {
    title: "Scholarship Interview Guide: 50+ Questions and Proven Answers",
    slug: "scholarship-interview-guide",
    excerpt: "Master your scholarship interview with 50+ real questions, sample answers, and proven strategies from successful scholars.",
    content: `<h2>Why the Interview Matters</h2>
<p>If you've been invited for a scholarship interview, congratulations! You're already in the top tier of applicants. The interview is your chance to bring your application to life and show the committee who you really are.</p>
<h2>Before the Interview: Preparation Checklist</h2>
<ul><li>Research the scholarship thoroughly</li><li>Review your entire application</li><li>Prepare 5-7 stories about your leadership and achievements</li><li>Practice with mock interviews (record yourself)</li><li>Prepare thoughtful questions to ask them</li><li>Test your technology for video interviews</li><li>Choose professional attire</li></ul>
<h2>Common Interview Questions</h2>
<h3>About You</h3>
<p><strong>1. Tell us about yourself.</strong><br/>Focus on your academic journey, key achievements, and what drives you. Keep it concise (2-3 minutes).</p>
<p><strong>2. What are your strengths and weaknesses?</strong><br/>Be honest but strategic. For weaknesses, show how you're working to improve.</p>
<p><strong>3. Why do you deserve this scholarship?</strong><br/>Connect your achievements to the scholarship's mission. Show, don't just tell.</p>
<h3>Academic and Career Goals</h3>
<p><strong>4. Why did you choose your field of study?</strong><br/>Share a specific moment or experience that sparked your interest.</p>
<p><strong>5. What are your career plans after graduation?</strong><br/>Be specific about your goals and how your degree will help achieve them.</p>
<h3>Leadership and Experience</h3>
<p><strong>7. Tell us about a time you demonstrated leadership.</strong><br/>Use the STAR method: Situation, Task, Action, Result.</p>
<h3>Why This Scholarship</h3>
<p><strong>10. Why did you choose this scholarship?</strong><br/>Show you've done your research. Mention specific programs or values.</p>
<h2>Questions to Ask the Interviewer</h2>
<ul><li>"What does a successful scholar look like to this committee?"</li><li>"Are there opportunities for networking with alumni?"</li></ul>
<h2>After the Interview: Follow-Up</h2>
<ul><li>Send a thank you email within 24 hours</li><li>Mention something specific from the conversation</li><li>Reiterate your interest</li><li>Be patient—decisions take time</li></ul>`,
    category: "Interview Guide",
    readTime: "12 min read",
    author: "TheOpenScholarships Team",
    authorRole: "Interview Coach",
    image: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?q=80&w=1200&auto=format",
    tags: ["interview", "scholarship tips", "preparation"],
    published: true,
    type: "guide"
  },
  {
    title: "Country Comparison: Best Places to Study Abroad in 2026",
    slug: "country-comparison-study-abroad",
    excerpt: "Compare top study destinations: UK, USA, Germany, Canada, Australia. Tuition, living costs, scholarships, and post-study work visas.",
    content: `<h2>Choosing Your Study Destination</h2>
<p>Choosing where to study is one of the biggest decisions you'll make. This guide compares the top 6 destinations for international students.</p>
<h2>1. United Kingdom</h2>
<p><strong>Pros:</strong> World-renowned universities, shorter degree programs (1 year for master's).</p>
<p><strong>Average Tuition:</strong> £10,000-38,000 per year</p>
<p><strong>Living Costs:</strong> £12,000-15,000 per year</p>
<p><strong>Post-Study Work Visa:</strong> 2 years (Graduate Route)</p>
<h2>2. United States</h2>
<p><strong>Pros:</strong> Most top-ranked universities, flexible programs.</p>
<p><strong>Average Tuition:</strong> $20,000-55,000 per year</p>
<p><strong>Living Costs:</strong> $15,000-20,000 per year</p>
<p><strong>Post-Study Work Visa:</strong> 1-3 years (OPT)</p>
<h2>3. Germany</h2>
<p><strong>Pros:</strong> Low or no tuition fees, strong engineering programs.</p>
<p><strong>Average Tuition:</strong> €0-3,000 per year</p>
<p><strong>Living Costs:</strong> €10,000-12,000 per year</p>
<p><strong>Post-Study Work Visa:</strong> 18 months job seeker visa</p>
<h2>4. Canada</h2>
<p><strong>Pros:</strong> High quality of life, welcoming immigration policies.</p>
<h2>5. Australia</h2>
<p><strong>Pros:</strong> High-ranked universities, great weather.</p>
<h2>6. Netherlands</h2>
<p><strong>Pros:</strong> Many English-taught programs, central European location.</p>`,
    category: "Country Guide",
    readTime: "15 min read",
    author: "TheOpenScholarships Team",
    authorRole: "Education Consultant",
    image: "https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?q=80&w=1200&auto=format",
    tags: ["country comparison", "study destinations"],
    published: true,
    type: "guide"
  },
  {
    title: "Complete Financial Guide for Studying Abroad",
    slug: "complete-financial-guide-study-abroad",
    excerpt: "Learn how to finance your international education. Complete guide covering scholarships, student loans, part-time work, and living expenses.",
    content: `<h2>Understanding the True Cost of Studying Abroad</h2>
<p>Before you can plan your finances, you need to understand what you're planning for. The total cost includes tuition fees, living expenses, health insurance, travel costs, visa fees, books, and personal expenses.</p>
<h2>Average Costs by Country (per year)</h2>
<ul><li><strong>Germany</strong> - Tuition: €0-3,000, Living: €10,000-12,000</li>
<li><strong>Norway</strong> - Tuition: €0-5,000, Living: €12,000-15,000</li>
<li><strong>France</strong> - Tuition: €2,000-5,000, Living: €9,000-12,000</li>
<li><strong>Netherlands</strong> - Tuition: €6,000-15,000, Living: €10,000-12,000</li>
<li><strong>United Kingdom</strong> - Tuition: £10,000-38,000, Living: £12,000-15,000</li>
<li><strong>Canada</strong> - Tuition: CAD 15,000-35,000, Living: CAD 12,000-15,000</li>
<li><strong>Australia</strong> - Tuition: AUD 20,000-45,000, Living: AUD 20,000-25,000</li>
<li><strong>United States</strong> - Tuition: $20,000-55,000, Living: $15,000-20,000</li></ul>
<h2>Scholarships: The Best Funding Source</h2>
<p>Scholarships are the ideal funding source because you don't have to pay them back.</p>
<h2>Student Loans: When Scholarships Aren't Enough</h2>
<p>If scholarships don't cover all your costs, consider student loans from government, banks, or international lenders like Prodigy Finance.</p>
<h2>Working While Studying</h2>
<p>Most countries allow international students to work part-time (usually 20 hours per week during term).</p>`,
    category: "Finance Guide",
    readTime: "10 min read",
    author: "TheOpenScholarships Team",
    authorRole: "Finance Expert",
    image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?q=80&w=1200&auto=format",
    tags: ["finance", "budgeting", "student loans"],
    published: true,
    type: "guide"
  },
  {
    title: "The Ultimate Scholarship Guide 2026: How to Win Fully Funded Scholarships",
    slug: "ultimate-scholarship-guide-2026",
    excerpt: "Complete guide to winning fully funded scholarships. Learn application strategies, document preparation, interview tips, and common mistakes to avoid.",
    content: `<h2>Introduction</h2>
<p>Every year, billions of dollars in scholarships go unclaimed. This guide will change that for you.</p>
<h2>Chapter 1: Finding the Right Scholarships</h2>
<ul><li>Use multiple scholarship search engines</li><li>Check university websites directly</li><li>Follow scholarship providers on social media</li><li>Join scholarship communities</li><li>Set up email alerts</li></ul>
<h2>Chapter 2: Understanding Eligibility Criteria</h2>
<ul><li>Country of citizenship</li><li>Academic requirements</li><li>Work experience</li><li>Language proficiency</li><li>Age limits</li></ul>
<h2>Chapter 3: Preparing Your Documents</h2>
<ul><li>Academic transcripts</li><li>Language test scores</li><li>Letters of recommendation</li><li>Statement of purpose</li><li>CV/Resume</li><li>Research proposal (for PhD)</li></ul>
<h2>Chapter 4: Writing a Winning Statement of Purpose</h2>
<ul><li>Start with a hook</li><li>Show your passion</li><li>Be specific about your goals</li><li>Connect to the scholarship</li><li>Use concrete examples</li></ul>
<h2>Chapter 5: Getting Strong Recommendation Letters</h2>
<h2>Chapter 6: Preparing for Interviews</h2>
<h2>Chapter 7: Common Mistakes to Avoid</h2>`,
    category: "Guide",
    readTime: "12 min read",
    author: "TheOpenScholarships Team",
    authorRole: "Scholarship Expert",
    image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?q=80&w=1200&auto=format",
    tags: ["scholarship guide", "fully funded", "application tips"],
    published: true,
    type: "guide"
  },
  // BLOG ARTICLES
  {
    title: "Top 10 Fully Funded Scholarships for International Students 2026",
    slug: "top-10-scholarships-2026",
    excerpt: "A curated list of the most prestigious fully funded scholarships available for international students in 2026.",
    content: `<h2>1. Chevening Scholarship (UK)</h2><p>Full tuition, monthly stipend, travel costs.</p>
<h2>2. DAAD Scholarship (Germany)</h2><p>Full funding for master's and PhD students from developing countries.</p>
<h2>3. Fulbright Foreign Student Program (USA)</h2><p>Prestigious fully funded master's and PhD opportunities.</p>
<h2>4. MEXT Scholarship (Japan)</h2><p>Japanese government scholarship covering all expenses.</p>
<h2>5. Vanier Canada Graduate Scholarship</h2><p>CAD 50,000 per year for 3 years for PhD students.</p>
<h2>6. Erasmus Mundus Joint Masters</h2><p>Study in multiple European countries with full funding.</p>
<h2>7. Swiss Government Excellence Scholarship</h2>
<h2>8. Australia Awards Scholarships</h2>
<h2>9. Gates Cambridge Scholarship</h2>
<h2>10. Knight-Hennessy Scholars (Stanford)</h2>`,
    category: "Scholarship Lists",
    readTime: "10 min read",
    author: "TheOpenScholarships Team",
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
      if (existing) {
        console.log(`Updating existing post: ${post.slug}`);
        await collection.updateOne(
          { slug: post.slug },
          { $set: { ...post, updatedAt: new Date() } }
        );
      } else {
        console.log(`Creating new post: ${post.slug}`);
        await collection.insertOne({
          ...post,
          createdAt: new Date(),
          updatedAt: new Date()
        });
      }
    }
    
    console.log('\nAll content seeded successfully!');
    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('Error seeding:', error.message);
    process.exit(1);
  }
}

seed();