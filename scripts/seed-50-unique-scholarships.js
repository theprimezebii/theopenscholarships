// scripts/seed-50-unique-scholarships.js
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

// 50个全新的、不重复的奖学金模板（覆盖更多地区和类型）
const uniqueTemplates = [
  // 欧洲其他地区
  { name: 'Ghent University Top-up Grants', provider: 'Ghent University', hostCountries: ['Belgium'], region: ['Europe'], fields: ['All Fields'], degreeLevel: ['Masters', 'PhD'], fundingType: ['Partial Funding'], officialLink: 'https://www.ugent.be/' },
  { name: 'University of Twente Scholarship', provider: 'University of Twente', hostCountries: ['Netherlands'], region: ['Europe'], fields: ['Engineering', 'Technology', 'Sciences'], degreeLevel: ['Masters'], fundingType: ['Partial Funding'], officialLink: 'https://www.utwente.nl/' },
  { name: 'Maastricht University Holland-High Potential Scholarship', provider: 'Maastricht University', hostCountries: ['Netherlands'], region: ['Europe'], fields: ['All Fields'], degreeLevel: ['Masters'], fundingType: ['Fully Funded'], officialLink: 'https://www.maastrichtuniversity.nl/' },
  { name: 'Aalto University Scholarship', provider: 'Aalto University', hostCountries: ['Finland'], region: ['Europe'], fields: ['Engineering', 'Business', 'Arts', 'Design'], degreeLevel: ['Masters'], fundingType: ['Fully Funded', 'Partial Funding'], officialLink: 'https://www.aalto.fi/' },
  { name: 'Chalmers University of Technology IPOET Scholarship', provider: 'Chalmers University of Technology', hostCountries: ['Sweden'], region: ['Europe'], fields: ['Engineering', 'Architecture', 'Sciences'], degreeLevel: ['Masters'], fundingType: ['Partial Funding'], officialLink: 'https://www.chalmers.se/' },
  { name: 'University of Bologna Study Grants', provider: 'University of Bologna', hostCountries: ['Italy'], region: ['Europe'], fields: ['All Fields'], degreeLevel: ['Bachelor', 'Masters'], fundingType: ['Fully Funded'], officialLink: 'https://www.unibo.it/' },
  { name: 'Sapienza University of Rome Scholarships', provider: 'Sapienza University of Rome', hostCountries: ['Italy'], region: ['Europe'], fields: ['All Fields'], degreeLevel: ['Masters', 'PhD'], fundingType: ['Fully Funded'], officialLink: 'https://www.uniroma1.it/' },
  { name: 'University of Vienna Scholarships', provider: 'University of Vienna', hostCountries: ['Austria'], region: ['Europe'], fields: ['All Fields'], degreeLevel: ['Masters', 'PhD'], fundingType: ['Fully Funded'], officialLink: 'https://www.univie.ac.at/' },
  { name: 'Charles University Scholarships', provider: 'Charles University', hostCountries: ['Czech Republic'], region: ['Europe'], fields: ['All Fields'], degreeLevel: ['Masters', 'PhD'], fundingType: ['Fully Funded'], officialLink: 'https://cuni.cz/' },
  { name: 'Warsaw University of Technology Scholarships', provider: 'Warsaw University of Technology', hostCountries: ['Poland'], region: ['Europe'], fields: ['Engineering', 'Computer Science'], degreeLevel: ['Masters'], fundingType: ['Fully Funded'], officialLink: 'https://www.pw.edu.pl/' },
  { name: 'Eötvös Loránd University Scholarships', provider: 'Eötvös Loránd University', hostCountries: ['Hungary'], region: ['Europe'], fields: ['All Fields'], degreeLevel: ['Masters', 'PhD'], fundingType: ['Fully Funded'], officialLink: 'https://www.elte.hu/' },
  // 北美更多
  { name: 'Duke University Scholarships', provider: 'Duke University', hostCountries: ['United States'], region: ['North America'], fields: ['All Fields'], degreeLevel: ['Masters', 'PhD'], fundingType: ['Fully Funded'], officialLink: 'https://www.duke.edu/' },
  { name: 'Northwestern University Scholarships', provider: 'Northwestern University', hostCountries: ['United States'], region: ['North America'], fields: ['All Fields'], degreeLevel: ['Masters', 'PhD'], fundingType: ['Fully Funded'], officialLink: 'https://www.northwestern.edu/' },
  { name: 'University of Michigan Scholarships', provider: 'University of Michigan', hostCountries: ['United States'], region: ['North America'], fields: ['All Fields'], degreeLevel: ['Masters', 'PhD'], fundingType: ['Fully Funded'], officialLink: 'https://umich.edu/' },
  { name: 'University of Pennsylvania Scholarships', provider: 'University of Pennsylvania', hostCountries: ['United States'], region: ['North America'], fields: ['All Fields'], degreeLevel: ['Masters', 'PhD'], fundingType: ['Fully Funded'], officialLink: 'https://www.upenn.edu/' },
  { name: 'Cornell University Scholarships', provider: 'Cornell University', hostCountries: ['United States'], region: ['North America'], fields: ['All Fields'], degreeLevel: ['Masters', 'PhD'], fundingType: ['Fully Funded'], officialLink: 'https://www.cornell.edu/' },
  { name: 'University of Waterloo Scholarships', provider: 'University of Waterloo', hostCountries: ['Canada'], region: ['North America'], fields: ['Engineering', 'Computer Science', 'Mathematics'], degreeLevel: ['Masters', 'PhD'], fundingType: ['Fully Funded'], officialLink: 'https://uwaterloo.ca/' },
  { name: 'McMaster University Scholarships', provider: 'McMaster University', hostCountries: ['Canada'], region: ['North America'], fields: ['Health Sciences', 'Engineering', 'Business'], degreeLevel: ['Masters', 'PhD'], fundingType: ['Fully Funded'], officialLink: 'https://www.mcmaster.ca/' },
  { name: 'Western University Scholarships', provider: 'Western University', hostCountries: ['Canada'], region: ['North America'], fields: ['All Fields'], degreeLevel: ['Masters', 'PhD'], fundingType: ['Fully Funded'], officialLink: 'https://www.uwo.ca/' },
  // 亚洲更多
  { name: 'Osaka University Scholarships', provider: 'Osaka University', hostCountries: ['Japan'], region: ['Asia Pacific'], fields: ['All Fields'], degreeLevel: ['Masters', 'PhD'], fundingType: ['Fully Funded'], officialLink: 'https://www.osaka-u.ac.jp/' },
  { name: 'Tohoku University Scholarships', provider: 'Tohoku University', hostCountries: ['Japan'], region: ['Asia Pacific'], fields: ['Engineering', 'Sciences', 'Medicine'], degreeLevel: ['Masters', 'PhD'], fundingType: ['Fully Funded'], officialLink: 'https://www.tohoku.ac.jp/' },
  { name: 'Yonsei University Scholarships', provider: 'Yonsei University', hostCountries: ['South Korea'], region: ['Asia Pacific'], fields: ['All Fields'], degreeLevel: ['Masters', 'PhD'], fundingType: ['Fully Funded'], officialLink: 'https://www.yonsei.ac.kr/' },
  { name: 'Korea University Scholarships', provider: 'Korea University', hostCountries: ['South Korea'], region: ['Asia Pacific'], fields: ['All Fields'], degreeLevel: ['Masters', 'PhD'], fundingType: ['Fully Funded'], officialLink: 'https://www.korea.edu/' },
  { name: 'Fudan University Scholarships', provider: 'Fudan University', hostCountries: ['China'], region: ['Asia Pacific'], fields: ['All Fields'], degreeLevel: ['Masters', 'PhD'], fundingType: ['Fully Funded'], officialLink: 'https://www.fudan.edu.cn/' },
  { name: 'Zhejiang University Scholarships', provider: 'Zhejiang University', hostCountries: ['China'], region: ['Asia Pacific'], fields: ['All Fields'], degreeLevel: ['Masters', 'PhD'], fundingType: ['Fully Funded'], officialLink: 'https://www.zju.edu.cn/' },
  { name: 'University of Malaya Scholarships', provider: 'University of Malaya', hostCountries: ['Malaysia'], region: ['Asia Pacific'], fields: ['All Fields'], degreeLevel: ['Masters', 'PhD'], fundingType: ['Fully Funded'], officialLink: 'https://www.um.edu.my/' },
  { name: 'Universiti Putra Malaysia Scholarships', provider: 'Universiti Putra Malaysia', hostCountries: ['Malaysia'], region: ['Asia Pacific'], fields: ['Agriculture', 'Sciences', 'Engineering'], degreeLevel: ['Masters', 'PhD'], fundingType: ['Fully Funded'], officialLink: 'https://www.upm.edu.my/' },
  { name: 'Chulalongkorn University Scholarships', provider: 'Chulalongkorn University', hostCountries: ['Thailand'], region: ['Asia Pacific'], fields: ['All Fields'], degreeLevel: ['Masters', 'PhD'], fundingType: ['Fully Funded'], officialLink: 'https://www.chula.ac.th/' },
  { name: 'Mahidol University Scholarships', provider: 'Mahidol University', hostCountries: ['Thailand'], region: ['Asia Pacific'], fields: ['Health Sciences', 'Sciences', 'Humanities'], degreeLevel: ['Masters', 'PhD'], fundingType: ['Fully Funded'], officialLink: 'https://www.mahidol.ac.th/' },
  { name: 'University of the Philippines Scholarships', provider: 'University of the Philippines', hostCountries: ['Philippines'], region: ['Asia Pacific'], fields: ['All Fields'], degreeLevel: ['Masters', 'PhD'], fundingType: ['Fully Funded'], officialLink: 'https://up.edu.ph/' },
  // 澳大利亚/新西兰更多
  { name: 'Monash University Scholarships', provider: 'Monash University', hostCountries: ['Australia'], region: ['Asia Pacific'], fields: ['All Fields'], degreeLevel: ['Masters', 'PhD'], fundingType: ['Fully Funded'], officialLink: 'https://www.monash.edu/' },
  { name: 'UNSW Scholarships', provider: 'University of New South Wales', hostCountries: ['Australia'], region: ['Asia Pacific'], fields: ['All Fields'], degreeLevel: ['Masters', 'PhD'], fundingType: ['Fully Funded'], officialLink: 'https://www.unsw.edu.au/' },
  { name: 'University of Adelaide Scholarships', provider: 'University of Adelaide', hostCountries: ['Australia'], region: ['Asia Pacific'], fields: ['All Fields'], degreeLevel: ['Masters', 'PhD'], fundingType: ['Fully Funded'], officialLink: 'https://www.adelaide.edu.au/' },
  { name: 'University of Otago Scholarships', provider: 'University of Otago', hostCountries: ['New Zealand'], region: ['Asia Pacific'], fields: ['All Fields'], degreeLevel: ['Masters', 'PhD'], fundingType: ['Fully Funded'], officialLink: 'https://www.otago.ac.nz/' },
  { name: 'Victoria University of Wellington Scholarships', provider: 'Victoria University of Wellington', hostCountries: ['New Zealand'], region: ['Asia Pacific'], fields: ['All Fields'], degreeLevel: ['Masters', 'PhD'], fundingType: ['Fully Funded'], officialLink: 'https://www.wgtn.ac.nz/' },
  // 中东/非洲更多
  { name: 'American University of Sharjah Scholarships', provider: 'American University of Sharjah', hostCountries: ['UAE'], region: ['Middle East'], fields: ['All Fields'], degreeLevel: ['Bachelor', 'Masters'], fundingType: ['Fully Funded', 'Partial Funding'], officialLink: 'https://www.aus.edu/' },
  { name: 'University of Sharjah Scholarships', provider: 'University of Sharjah', hostCountries: ['UAE'], region: ['Middle East'], fields: ['All Fields'], degreeLevel: ['Masters', 'PhD'], fundingType: ['Fully Funded'], officialLink: 'https://www.sharjah.ac.ae/' },
  { name: 'Stellenbosch University Scholarships', provider: 'Stellenbosch University', hostCountries: ['South Africa'], region: ['Africa'], fields: ['All Fields'], degreeLevel: ['Masters', 'PhD'], fundingType: ['Fully Funded'], officialLink: 'https://www.sun.ac.za/' },
  { name: 'University of Pretoria Scholarships', provider: 'University of Pretoria', hostCountries: ['South Africa'], region: ['Africa'], fields: ['All Fields'], degreeLevel: ['Masters', 'PhD'], fundingType: ['Fully Funded'], officialLink: 'https://www.up.ac.za/' },
  { name: 'University of Ghana Scholarships', provider: 'University of Ghana', hostCountries: ['Ghana'], region: ['Africa'], fields: ['All Fields'], degreeLevel: ['Masters', 'PhD'], fundingType: ['Fully Funded'], officialLink: 'https://www.ug.edu.gh/' },
  { name: 'University of Nairobi Scholarships', provider: 'University of Nairobi', hostCountries: ['Kenya'], region: ['Africa'], fields: ['All Fields'], degreeLevel: ['Masters', 'PhD'], fundingType: ['Fully Funded'], officialLink: 'https://www.uonbi.ac.ke/' },
  { name: 'Makerere University Scholarships', provider: 'Makerere University', hostCountries: ['Uganda'], region: ['Africa'], fields: ['All Fields'], degreeLevel: ['Masters', 'PhD'], fundingType: ['Fully Funded'], officialLink: 'https://www.mak.ac.ug/' },
  // 拉丁美洲更多
  { name: 'University of Chile Scholarships', provider: 'University of Chile', hostCountries: ['Chile'], region: ['Latin America'], fields: ['All Fields'], degreeLevel: ['Masters', 'PhD'], fundingType: ['Fully Funded'], officialLink: 'https://www.uchile.cl/' },
  { name: 'Pontifical Catholic University of Chile Scholarships', provider: 'Pontifical Catholic University of Chile', hostCountries: ['Chile'], region: ['Latin America'], fields: ['All Fields'], degreeLevel: ['Masters', 'PhD'], fundingType: ['Fully Funded'], officialLink: 'https://www.uc.cl/' },
  { name: 'University of the Andes Scholarships', provider: 'University of the Andes', hostCountries: ['Colombia'], region: ['Latin America'], fields: ['All Fields'], degreeLevel: ['Masters', 'PhD'], fundingType: ['Fully Funded'], officialLink: 'https://uniandes.edu.co/' },
  { name: 'National Autonomous University of Mexico Scholarships', provider: 'UNAM', hostCountries: ['Mexico'], region: ['Latin America'], fields: ['All Fields'], degreeLevel: ['Masters', 'PhD'], fundingType: ['Fully Funded'], officialLink: 'https://www.unam.mx/' },
  // 特殊项目
  { name: 'Joint Master in Digital Health', provider: 'EIT Health', hostCountries: ['Multiple Countries'], region: ['Europe'], fields: ['Health Sciences', 'Digital Technology'], degreeLevel: ['Masters'], fundingType: ['Fully Funded'], officialLink: 'https://eithealth.eu/' },
  { name: 'IMRD Erasmus Mundus Scholarship', provider: 'European Union', hostCountries: ['Multiple Countries'], region: ['Europe'], fields: ['Rural Development', 'Agriculture'], degreeLevel: ['Masters'], fundingType: ['Fully Funded'], officialLink: 'https://www.imrd.ugent.be/' },
  { name: 'EUROSUD Erasmus Mundus Scholarship', provider: 'European Union', hostCountries: ['Multiple Countries'], region: ['Europe'], fields: ['South European Studies', 'International Relations'], degreeLevel: ['Masters'], fundingType: ['Fully Funded'], officialLink: 'https://www.gla.ac.uk/postgraduate/erasmusmundus/eurosud/' },
  { name: 'LAGLOBE Erasmus Mundus Scholarship', provider: 'European Union', hostCountries: ['Multiple Countries'], region: ['Latin America', 'Europe'], fields: ['Global Studies', 'Political Science'], degreeLevel: ['Masters'], fundingType: ['Fully Funded'], officialLink: 'https://www.laglobe.eu/' },
  { name: 'NOHA Erasmus Mundus Scholarship', provider: 'European Union', hostCountries: ['Multiple Countries'], region: ['Europe'], fields: ['Humanitarian Action', 'International Development'], degreeLevel: ['Masters'], fundingType: ['Fully Funded'], officialLink: 'https://www.nohanet.org/' }
];

async function seed() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');
    const db = mongoose.connection.db;
    const collection = db.collection('scholarships');
    
    let inserted = 0;
    let skipped = 0;
    
    for (const template of uniqueTemplates) {
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