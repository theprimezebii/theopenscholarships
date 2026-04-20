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
  console.error('MONGODB_URI not found in .env.local');
  process.exit(1);
}

const stories = [
  {
    name: "Aisha Mohammed",
    country: "Nigeria",
    scholarship: "Chevening Scholarship",
    university: "University of Oxford",
    year: 2024,
    program: "MSc in Public Policy",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&h=200&fit=crop&auto=format",
    quote: "TheOpenScholarships helped me discover Chevening. Today, I'm shaping policy that impacts millions.",
    fullStory: "Growing up in Lagos, Aisha saw firsthand how poor policy decisions affected her community. After finding Chevening on TheOpenScholarships, she crafted a compelling application and secured a fully funded place at Oxford. She now works with the Nigerian government on education reform.",
    published: true,
    order: 1
  },
  {
    name: "Carlos Mendez",
    country: "Mexico",
    scholarship: "DAAD Scholarship",
    university: "Technical University of Munich",
    year: 2025,
    program: "MSc in Renewable Energy",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&h=200&fit=crop&auto=format",
    quote: "Without TheOpenScholarships, I would never have known about DAAD. Now I'm building Mexico's solar future.",
    fullStory: "Carlos spent months searching for funding until he stumbled upon TheOpenScholarships. The detailed DAAD listing gave him the confidence to apply. He now leads a solar energy startup in Guadalajara, employing 15 people.",
    published: true,
    order: 2
  },
  {
    name: "Priya Sharma",
    country: "India",
    scholarship: "Australia Awards Scholarship",
    university: "University of Melbourne",
    year: 2023,
    program: "Master of Public Health",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&h=200&fit=crop&auto=format",
    quote: "I applied to 12 scholarships with TheOpenScholarships's guidance and won the Australia Awards.",
    fullStory: "Priya used TheOpenScholarships's comparison tools to shortlist scholarships matching her public health background. Her persistence paid off with a fully funded place in Melbourne. She now manages health programs across rural India.",
    published: true,
    order: 3
  },
  {
    name: "David Kimani",
    country: "Kenya",
    scholarship: "Rhodes Scholarship",
    university: "University of Oxford",
    year: 2024,
    program: "DPhil in Development Studies",
    image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=200&h=200&fit=crop&auto=format",
    quote: "TheOpenScholarships's resources made my Rhodes application stand out.",
    fullStory: "David accessed TheOpenScholarships's personal statement guides and interview tips to refine his Rhodes application. He is now researching sustainable agriculture solutions for East Africa at Oxford.",
    published: true,
    order: 4
  },
  {
    name: "Elena Petrova",
    country: "Russia",
    scholarship: "Eiffel Excellence Scholarship",
    university: "Sciences Po Paris",
    year: 2025,
    program: "Master in International Relations",
    image: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?q=80&w=200&h=200&fit=crop&auto=format",
    quote: "TheOpenScholarships simplified my search for French scholarships.",
    fullStory: "Elena used TheOpenScholarships's filter by country feature to discover the Eiffel Scholarship. She is now studying diplomacy in Paris and interning at the Russian Embassy.",
    published: true,
    order: 5
  },
  {
    name: "Wei Zhang",
    country: "China",
    scholarship: "MEXT Scholarship",
    university: "University of Tokyo",
    year: 2023,
    program: "PhD in Artificial Intelligence",
    image: "https://images.unsplash.com/photo-1552058544-f2b08422138a?q=80&w=200&h=200&fit=crop&auto=format",
    quote: "I found my MEXT scholarship in under an hour on TheOpenScholarships.",
    fullStory: "Wei wanted to study AI in Japan but didn't know where to start. TheOpenScholarships's clear MEXT listing walked him through every step. He now conducts research on ethical AI at the University of Tokyo.",
    published: true,
    order: 6
  },
  {
    name: "Fatima Al-Mansouri",
    country: "UAE",
    scholarship: "Fulbright Foreign Student Program",
    university: "Harvard University",
    year: 2024,
    program: "Master in Education Policy",
    image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=200&h=200&fit=crop&auto=format",
    quote: "TheOpenScholarships's community forum gave me the confidence to apply for Fulbright.",
    fullStory: "Fatima connected with past Fulbright scholars through TheOpenScholarships's forum. Their advice helped her secure a place at Harvard. She now works to improve STEM education for girls in the Middle East.",
    published: true,
    order: 7
  },
  {
    name: "Juan Pablo Rodriguez",
    country: "Argentina",
    scholarship: "Erasmus Mundus Joint Master",
    university: "University of Groningen & Uppsala University",
    year: 2025,
    program: "MSc in Environmental Sciences",
    image: "https://images.unsplash.com/photo-1508341591423-4347099e1f19?q=80&w=200&h=200&fit=crop&auto=format",
    quote: "Studying in two European countries fully funded – a dream made possible by TheOpenScholarships.",
    fullStory: "Juan Pablo discovered the Erasmus Mundus program on TheOpenScholarships and successfully applied to a consortium spanning the Netherlands and Sweden. He now specializes in climate adaptation policy.",
    published: true,
    order: 8
  }
];

async function seed() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');
    
    const db = mongoose.connection.db;
    const collection = db.collection('successstories');
    
    // Clear existing stories (optional – remove if you want to keep existing)
    await collection.deleteMany({});
    console.log('Cleared existing stories');
    
    const result = await collection.insertMany(stories);
    console.log(`Added ${result.insertedCount} success stories`);
    
    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('Error seeding:', error.message);
    process.exit(1);
  }
}

seed();
