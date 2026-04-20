const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');

// Load .env.local
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
  console.error('MONGODB_URI not found in .env.local');
  process.exit(1);
}

// Topic data
const topics = [
  {
    title: "How to write a winning personal statement for Chevening?",
    category: "Application Tips",
    content: "I'm applying for Chevening this year and struggling with the personal statement. Any tips from past scholars on how to structure it and what to emphasize?",
    author: "Maria Garcia",
    tags: ["Chevening", "personal statement", "application"]
  },
  {
    title: "DAAD scholarship interview experience – what to expect?",
    category: "Scholarship Experiences",
    content: "I've been shortlisted for a DAAD interview! I'm excited but nervous. Could anyone share their interview experience? What kind of questions did they ask?",
    author: "Ahmed Hassan",
    tags: ["DAAD", "interview", "Germany"]
  },
  {
    title: "IELTS vs TOEFL – which is better for US scholarships?",
    category: "Language Tests",
    content: "I'm targeting Fulbright and other US scholarships. Should I take IELTS or TOEFL? Which one is more widely accepted or easier to score high on?",
    author: "Linda Chen",
    tags: ["IELTS", "TOEFL", "language tests", "USA"]
  },
  {
    title: "How many recommendation letters do I really need?",
    category: "Application Tips",
    content: "Different scholarships ask for 2 or 3 letters. Should I submit more than required? And who should I ask – professors or employers?",
    author: "Carlos Mendez",
    tags: ["recommendations", "applications"]
  },
  {
    title: "Erasmus Mundus joint master – how does it work?",
    category: "Scholarship Applications",
    content: "I'm confused about the Erasmus Mundus structure. Do I apply to the consortium or individual universities? How does the mobility work?",
    author: "Elena Popescu",
    tags: ["Erasmus Mundus", "Europe", "joint master"]
  },
  {
    title: "Visa process for UK student visa after scholarship award",
    category: "Visa Guidance",
    content: "I've been awarded a Chevening scholarship. What's the next step for the visa? How long does it take and what documents are needed?",
    author: "Samuel Okafor",
    tags: ["visa", "UK", "Chevening"]
  },
  {
    title: "Anyone applied to Australia Awards? Need timeline advice",
    category: "Scholarship Applications",
    content: "I'm preparing my Australia Awards application. When should I take the IELTS, and how early should I contact potential supervisors?",
    author: "Priya Sharma",
    tags: ["Australia Awards", "timeline", "PhD"]
  },
  {
    title: "Fulbright personal statement – how to stand out?",
    category: "Application Tips",
    content: "The Fulbright personal statement prompt is quite open-ended. How did you approach it? Any successful examples or advice?",
    author: "Fatima Al-Mansouri",
    tags: ["Fulbright", "personal statement", "USA"]
  },
  {
    title: "Is it worth applying to multiple scholarships at once?",
    category: "General Discussion",
    content: "I'm considering applying to Chevening, DAAD, and Erasmus all in the same year. Is this too much? How do you manage overlapping deadlines?",
    author: "Juan Pablo Rodriguez",
    tags: ["multiple applications", "time management"]
  },
  {
    title: "Tips for a strong research proposal for PhD scholarships",
    category: "Application Tips",
    content: "I'm applying for PhD scholarships that require a research proposal. How detailed should it be? Any templates or examples?",
    author: "Wei Zhang",
    tags: ["PhD", "research proposal", "applications"]
  }
];

// Sample reply content
const replyTemplates = [
  "Great question! I went through this last year. {specific_advice}",
  "I had the same concern when I applied. Here's what worked for me: {specific_advice}",
  "From my experience, the key is to {specific_advice}",
  "I'd recommend checking the official guidelines first, but generally {specific_advice}",
  "One thing I wish I knew earlier: {specific_advice}",
  "This is super important. {specific_advice}",
  "I disagree slightly with some advice here. In my case, {specific_advice}",
  "Thanks for asking this! {specific_advice}",
  "I can share what a past scholar told me: {specific_advice}",
  "The most helpful tip I received was: {specific_advice}"
];

const specificAdvice = [
  "focus on showing leadership and impact rather than just listing achievements.",
  "practice with a friend and record yourself to improve body language.",
  "IELTS is more common in the UK and Australia; TOEFL is preferred in the US.",
  "two strong letters from professors who know you well are better than three generic ones.",
  "you apply to the consortium, which then allocates you to two or three universities.",
  "the visa process takes about 3 weeks once you have your CAS statement.",
  "aim to take IELTS at least 3 months before the deadline.",
  "tell a compelling story that connects your past, present, and future goals.",
  "it's definitely doable if you stay organized and reuse core materials.",
  "your proposal should clearly state the research gap and your methodology."
];

function generateReply() {
  const template = replyTemplates[Math.floor(Math.random() * replyTemplates.length)];
  const advice = specificAdvice[Math.floor(Math.random() * specificAdvice.length)];
  return template.replace('{specific_advice}', advice);
}

const authors = [
  "Emily Johnson", "Michael Brown", "Sophia Williams", "James Smith", "Olivia Davis",
  "Daniel Miller", "Isabella Wilson", "David Moore", "Emma Taylor", "Lucas Anderson"
];

async function seed() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');
    
    const db = mongoose.connection.db;
    const topicsCollection = db.collection('forumtopics');
    const repliesCollection = db.collection('forumreplies');
    
    // Clear existing data (optional – remove if you want to keep existing)
    await topicsCollection.deleteMany({});
    await repliesCollection.deleteMany({});
    console.log('Cleared existing forum data');
    
    const createdTopics = [];
    
    for (const topicData of topics) {
      const slug = topicData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      const now = new Date();
      const topic = {
        ...topicData,
        slug,
        replies: 0,
        views: Math.floor(Math.random() * 500) + 50,
        likes: Math.floor(Math.random() * 30),
        pinned: false,
        lastActivity: now,
        createdAt: now,
        updatedAt: now
      };
      
      const result = await topicsCollection.insertOne(topic);
      const topicId = result.insertedId;
      createdTopics.push({ id: topicId, title: topicData.title });
      
      // Generate 10-15 replies for this topic
      const replyCount = Math.floor(Math.random() * 6) + 10; // 10 to 15
      const replies = [];
      for (let i = 0; i < replyCount; i++) {
        const replyDate = new Date(now.getTime() - Math.random() * 7 * 24 * 60 * 60 * 1000);
        replies.push({
          topicId: topicId,
          content: generateReply(),
          author: authors[Math.floor(Math.random() * authors.length)],
          likes: Math.floor(Math.random() * 15),
          createdAt: replyDate,
          updatedAt: replyDate
        });
      }
      
      if (replies.length > 0) {
        await repliesCollection.insertMany(replies);
        // Update topic reply count
        await topicsCollection.updateOne(
          { _id: topicId },
          { $set: { replies: replies.length } }
        );
      }
      
      console.log(`Created topic: ${topicData.title} with ${replies.length} replies`);
    }
    
    console.log('\nForum seeding complete!');
    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('Error seeding forum:', error.message);
    process.exit(1);
  }
}

seed();
