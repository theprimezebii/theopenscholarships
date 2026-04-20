// scripts/seed-next-50-scholarships.js
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');

// 加载 .env.local
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

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .substring(0, 60);
}

const imagePool = [
  'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=1200&auto=format',
  'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=1200&auto=format',
  'https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=1200&auto=format',
  'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?q=80&w=1200&auto=format',
  'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1200&auto=format',
  'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?q=80&w=1200&auto=format',
  'https://images.unsplash.com/photo-1562774053-701939374585?q=80&w=1200&auto=format',
  'https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?q=80&w=1200&auto=format',
  'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80&w=1200&auto=format',
  'https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=1200&auto=format'
];

function generateDeadline() {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const month = months[Math.floor(Math.random() * months.length)];
  const type = Math.random();
  let day;
  if (type < 0.33) day = 5;
  else if (type < 0.66) day = 15;
  else day = 25;
  const monthIndex = months.indexOf(month);
  return new Date(2026, monthIndex, day);
}

function calculateStatus(deadline) {
  const today = new Date();
  const daysUntil = Math.ceil((deadline - today) / (1000 * 60 * 60 * 24));
  if (deadline < today) return 'closed';
  if (daysUntil <= 14) return 'closing-soon';
  if (deadline.getFullYear() > today.getFullYear() + 1) return 'coming-soon';
  return 'open';
}

function generateFaqs() {
  return [
    { question: 'Is this scholarship fully funded?', answer: 'Yes, it covers tuition, living expenses, travel, and health insurance.' },
    { question: 'Can I apply if I am still completing my degree?', answer: 'Final-year students may apply with proof of enrollment and expected graduation.' },
    { question: 'Is there an application fee?', answer: 'No, there is no fee to apply for this scholarship.' }
  ];
}

function generateBenefits() {
  return [
    'Full tuition fee coverage',
    'Monthly living stipend',
    'Health insurance',
    'Round-trip airfare',
    'Research and conference allowances'
  ];
}

function generateEligibility(degreeLevel) {
  const base = [
    'Bachelor\'s degree in a relevant field',
    'Strong academic record (minimum GPA 3.0 or equivalent)',
    'English language proficiency (IELTS 6.5 or TOEFL 90)',
    'Demonstrated leadership and community involvement'
  ];
  if (degreeLevel.includes('PhD')) {
    base.push('Master\'s degree preferred for PhD applicants');
  }
  return base;
}

function generateHowToApply() {
  return [
    'Complete the online application form',
    'Upload academic transcripts and degree certificates',
    'Submit two letters of recommendation',
    'Write a statement of purpose',
    'Attend an interview if shortlisted'
  ];
}

function generateRequiredDocuments() {
  return [
    'Academic transcripts',
    'Curriculum Vitae',
    'Statement of purpose',
    'Two letters of recommendation',
    'Proof of English proficiency'
  ];
}

// 第四批50个全新不重复奖学金
const templates = [
  // 北欧扩展
  { name: 'Norwegian University of Science and Technology (NTNU) Scholarships', provider: 'NTNU', hostCountries: ['Norway'], region: ['Europe'], fields: ['Engineering', 'Natural Sciences', 'Architecture'], degreeLevel: ['Masters', 'PhD'], fundingType: ['Fully Funded'], officialLink: 'https://www.ntnu.edu/' },
  { name: 'University of Stavanger Scholarships', provider: 'University of Stavanger', hostCountries: ['Norway'], region: ['Europe'], fields: ['Petroleum Engineering', 'Business', 'Social Sciences'], degreeLevel: ['Masters'], fundingType: ['Fully Funded'], officialLink: 'https://www.uis.no/' },
  { name: 'Umeå University Scholarships', provider: 'Umeå University', hostCountries: ['Sweden'], region: ['Europe'], fields: ['All Fields'], degreeLevel: ['Masters'], fundingType: ['Fully Funded'], officialLink: 'https://www.umu.se/' },
  { name: 'Linköping University International Scholarships', provider: 'Linköping University', hostCountries: ['Sweden'], region: ['Europe'], fields: ['All Fields'], degreeLevel: ['Masters'], fundingType: ['Partial Funding'], officialLink: 'https://liu.se/' },
  { name: 'Aarhus University Scholarships', provider: 'Aarhus University', hostCountries: ['Denmark'], region: ['Europe'], fields: ['All Fields'], degreeLevel: ['Masters'], fundingType: ['Fully Funded'], officialLink: 'https://international.au.dk/' },
  { name: 'University of Southern Denmark Scholarships', provider: 'University of Southern Denmark', hostCountries: ['Denmark'], region: ['Europe'], fields: ['All Fields'], degreeLevel: ['Masters', 'PhD'], fundingType: ['Fully Funded'], officialLink: 'https://www.sdu.dk/' },
  // 西欧/南欧扩展
  { name: 'University of Luxembourg Scholarships', provider: 'University of Luxembourg', hostCountries: ['Luxembourg'], region: ['Europe'], fields: ['All Fields'], degreeLevel: ['Masters', 'PhD'], fundingType: ['Fully Funded'], officialLink: 'https://www.uni.lu/' },
  { name: 'University of Porto Scholarships', provider: 'University of Porto', hostCountries: ['Portugal'], region: ['Europe'], fields: ['All Fields'], degreeLevel: ['Masters', 'PhD'], fundingType: ['Fully Funded'], officialLink: 'https://www.up.pt/' },
  { name: 'University of Coimbra Scholarships', provider: 'University of Coimbra', hostCountries: ['Portugal'], region: ['Europe'], fields: ['All Fields'], degreeLevel: ['Masters', 'PhD'], fundingType: ['Fully Funded'], officialLink: 'https://www.uc.pt/' },
  { name: 'University of Barcelona Scholarships', provider: 'University of Barcelona', hostCountries: ['Spain'], region: ['Europe'], fields: ['All Fields'], degreeLevel: ['Masters', 'PhD'], fundingType: ['Fully Funded'], officialLink: 'https://www.ub.edu/' },
  { name: 'Autonomous University of Madrid Scholarships', provider: 'Autonomous University of Madrid', hostCountries: ['Spain'], region: ['Europe'], fields: ['All Fields'], degreeLevel: ['Masters', 'PhD'], fundingType: ['Fully Funded'], officialLink: 'https://www.uam.es/' },
  { name: 'University of Zagreb Scholarships', provider: 'University of Zagreb', hostCountries: ['Croatia'], region: ['Europe'], fields: ['All Fields'], degreeLevel: ['Masters', 'PhD'], fundingType: ['Fully Funded'], officialLink: 'http://www.unizg.hr/' },
  { name: 'University of Ljubljana Scholarships', provider: 'University of Ljubljana', hostCountries: ['Slovenia'], region: ['Europe'], fields: ['All Fields'], degreeLevel: ['Masters', 'PhD'], fundingType: ['Fully Funded'], officialLink: 'https://www.uni-lj.si/' },
  // 北美更多名校
  { name: 'Caltech Scholarships', provider: 'California Institute of Technology', hostCountries: ['United States'], region: ['North America'], fields: ['Science', 'Engineering'], degreeLevel: ['PhD'], fundingType: ['Fully Funded'], officialLink: 'https://www.caltech.edu/' },
  { name: 'University of California, Berkeley Scholarships', provider: 'UC Berkeley', hostCountries: ['United States'], region: ['North America'], fields: ['All Fields'], degreeLevel: ['Masters', 'PhD'], fundingType: ['Fully Funded'], officialLink: 'https://www.berkeley.edu/' },
  { name: 'University of California, Los Angeles (UCLA) Scholarships', provider: 'UCLA', hostCountries: ['United States'], region: ['North America'], fields: ['All Fields'], degreeLevel: ['Masters', 'PhD'], fundingType: ['Fully Funded'], officialLink: 'https://www.ucla.edu/' },
  { name: 'New York University (NYU) Scholarships', provider: 'New York University', hostCountries: ['United States'], region: ['North America'], fields: ['All Fields'], degreeLevel: ['Masters', 'PhD'], fundingType: ['Fully Funded'], officialLink: 'https://www.nyu.edu/' },
  { name: 'University of Washington Scholarships', provider: 'University of Washington', hostCountries: ['United States'], region: ['North America'], fields: ['All Fields'], degreeLevel: ['Masters', 'PhD'], fundingType: ['Fully Funded'], officialLink: 'https://www.washington.edu/' },
  { name: 'University of Texas at Austin Scholarships', provider: 'UT Austin', hostCountries: ['United States'], region: ['North America'], fields: ['All Fields'], degreeLevel: ['Masters', 'PhD'], fundingType: ['Fully Funded'], officialLink: 'https://www.utexas.edu/' },
  { name: 'University of Illinois Urbana-Champaign Scholarships', provider: 'UIUC', hostCountries: ['United States'], region: ['North America'], fields: ['Engineering', 'Computer Science', 'Business'], degreeLevel: ['Masters', 'PhD'], fundingType: ['Fully Funded'], officialLink: 'https://illinois.edu/' },
  // 加拿大更多
  { name: 'University of Calgary Scholarships', provider: 'University of Calgary', hostCountries: ['Canada'], region: ['North America'], fields: ['All Fields'], degreeLevel: ['Masters', 'PhD'], fundingType: ['Fully Funded'], officialLink: 'https://www.ucalgary.ca/' },
  { name: 'University of Ottawa Scholarships', provider: 'University of Ottawa', hostCountries: ['Canada'], region: ['North America'], fields: ['All Fields'], degreeLevel: ['Masters', 'PhD'], fundingType: ['Fully Funded'], officialLink: 'https://www.uottawa.ca/' },
  { name: 'Dalhousie University Scholarships', provider: 'Dalhousie University', hostCountries: ['Canada'], region: ['North America'], fields: ['All Fields'], degreeLevel: ['Masters', 'PhD'], fundingType: ['Fully Funded'], officialLink: 'https://www.dal.ca/' },
  { name: 'Simon Fraser University Scholarships', provider: 'Simon Fraser University', hostCountries: ['Canada'], region: ['North America'], fields: ['All Fields'], degreeLevel: ['Masters', 'PhD'], fundingType: ['Fully Funded'], officialLink: 'https://www.sfu.ca/' },
  // 亚洲更多
  { name: 'Nagoya University Scholarships', provider: 'Nagoya University', hostCountries: ['Japan'], region: ['Asia Pacific'], fields: ['All Fields'], degreeLevel: ['Masters', 'PhD'], fundingType: ['Fully Funded'], officialLink: 'https://www.nagoya-u.ac.jp/' },
  { name: 'Hokkaido University Scholarships', provider: 'Hokkaido University', hostCountries: ['Japan'], region: ['Asia Pacific'], fields: ['All Fields'], degreeLevel: ['Masters', 'PhD'], fundingType: ['Fully Funded'], officialLink: 'https://www.hokudai.ac.jp/' },
  { name: 'Sungkyunkwan University (SKKU) Scholarships', provider: 'Sungkyunkwan University', hostCountries: ['South Korea'], region: ['Asia Pacific'], fields: ['All Fields'], degreeLevel: ['Masters', 'PhD'], fundingType: ['Fully Funded'], officialLink: 'https://www.skku.edu/' },
  { name: 'Hanyang University Scholarships', provider: 'Hanyang University', hostCountries: ['South Korea'], region: ['Asia Pacific'], fields: ['Engineering', 'Business', 'Humanities'], degreeLevel: ['Masters', 'PhD'], fundingType: ['Fully Funded'], officialLink: 'https://www.hanyang.ac.kr/' },
  { name: 'Nanjing University Scholarships', provider: 'Nanjing University', hostCountries: ['China'], region: ['Asia Pacific'], fields: ['All Fields'], degreeLevel: ['Masters', 'PhD'], fundingType: ['Fully Funded'], officialLink: 'https://www.nju.edu.cn/' },
  { name: 'Shanghai Jiao Tong University Scholarships', provider: 'Shanghai Jiao Tong University', hostCountries: ['China'], region: ['Asia Pacific'], fields: ['All Fields'], degreeLevel: ['Masters', 'PhD'], fundingType: ['Fully Funded'], officialLink: 'https://www.sjtu.edu.cn/' },
  { name: 'Indian Institute of Technology (IIT) Scholarships', provider: 'IIT', hostCountries: ['India'], region: ['Asia Pacific'], fields: ['Engineering', 'Technology', 'Sciences'], degreeLevel: ['Masters', 'PhD'], fundingType: ['Fully Funded'], officialLink: 'https://www.iitsystem.ac.in/' },
  { name: 'University of Delhi Scholarships', provider: 'University of Delhi', hostCountries: ['India'], region: ['Asia Pacific'], fields: ['All Fields'], degreeLevel: ['Masters', 'PhD'], fundingType: ['Fully Funded'], officialLink: 'https://www.du.ac.in/' },
  // 澳大利亚更多
  { name: 'University of Western Australia Scholarships', provider: 'University of Western Australia', hostCountries: ['Australia'], region: ['Asia Pacific'], fields: ['All Fields'], degreeLevel: ['Masters', 'PhD'], fundingType: ['Fully Funded'], officialLink: 'https://www.uwa.edu.au/' },
  { name: 'Macquarie University Scholarships', provider: 'Macquarie University', hostCountries: ['Australia'], region: ['Asia Pacific'], fields: ['All Fields'], degreeLevel: ['Masters', 'PhD'], fundingType: ['Fully Funded'], officialLink: 'https://www.mq.edu.au/' },
  { name: 'Griffith University Scholarships', provider: 'Griffith University', hostCountries: ['Australia'], region: ['Asia Pacific'], fields: ['All Fields'], degreeLevel: ['Masters', 'PhD'], fundingType: ['Fully Funded'], officialLink: 'https://www.griffith.edu.au/' },
  // 中东
  { name: 'Hamad Bin Khalifa University Scholarships', provider: 'Hamad Bin Khalifa University', hostCountries: ['Qatar'], region: ['Middle East'], fields: ['All Fields'], degreeLevel: ['Masters', 'PhD'], fundingType: ['Fully Funded'], officialLink: 'https://www.hbku.edu.qa/' },
  { name: 'Zayed University Scholarships', provider: 'Zayed University', hostCountries: ['UAE'], region: ['Middle East'], fields: ['All Fields'], degreeLevel: ['Bachelor', 'Masters'], fundingType: ['Fully Funded'], officialLink: 'https://www.zu.ac.ae/' },
  { name: 'King Fahd University of Petroleum and Minerals Scholarships', provider: 'KFUPM', hostCountries: ['Saudi Arabia'], region: ['Middle East'], fields: ['Engineering', 'Sciences', 'Business'], degreeLevel: ['Masters', 'PhD'], fundingType: ['Fully Funded'], officialLink: 'http://www.kfupm.edu.sa/' },
  // 非洲
  { name: 'University of Johannesburg Scholarships', provider: 'University of Johannesburg', hostCountries: ['South Africa'], region: ['Africa'], fields: ['All Fields'], degreeLevel: ['Masters', 'PhD'], fundingType: ['Fully Funded'], officialLink: 'https://www.uj.ac.za/' },
  { name: 'Rhodes University Scholarships', provider: 'Rhodes University', hostCountries: ['South Africa'], region: ['Africa'], fields: ['All Fields'], degreeLevel: ['Masters', 'PhD'], fundingType: ['Fully Funded'], officialLink: 'https://www.ru.ac.za/' },
  { name: 'University of Ibadan Scholarships', provider: 'University of Ibadan', hostCountries: ['Nigeria'], region: ['Africa'], fields: ['All Fields'], degreeLevel: ['Masters', 'PhD'], fundingType: ['Fully Funded'], officialLink: 'https://www.ui.edu.ng/' },
  { name: 'Covenant University Scholarships', provider: 'Covenant University', hostCountries: ['Nigeria'], region: ['Africa'], fields: ['All Fields'], degreeLevel: ['Bachelor', 'Masters', 'PhD'], fundingType: ['Fully Funded'], officialLink: 'https://www.covenantuniversity.edu.ng/' },
  // 拉丁美洲
  { name: 'University of Costa Rica Scholarships', provider: 'University of Costa Rica', hostCountries: ['Costa Rica'], region: ['Latin America'], fields: ['All Fields'], degreeLevel: ['Masters', 'PhD'], fundingType: ['Fully Funded'], officialLink: 'https://www.ucr.ac.cr/' },
  { name: 'University of the West Indies Scholarships', provider: 'University of the West Indies', hostCountries: ['Multiple Countries'], region: ['Latin America'], fields: ['All Fields'], degreeLevel: ['Masters', 'PhD'], fundingType: ['Fully Funded'], officialLink: 'https://www.uwi.edu/' },
  // 特殊领域奖学金
  { name: 'Schlumberger Foundation Faculty for the Future Fellowship', provider: 'Schlumberger Foundation', hostCountries: ['Multiple Countries'], region: ['Global'], fields: ['STEM'], degreeLevel: ['PhD', 'Postdoctoral'], fundingType: ['Fully Funded'], officialLink: 'https://www.slb.com/about/foundation/faculty-for-the-future' },
  { name: 'PEO International Peace Scholarship', provider: 'PEO International', hostCountries: ['United States', 'Canada'], region: ['North America'], fields: ['All Fields'], degreeLevel: ['Masters', 'PhD'], fundingType: ['Fully Funded'], officialLink: 'https://www.peointernational.org/' },
  { name: 'AAUW International Fellowships', provider: 'American Association of University Women', hostCountries: ['United States'], region: ['North America'], fields: ['All Fields'], degreeLevel: ['Masters', 'PhD', 'Postdoctoral'], fundingType: ['Fully Funded'], officialLink: 'https://www.aauw.org/' },
  { name: 'Microsoft Research PhD Fellowship', provider: 'Microsoft', hostCountries: ['Multiple Countries'], region: ['Global'], fields: ['Computer Science', 'AI', 'Machine Learning'], degreeLevel: ['PhD'], fundingType: ['Fully Funded'], officialLink: 'https://www.microsoft.com/en-us/research/academic-program/phd-fellowship/' },
  { name: 'Google PhD Fellowship Program', provider: 'Google', hostCountries: ['Multiple Countries'], region: ['Global'], fields: ['Computer Science', 'Engineering'], degreeLevel: ['PhD'], fundingType: ['Fully Funded'], officialLink: 'https://research.google/outreach/phd-fellowship/' },
  { name: 'IBM PhD Fellowship', provider: 'IBM', hostCountries: ['Multiple Countries'], region: ['Global'], fields: ['Computer Science', 'AI', 'Quantum Computing'], degreeLevel: ['PhD'], fundingType: ['Fully Funded'], officialLink: 'https://www.research.ibm.com/university/awards/phdfellowship.shtml' },
  { name: 'Facebook Fellowship Program', provider: 'Meta', hostCountries: ['Multiple Countries'], region: ['Global'], fields: ['Computer Science', 'AI', 'AR/VR'], degreeLevel: ['PhD'], fundingType: ['Fully Funded'], officialLink: 'https://research.facebook.com/fellowship/' }
];

async function seed() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');
    const db = mongoose.connection.db;
    const collection = db.collection('scholarships');
    
    let inserted = 0;
    let skipped = 0;
    
    for (const template of templates) {
      let slug = slugify(template.name);
      const existing = await collection.findOne({ slug });
      if (existing) {
        console.log(`Skipping existing: ${template.name}`);
        skipped++;
        continue;
      }
      
      let counter = 1;
      while (await collection.findOne({ slug })) {
        slug = `${slugify(template.name)}-${counter}`;
        counter++;
      }
      
      const deadline = generateDeadline();
      const status = calculateStatus(deadline);
      
      const scholarship = {
        title: template.name,
        slug,
        provider: template.provider,
        hostCountries: template.hostCountries,
        region: template.region,
        fields: template.fields,
        degreeLevel: template.degreeLevel,
        fundingType: template.fundingType,
        programMode: ['on-campus', 'full-time'],
        programDuration: template.degreeLevel.includes('PhD') ? ['3-years', '4-years'] : ['1-year', '2-years'],
        programLevel: template.degreeLevel.includes('PhD') ? ['research'] : ['regular'],
        deadline,
        status,
        description: `${template.name} is a prestigious award offered by ${template.provider} for outstanding international students to pursue higher education in ${template.hostCountries.join(', ')}. The scholarship covers all major expenses including tuition, living costs, travel, and health insurance. It aims to foster academic excellence and cultural exchange.`,
        benefits: generateBenefits(),
        eligibility: generateEligibility(template.degreeLevel),
        howToApply: generateHowToApply(),
        requiredDocuments: generateRequiredDocuments(),
        applicationTips: 'Start your application early and tailor your personal statement to highlight your unique strengths and alignment with the scholarship values.',
        importantDates: {
          resultsAnnouncement: '2-3 months after deadline',
          programmeStart: 'September/October 2026'
        },
        faqs: generateFaqs(),
        officialLink: template.officialLink,
        featured: Math.random() > 0.8,
        views: Math.floor(Math.random() * 500),
        image: imagePool[Math.floor(Math.random() * imagePool.length)],
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      await collection.insertOne(scholarship);
      console.log(`Inserted: ${template.name}`);
      inserted++;
    }
    
    console.log(`\nCompleted. Inserted: ${inserted}, Skipped: ${skipped}`);
    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

seed();