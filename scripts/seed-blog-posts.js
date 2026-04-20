// Load environment variables from .env.local
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');

// Manually parse .env.local
const envPath = path.join(__dirname, '../.env.local');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  envContent.split('\n').forEach(line => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#')) {
      const [key, ...valueParts] = trimmed.split('=');
      const value = valueParts.join('=').replace(/^["']|["']$/g, '');
      if (key && value) {
        process.env[key] = value;
      }
    }
  });
}

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('MONGODB_URI not found in .env.local');
  process.exit(1);
}

// Define blog posts with their original content (summarized for brevity)
const blogPosts = [
  {
    title: "Complete Financial Guide for Studying Abroad: Scholarships, Loans, and Budgeting",
    slug: "complete-financial-guide-study-abroad",
    excerpt: "Learn how to finance your international education. Complete guide covering scholarships, student loans, part-time work, and living expenses.",
    content: `<h2>Understanding the True Cost of Studying Abroad</h2>
<p>Before you can plan your finances, you need to understand what you're planning for. The total cost of studying abroad includes:</p>
<ul><li><strong>Tuition fees</strong> - Varies by country, university, and program</li>
<li><strong>Living expenses</strong> - Accommodation, food, transportation</li>
<li><strong>Health insurance</strong> - Mandatory in most countries</li>
<li><strong>Travel costs</strong> - Flights and local transportation</li>
<li><strong>Visa fees</strong> - Application and residence permit costs</li>
<li><strong>Books and supplies</strong> - Course materials</li>
<li><strong>Personal expenses</strong> - Entertainment, clothing, phone</li></ul>
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
<p>If scholarships don't cover all your costs, consider student loans.</p>
<h2>Working While Studying</h2>
<p>Most countries allow international students to work part-time.</p>
<h2>Budgeting Tips for International Students</h2>
<ul><li>Create a monthly budget and track your expenses</li>
<li>Cook at home instead of eating out</li>
<li>Use student discounts for everything</li>
<li>Share accommodation with roommates</li>
<li>Use public transportation instead of taxis</li>
<li>Buy used textbooks or rent them</li>
<li>Take advantage of free campus events</li></ul>`,
    category: "Finance Guide",
    readTime: "10 min read",
    author: "TheOpenScholarships Team",
    authorRole: "Finance Expert",
    image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=1200&h=630&fit=crop",
    tags: ["finance", "budgeting", "student loans", "cost of living"],
    published: true
  },
  {
    title: "Country Comparison: Best Places to Study Abroad in 2026",
    slug: "country-comparison-study-abroad",
    excerpt: "Compare top study destinations: UK, USA, Germany, Canada, Australia. Tuition, living costs, scholarships, and post-study work visas.",
    content: `<h2>Choosing Your Study Destination</h2>
<p>Choosing where to study is one of the biggest decisions you'll make. This guide compares the top 6 destinations for international students.</p>
<h2>1. United Kingdom</h2>
<p><strong>Pros:</strong> World-renowned universities, shorter degree programs.</p>
<p><strong>Average Tuition:</strong> £10,000-38,000 per year</p>
<h2>2. United States</h2>
<p><strong>Pros:</strong> Most top-ranked universities, flexible programs.</p>
<p><strong>Average Tuition:</strong> $20,000-55,000 per year</p>
<h2>3. Germany</h2>
<p><strong>Pros:</strong> Low or no tuition fees, strong engineering programs.</p>
<p><strong>Average Tuition:</strong> €0-3,000 per year</p>
<h2>4. Canada</h2>
<p><strong>Pros:</strong> High quality of life, welcoming immigration policies.</p>
<h2>5. Australia</h2>
<p><strong>Pros:</strong> High-ranked universities, great weather.</p>
<h2>6. Netherlands</h2>
<p><strong>Pros:</strong> Many English-taught programs, central European location.</p>
<h2>Quick Comparison Table</h2>
<table><tr><th>Country</th><th>Avg Tuition (USD)</th><th>Living Costs (USD)</th><th>Work Visa (years)</th></tr>
<tr><td>Germany</td><td>$0-3,500</td><td>$11,000-13,000</td><td>1.5</td></tr>
<tr><td>Netherlands</td><td>$6,500-16,000</td><td>$11,000-13,000</td><td>1</td></tr>
<tr><td>Canada</td><td>$11,000-26,000</td><td>$9,000-11,000</td><td>3</td></tr>
<tr><td>UK</td><td>$13,000-50,000</td><td>$15,000-19,000</td><td>2</td></tr>
<tr><td>Australia</td><td>$13,000-30,000</td><td>$13,000-16,000</td><td>2-4</td></tr>
<tr><td>USA</td><td>$20,000-55,000</td><td>$15,000-20,000</td><td>1-3</td></tr></table>`,
    category: "Country Guide",
    readTime: "15 min read",
    author: "TheOpenScholarships Team",
    authorRole: "Education Consultant",
    image: "https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?w=1200&h=630&fit=crop",
    tags: ["country comparison", "study destinations", "UK", "USA", "Germany", "Canada", "Australia"],
    published: true
  },
  {
    title: "Scholarship Interview Guide: 50+ Questions and Proven Answers",
    slug: "scholarship-interview-guide",
    excerpt: "Master your scholarship interview with 50+ real questions, sample answers, and proven strategies from successful scholars.",
    content: `<h2>Why the Interview Matters</h2>
<p>If you've been invited for a scholarship interview, congratulations! You're already in the top tier of applicants.</p>
<h2>Before the Interview: Preparation Checklist</h2>
<ul><li>Research the scholarship thoroughly</li><li>Review your entire application</li><li>Prepare 5-7 stories about your leadership and achievements</li><li>Practice with mock interviews</li></ul>
<h2>Common Interview Questions and How to Answer</h2>
<h3>About You</h3>
<p><strong>1. Tell us about yourself.</strong><br/>Focus on your academic journey, key achievements, and what drives you.</p>
<p><strong>2. What are your strengths and weaknesses?</strong><br/>Be honest but strategic.</p>
<h3>Academic and Career Goals</h3>
<p><strong>4. Why did you choose your field of study?</strong></p>
<h3>Leadership and Experience</h3>
<p><strong>7. Tell us about a time you demonstrated leadership.</strong></p>
<h3>Why This Scholarship</h3>
<p><strong>10. Why did you choose this scholarship?</strong></p>
<h2>Sample Answers for Top Scholarships</h2>
<div><h3>Chevening Scholarship Interview</h3><p>"I plan to establish a mentorship program..."</p></div>
<div><h3>DAAD Scholarship Interview</h3><p>"Germany is a leader in renewable energy..."</p></div>
<div><h3>Fulbright Interview</h3><p>"I plan to organize weekly cultural events..."</p></div>
<h2>Questions to Ask the Interviewer</h2>
<h2>Video Interview Tips</h2>
<h2>After the Interview: Follow-Up</h2>`,
    category: "Interview Guide",
    readTime: "12 min read",
    author: "TheOpenScholarships Team",
    authorRole: "Interview Coach",
    image: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=1200&h=630&fit=crop",
    tags: ["interview", "scholarship tips", "preparation", "questions"],
    published: true
  },
  {
    title: "The Ultimate Scholarship Guide 2026: How to Win Fully Funded Scholarships",
    slug: "ultimate-scholarship-guide-2026",
    excerpt: "Complete guide to winning fully funded scholarships. Learn application strategies, document preparation, interview tips, and common mistakes to avoid.",
    content: `<h2>Introduction</h2>
<p>Every year, billions of dollars in scholarships go unclaimed.</p>
<h2>Chapter 1: Finding the Right Scholarships</h2>
<ul><li>Use multiple scholarship search engines</li><li>Check university websites directly</li><li>Follow scholarship providers on social media</li></ul>
<h2>Chapter 2: Understanding Eligibility Criteria</h2>
<ul><li>Country of citizenship</li><li>Academic requirements</li><li>Work experience</li><li>Language proficiency</li><li>Age limits</li></ul>
<h2>Chapter 3: Preparing Your Documents</h2>
<ul><li>Academic transcripts</li><li>Language test scores</li><li>Letters of recommendation</li><li>Statement of purpose</li><li>CV/Resume</li><li>Research proposal</li></ul>
<h2>Chapter 4: Writing a Winning Statement of Purpose</h2>
<ul><li>Start with a hook</li><li>Show your passion</li><li>Be specific about your goals</li><li>Connect to the scholarship</li><li>Use concrete examples</li></ul>
<h2>Chapter 5: Getting Strong Recommendation Letters</h2>
<h2>Chapter 6: Preparing for Interviews</h2>
<h2>Chapter 7: Common Mistakes to Avoid</h2>
<h2>Conclusion</h2>`,
    category: "Guide",
    readTime: "12 min read",
    author: "TheOpenScholarships Team",
    authorRole: "Scholarship Expert",
    image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=1200&h=630&fit=crop",
    tags: ["scholarship guide", "fully funded", "application tips", "how to win"],
    published: true
  }
];

async function seedBlogPosts() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');
    
    const db = mongoose.connection.db;
    const collection = db.collection('blogposts');
    
    for (const post of blogPosts) {
      // Check if post with this slug already exists
      const existing = await collection.findOne({ slug: post.slug });
      if (existing) {
        console.log(`Post with slug "${post.slug}" already exists. Skipping.`);
        continue;
      }
      
      // Add timestamps
      const now = new Date();
      const postWithTimestamps = {
        ...post,
        createdAt: now,
        updatedAt: now
      };
      
      await collection.insertOne(postWithTimestamps);
      console.log(`Added: ${post.title}`);
    }
    
    console.log('\nBlog posts seeding complete.');
    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('Error seeding blog posts:', error.message);
    process.exit(1);
  }
}

seedBlogPosts();
