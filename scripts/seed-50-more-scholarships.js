// scripts/seed-50-more-scholarships.js
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

// 已验证可用的图片池
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

// 50 个全新的奖学金模板（确保与之前的列表不重复）
const newScholarshipTemplates = [
  // 英国更多
  { name: 'Edinburgh Global Research Scholarship', provider: 'University of Edinburgh', hostCountries: ['United Kingdom'], region: ['Europe'], fields: ['All Fields'], degreeLevel: ['PhD'], fundingType: ['Fully Funded'], officialLink: 'https://www.ed.ac.uk/' },
  { name: 'Imperial College London PhD Scholarship', provider: 'Imperial College London', hostCountries: ['United Kingdom'], region: ['Europe'], fields: ['Engineering', 'Medicine', 'Natural Sciences', 'Business'], degreeLevel: ['PhD'], fundingType: ['Fully Funded'], officialLink: 'https://www.imperial.ac.uk/' },
  { name: 'Warwick Chancellor\'s International Scholarship', provider: 'University of Warwick', hostCountries: ['United Kingdom'], region: ['Europe'], fields: ['All Fields'], degreeLevel: ['PhD'], fundingType: ['Fully Funded'], officialLink: 'https://warwick.ac.uk/' },
  { name: 'Bristol Think Big Scholarship', provider: 'University of Bristol', hostCountries: ['United Kingdom'], region: ['Europe'], fields: ['All Fields'], degreeLevel: ['Bachelor', 'Masters'], fundingType: ['Partial Funding'], officialLink: 'https://www.bristol.ac.uk/' },
  { name: 'Sheffield International Merit Scholarship', provider: 'University of Sheffield', hostCountries: ['United Kingdom'], region: ['Europe'], fields: ['All Fields'], degreeLevel: ['Masters'], fundingType: ['Partial Funding'], officialLink: 'https://www.sheffield.ac.uk/' },
  // 美国更多
  { name: 'Yale University Scholarships', provider: 'Yale University', hostCountries: ['United States'], region: ['North America'], fields: ['All Fields'], degreeLevel: ['Bachelor', 'Masters', 'PhD'], fundingType: ['Fully Funded', 'Partial Funding'], officialLink: 'https://www.yale.edu/' },
  { name: 'Princeton University Scholarships', provider: 'Princeton University', hostCountries: ['United States'], region: ['North America'], fields: ['All Fields'], degreeLevel: ['Bachelor', 'Masters', 'PhD'], fundingType: ['Fully Funded'], officialLink: 'https://www.princeton.edu/' },
  { name: 'MIT Scholarships', provider: 'Massachusetts Institute of Technology', hostCountries: ['United States'], region: ['North America'], fields: ['Engineering', 'Computer Science', 'Natural Sciences', 'Business'], degreeLevel: ['Bachelor', 'Masters', 'PhD'], fundingType: ['Fully Funded'], officialLink: 'https://www.mit.edu/' },
  { name: 'Columbia University International Scholarships', provider: 'Columbia University', hostCountries: ['United States'], region: ['North America'], fields: ['All Fields'], degreeLevel: ['Masters', 'PhD'], fundingType: ['Fully Funded'], officialLink: 'https://www.columbia.edu/' },
  { name: 'University of Chicago Scholarships', provider: 'University of Chicago', hostCountries: ['United States'], region: ['North America'], fields: ['All Fields'], degreeLevel: ['Masters', 'PhD'], fundingType: ['Fully Funded'], officialLink: 'https://www.uchicago.edu/' },
  // 加拿大更多
  { name: 'University of Toronto Lester B. Pearson Scholarship', provider: 'University of Toronto', hostCountries: ['Canada'], region: ['North America'], fields: ['All Fields'], degreeLevel: ['Bachelor'], fundingType: ['Fully Funded'], officialLink: 'https://www.utoronto.ca/' },
  { name: 'UBC International Leader of Tomorrow Award', provider: 'University of British Columbia', hostCountries: ['Canada'], region: ['North America'], fields: ['All Fields'], degreeLevel: ['Bachelor'], fundingType: ['Fully Funded'], officialLink: 'https://www.ubc.ca/' },
  { name: 'McGill University Scholarships', provider: 'McGill University', hostCountries: ['Canada'], region: ['North America'], fields: ['All Fields'], degreeLevel: ['Masters', 'PhD'], fundingType: ['Fully Funded'], officialLink: 'https://www.mcgill.ca/' },
  { name: 'University of Alberta Scholarships', provider: 'University of Alberta', hostCountries: ['Canada'], region: ['North America'], fields: ['All Fields'], degreeLevel: ['Masters', 'PhD'], fundingType: ['Fully Funded'], officialLink: 'https://www.ualberta.ca/' },
  // 澳大利亚更多
  { name: 'University of Melbourne Graduate Research Scholarships', provider: 'University of Melbourne', hostCountries: ['Australia'], region: ['Asia Pacific'], fields: ['All Fields'], degreeLevel: ['Masters', 'PhD'], fundingType: ['Fully Funded'], officialLink: 'https://www.unimelb.edu.au/' },
  { name: 'University of Sydney International Scholarships', provider: 'University of Sydney', hostCountries: ['Australia'], region: ['Asia Pacific'], fields: ['All Fields'], degreeLevel: ['Masters', 'PhD'], fundingType: ['Fully Funded'], officialLink: 'https://www.sydney.edu.au/' },
  { name: 'ANU International Scholarships', provider: 'Australian National University', hostCountries: ['Australia'], region: ['Asia Pacific'], fields: ['All Fields'], degreeLevel: ['Masters', 'PhD'], fundingType: ['Fully Funded'], officialLink: 'https://www.anu.edu.au/' },
  { name: 'University of Queensland Scholarships', provider: 'University of Queensland', hostCountries: ['Australia'], region: ['Asia Pacific'], fields: ['All Fields'], degreeLevel: ['Masters', 'PhD'], fundingType: ['Fully Funded'], officialLink: 'https://www.uq.edu.au/' },
  // 欧洲其他地区
  { name: 'ETH Zurich Excellence Scholarship', provider: 'ETH Zurich', hostCountries: ['Switzerland'], region: ['Europe'], fields: ['Engineering', 'Natural Sciences', 'Mathematics'], degreeLevel: ['Masters'], fundingType: ['Fully Funded'], officialLink: 'https://ethz.ch/' },
  { name: 'EPFL Excellence Fellowships', provider: 'EPFL', hostCountries: ['Switzerland'], region: ['Europe'], fields: ['Engineering', 'Computer Science', 'Life Sciences'], degreeLevel: ['Masters'], fundingType: ['Fully Funded'], officialLink: 'https://www.epfl.ch/' },
  { name: 'University of Copenhagen Scholarships', provider: 'University of Copenhagen', hostCountries: ['Denmark'], region: ['Europe'], fields: ['All Fields'], degreeLevel: ['Masters', 'PhD'], fundingType: ['Fully Funded'], officialLink: 'https://www.ku.dk/' },
  { name: 'Lund University Global Scholarship', provider: 'Lund University', hostCountries: ['Sweden'], region: ['Europe'], fields: ['All Fields'], degreeLevel: ['Masters'], fundingType: ['Partial Funding'], officialLink: 'https://www.lunduniversity.lu.se/' },
  { name: 'University of Helsinki Scholarships', provider: 'University of Helsinki', hostCountries: ['Finland'], region: ['Europe'], fields: ['All Fields'], degreeLevel: ['Masters'], fundingType: ['Fully Funded'], officialLink: 'https://www.helsinki.fi/' },
  { name: 'Radboud University Scholarships', provider: 'Radboud University', hostCountries: ['Netherlands'], region: ['Europe'], fields: ['All Fields'], degreeLevel: ['Masters'], fundingType: ['Fully Funded'], officialLink: 'https://www.ru.nl/' },
  { name: 'KU Leuven Scholarships', provider: 'KU Leuven', hostCountries: ['Belgium'], region: ['Europe'], fields: ['All Fields'], degreeLevel: ['Masters', 'PhD'], fundingType: ['Fully Funded'], officialLink: 'https://www.kuleuven.be/' },
  // 亚洲更多
  { name: 'University of Tokyo Scholarships', provider: 'University of Tokyo', hostCountries: ['Japan'], region: ['Asia Pacific'], fields: ['All Fields'], degreeLevel: ['Masters', 'PhD'], fundingType: ['Fully Funded'], officialLink: 'https://www.u-tokyo.ac.jp/' },
  { name: 'Kyoto University Scholarships', provider: 'Kyoto University', hostCountries: ['Japan'], region: ['Asia Pacific'], fields: ['All Fields'], degreeLevel: ['Masters', 'PhD'], fundingType: ['Fully Funded'], officialLink: 'https://www.kyoto-u.ac.jp/' },
  { name: 'Seoul National University Scholarships', provider: 'Seoul National University', hostCountries: ['South Korea'], region: ['Asia Pacific'], fields: ['All Fields'], degreeLevel: ['Masters', 'PhD'], fundingType: ['Fully Funded'], officialLink: 'https://www.snu.ac.kr/' },
  { name: 'KAIST Scholarships', provider: 'KAIST', hostCountries: ['South Korea'], region: ['Asia Pacific'], fields: ['Engineering', 'Natural Sciences', 'Business'], degreeLevel: ['Masters', 'PhD'], fundingType: ['Fully Funded'], officialLink: 'https://www.kaist.ac.kr/' },
  { name: 'Tsinghua University Scholarships', provider: 'Tsinghua University', hostCountries: ['China'], region: ['Asia Pacific'], fields: ['All Fields'], degreeLevel: ['Masters', 'PhD'], fundingType: ['Fully Funded'], officialLink: 'https://www.tsinghua.edu.cn/' },
  { name: 'Peking University Scholarships', provider: 'Peking University', hostCountries: ['China'], region: ['Asia Pacific'], fields: ['All Fields'], degreeLevel: ['Masters', 'PhD'], fundingType: ['Fully Funded'], officialLink: 'https://www.pku.edu.cn/' },
  { name: 'NUS Scholarships', provider: 'National University of Singapore', hostCountries: ['Singapore'], region: ['Asia Pacific'], fields: ['All Fields'], degreeLevel: ['Masters', 'PhD'], fundingType: ['Fully Funded'], officialLink: 'https://www.nus.edu.sg/' },
  { name: 'NTU Scholarships', provider: 'Nanyang Technological University', hostCountries: ['Singapore'], region: ['Asia Pacific'], fields: ['All Fields'], degreeLevel: ['Masters', 'PhD'], fundingType: ['Fully Funded'], officialLink: 'https://www.ntu.edu.sg/' },
  { name: 'Hong Kong PhD Fellowship Scheme', provider: 'Research Grants Council of Hong Kong', hostCountries: ['Hong Kong'], region: ['Asia Pacific'], fields: ['All Fields'], degreeLevel: ['PhD'], fundingType: ['Fully Funded'], officialLink: 'https://www.ugc.edu.hk/' },
  { name: 'Taiwan Government Scholarship', provider: 'Ministry of Education, Taiwan', hostCountries: ['Taiwan'], region: ['Asia Pacific'], fields: ['All Fields'], degreeLevel: ['Masters', 'PhD'], fundingType: ['Fully Funded'], officialLink: 'https://www.studyintaiwan.org/' },
  // 中东
  { name: 'Qatar University Scholarships', provider: 'Qatar University', hostCountries: ['Qatar'], region: ['Middle East'], fields: ['All Fields'], degreeLevel: ['Bachelor', 'Masters', 'PhD'], fundingType: ['Fully Funded'], officialLink: 'http://www.qu.edu.qa/' },
  { name: 'Khalifa University Scholarships', provider: 'Khalifa University', hostCountries: ['UAE'], region: ['Middle East'], fields: ['Engineering', 'Medicine', 'Sciences'], degreeLevel: ['Masters', 'PhD'], fundingType: ['Fully Funded'], officialLink: 'https://www.ku.ac.ae/' },
  { name: 'American University of Beirut Scholarships', provider: 'American University of Beirut', hostCountries: ['Lebanon'], region: ['Middle East'], fields: ['All Fields'], degreeLevel: ['Bachelor', 'Masters'], fundingType: ['Fully Funded', 'Partial Funding'], officialLink: 'https://www.aub.edu.lb/' },
  // 非洲
  { name: 'African Union Scholarships', provider: 'African Union Commission', hostCountries: ['Multiple Countries'], region: ['Africa'], fields: ['All Fields'], degreeLevel: ['Masters', 'PhD'], fundingType: ['Fully Funded'], officialLink: 'https://au.int/' },
  { name: 'Mastercard Foundation Scholars Program', provider: 'Mastercard Foundation', hostCountries: ['Multiple Countries'], region: ['Africa'], fields: ['All Fields'], degreeLevel: ['Bachelor', 'Masters'], fundingType: ['Fully Funded'], officialLink: 'https://mastercardfdn.org/' },
  { name: 'University of Cape Town Scholarships', provider: 'University of Cape Town', hostCountries: ['South Africa'], region: ['Africa'], fields: ['All Fields'], degreeLevel: ['Masters', 'PhD'], fundingType: ['Fully Funded'], officialLink: 'https://www.uct.ac.za/' },
  { name: 'University of the Witwatersrand Scholarships', provider: 'University of the Witwatersrand', hostCountries: ['South Africa'], region: ['Africa'], fields: ['All Fields'], degreeLevel: ['Masters', 'PhD'], fundingType: ['Fully Funded'], officialLink: 'https://www.wits.ac.za/' },
  // 拉丁美洲
  { name: 'University of São Paulo Scholarships', provider: 'University of São Paulo', hostCountries: ['Brazil'], region: ['Latin America'], fields: ['All Fields'], degreeLevel: ['Masters', 'PhD'], fundingType: ['Fully Funded'], officialLink: 'https://www.usp.br/' },
  { name: 'Tec de Monterrey Scholarships', provider: 'Tecnológico de Monterrey', hostCountries: ['Mexico'], region: ['Latin America'], fields: ['All Fields'], degreeLevel: ['Bachelor', 'Masters'], fundingType: ['Partial Funding'], officialLink: 'https://tec.mx/' },
  { name: 'University of Buenos Aires Scholarships', provider: 'University of Buenos Aires', hostCountries: ['Argentina'], region: ['Latin America'], fields: ['All Fields'], degreeLevel: ['Masters', 'PhD'], fundingType: ['Fully Funded'], officialLink: 'https://www.uba.ar/' },
  // 其他著名奖学金
  { name: 'Rotary Peace Fellowship', provider: 'Rotary International', hostCountries: ['Multiple Countries'], region: ['Global'], fields: ['Peace Studies', 'Conflict Resolution'], degreeLevel: ['Masters', 'Certificate'], fundingType: ['Fully Funded'], officialLink: 'https://www.rotary.org/' },
  { name: 'Aga Khan Foundation International Scholarship', provider: 'Aga Khan Foundation', hostCountries: ['Multiple Countries'], region: ['Global'], fields: ['All Fields'], degreeLevel: ['Masters', 'PhD'], fundingType: ['Fully Funded', 'Partial Funding'], officialLink: 'https://www.akdn.org/' },
  { name: 'OPEC Fund for International Development Scholarship', provider: 'OPEC Fund', hostCountries: ['Multiple Countries'], region: ['Global'], fields: ['Development Studies', 'Economics', 'Engineering'], degreeLevel: ['Masters'], fundingType: ['Fully Funded'], officialLink: 'https://opecfund.org/' },
  { name: 'VLIR-UOS Scholarships', provider: 'VLIR-UOS', hostCountries: ['Belgium'], region: ['Europe'], fields: ['Development Studies', 'Public Health', 'Agriculture'], degreeLevel: ['Masters'], fundingType: ['Fully Funded'], officialLink: 'https://www.vliruos.be/' },
  { name: 'CERN Doctoral Student Programme', provider: 'CERN', hostCountries: ['Switzerland'], region: ['Europe'], fields: ['Physics', 'Engineering', 'Computing'], degreeLevel: ['PhD'], fundingType: ['Fully Funded'], officialLink: 'https://careers.cern/' }
];

async function seed() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');
    const db = mongoose.connection.db;
    const collection = db.collection('scholarships');
    
    let inserted = 0;
    let skipped = 0;
    
    for (const template of newScholarshipTemplates) {
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