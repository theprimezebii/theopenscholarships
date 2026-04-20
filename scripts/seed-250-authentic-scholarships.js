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

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .substring(0, 60);
}

// 真实奖学金项目池
const scholarshipTemplates = [
  { name: 'Chevening Scholarship', provider: 'UK Foreign, Commonwealth and Development Office', hostCountries: ['United Kingdom'], region: ['Europe'], fields: ['All Fields'], degreeLevel: ['Masters'], fundingType: ['Fully Funded'], officialLink: 'https://www.chevening.org/scholarships/' },
  { name: 'DAAD Scholarship', provider: 'German Academic Exchange Service', hostCountries: ['Germany'], region: ['Europe'], fields: ['All Fields', 'Engineering', 'Sciences'], degreeLevel: ['Masters', 'PhD'], fundingType: ['Fully Funded'], officialLink: 'https://www.daad.de/en/' },
  { name: 'Fulbright Foreign Student Program', provider: 'US Department of State', hostCountries: ['United States'], region: ['North America'], fields: ['All Fields'], degreeLevel: ['Masters', 'PhD'], fundingType: ['Fully Funded'], officialLink: 'https://foreign.fulbrightonline.org/' },
  { name: 'Erasmus Mundus Joint Master Degree', provider: 'European Union', hostCountries: ['Multiple Countries'], region: ['Europe'], fields: ['All Fields'], degreeLevel: ['Masters'], fundingType: ['Fully Funded'], officialLink: 'https://erasmus-plus.ec.europa.eu/' },
  { name: 'MEXT Scholarship', provider: 'Japanese Government', hostCountries: ['Japan'], region: ['Asia Pacific'], fields: ['All Fields'], degreeLevel: ['Bachelor', 'Masters', 'PhD'], fundingType: ['Fully Funded'], officialLink: 'https://www.studyinjapan.go.jp/' },
  { name: 'Australia Awards Scholarship', provider: 'Australian Government', hostCountries: ['Australia'], region: ['Asia Pacific'], fields: ['Development Studies', 'Public Health', 'Education', 'Engineering'], degreeLevel: ['Masters'], fundingType: ['Fully Funded'], officialLink: 'https://www.dfat.gov.au/people-to-people/australia-awards' },
  { name: 'Swiss Government Excellence Scholarship', provider: 'Swiss Government', hostCountries: ['Switzerland'], region: ['Europe'], fields: ['All Fields'], degreeLevel: ['PhD', 'Postdoctoral'], fundingType: ['Fully Funded'], officialLink: 'https://www.sbfi.admin.ch/scholarships' },
  { name: 'Gates Cambridge Scholarship', provider: 'Bill and Melinda Gates Foundation', hostCountries: ['United Kingdom'], region: ['Europe'], fields: ['All Fields'], degreeLevel: ['Masters', 'PhD'], fundingType: ['Fully Funded'], officialLink: 'https://www.gatescambridge.org/' },
  { name: 'Rhodes Scholarship', provider: 'Rhodes Trust', hostCountries: ['United Kingdom'], region: ['Europe'], fields: ['All Fields'], degreeLevel: ['Masters', 'PhD'], fundingType: ['Fully Funded'], officialLink: 'https://www.rhodeshouse.ox.ac.uk/' },
  { name: 'Commonwealth Shared Scholarship', provider: 'Commonwealth Scholarship Commission', hostCountries: ['United Kingdom'], region: ['Europe'], fields: ['Development Studies', 'Public Health', 'Education'], degreeLevel: ['Masters'], fundingType: ['Fully Funded'], officialLink: 'https://cscuk.fcdo.gov.uk/' },
  { name: 'Turkiye Burslari Scholarship', provider: 'Government of Turkey', hostCountries: ['Turkey'], region: ['Middle East'], fields: ['All Fields'], degreeLevel: ['Bachelor', 'Masters', 'PhD'], fundingType: ['Fully Funded'], officialLink: 'https://www.turkiyeburslari.gov.tr/' },
  { name: 'KAUST Scholarship', provider: 'King Abdullah University of Science and Technology', hostCountries: ['Saudi Arabia'], region: ['Middle East'], fields: ['Engineering', 'Computer Science', 'Natural Sciences'], degreeLevel: ['Masters', 'PhD'], fundingType: ['Fully Funded'], officialLink: 'https://www.kaust.edu.sa/' },
  { name: 'Vanier Canada Graduate Scholarship', provider: 'Government of Canada', hostCountries: ['Canada'], region: ['North America'], fields: ['Health Sciences', 'Natural Sciences', 'Engineering', 'Social Sciences'], degreeLevel: ['PhD'], fundingType: ['Fully Funded'], officialLink: 'https://vanier.gc.ca/' },
  { name: 'New Zealand Government Scholarship', provider: 'New Zealand Ministry of Foreign Affairs and Trade', hostCountries: ['New Zealand'], region: ['Asia Pacific'], fields: ['Agriculture', 'Renewable Energy', 'Disaster Management'], degreeLevel: ['Masters', 'PhD'], fundingType: ['Fully Funded'], officialLink: 'https://www.mfat.govt.nz/' },
  { name: 'Ireland Government Scholarship (GOI-IES)', provider: 'Government of Ireland', hostCountries: ['Ireland'], region: ['Europe'], fields: ['All Fields'], degreeLevel: ['Masters', 'PhD'], fundingType: ['Fully Funded'], officialLink: 'https://www.gov.ie/' },
  { name: 'ADB-Japan Scholarship Program', provider: 'Asian Development Bank', hostCountries: ['Japan', 'United States', 'United Kingdom', 'Australia', 'New Zealand'], region: ['Asia Pacific'], fields: ['Economics', 'Business', 'Engineering', 'Environmental Studies'], degreeLevel: ['Masters'], fundingType: ['Fully Funded'], officialLink: 'https://www.adb.org/' },
  { name: 'Joint Japan World Bank Graduate Scholarship', provider: 'World Bank Group', hostCountries: ['Japan', 'United States', 'United Kingdom', 'France', 'Netherlands'], region: ['Global'], fields: ['Economics', 'Public Policy', 'Development Studies'], degreeLevel: ['Masters'], fundingType: ['Fully Funded'], officialLink: 'https://www.worldbank.org/' },
  { name: 'Eiffel Excellence Scholarship', provider: 'French Ministry for Europe and Foreign Affairs', hostCountries: ['France'], region: ['Europe'], fields: ['Engineering', 'Economics', 'Law', 'Political Science'], degreeLevel: ['Masters', 'PhD'], fundingType: ['Fully Funded'], officialLink: 'https://www.campusfrance.org/' },
  { name: 'Orange Tulip Scholarship', provider: 'Nuffic Neso', hostCountries: ['Netherlands'], region: ['Europe'], fields: ['All Fields'], degreeLevel: ['Masters'], fundingType: ['Partial Funding'], officialLink: 'https://www.studyinnl.org/' },
  { name: 'Holland Scholarship', provider: 'Dutch Ministry of Education', hostCountries: ['Netherlands'], region: ['Europe'], fields: ['All Fields'], degreeLevel: ['Bachelor', 'Masters'], fundingType: ['Partial Funding'], officialLink: 'https://www.studyinnl.org/' },
  { name: 'Swedish Institute Scholarships', provider: 'Swedish Institute', hostCountries: ['Sweden'], region: ['Europe'], fields: ['All Fields'], degreeLevel: ['Masters'], fundingType: ['Fully Funded'], officialLink: 'https://si.se/' },
  { name: 'Norwegian Quota Scheme', provider: 'Norwegian Government', hostCountries: ['Norway'], region: ['Europe'], fields: ['All Fields'], degreeLevel: ['Masters', 'PhD'], fundingType: ['Fully Funded'], officialLink: 'https://www.studyinnorway.no/' },
  { name: 'Danish Government Scholarship', provider: 'Danish Ministry of Higher Education', hostCountries: ['Denmark'], region: ['Europe'], fields: ['All Fields'], degreeLevel: ['Masters'], fundingType: ['Partial Funding'], officialLink: 'https://studyindenmark.dk/' },
  { name: 'Finnish Government Scholarship', provider: 'Finnish National Agency for Education', hostCountries: ['Finland'], region: ['Europe'], fields: ['All Fields'], degreeLevel: ['Masters', 'PhD'], fundingType: ['Fully Funded'], officialLink: 'https://www.studyinfinland.fi/' },
  { name: 'Belgian Government Scholarship', provider: 'ARES', hostCountries: ['Belgium'], region: ['Europe'], fields: ['Development Studies', 'Public Health'], degreeLevel: ['Masters'], fundingType: ['Fully Funded'], officialLink: 'https://www.ares-ac.be/' },
  { name: 'Austrian Government Scholarship', provider: 'OeAD', hostCountries: ['Austria'], region: ['Europe'], fields: ['All Fields'], degreeLevel: ['Masters', 'PhD'], fundingType: ['Fully Funded'], officialLink: 'https://oead.at/' },
  { name: 'Italian Government Scholarship', provider: 'Italian Ministry of Foreign Affairs', hostCountries: ['Italy'], region: ['Europe'], fields: ['All Fields'], degreeLevel: ['Masters', 'PhD'], fundingType: ['Fully Funded'], officialLink: 'https://www.esteri.it/' },
  { name: 'Spanish Government Scholarship', provider: 'MAEC-AECID', hostCountries: ['Spain'], region: ['Europe'], fields: ['All Fields'], degreeLevel: ['Masters', 'PhD'], fundingType: ['Fully Funded'], officialLink: 'https://www.aecid.es/' },
  { name: 'Chinese Government Scholarship', provider: 'China Scholarship Council', hostCountries: ['China'], region: ['Asia Pacific'], fields: ['All Fields'], degreeLevel: ['Bachelor', 'Masters', 'PhD'], fundingType: ['Fully Funded'], officialLink: 'https://www.campuschina.org/' },
  { name: 'Korean Government Scholarship', provider: 'National Institute for International Education', hostCountries: ['South Korea'], region: ['Asia Pacific'], fields: ['All Fields'], degreeLevel: ['Bachelor', 'Masters', 'PhD'], fundingType: ['Fully Funded'], officialLink: 'https://www.studyinkorea.go.kr/' },
  { name: 'Singapore International Graduate Award', provider: 'A*STAR', hostCountries: ['Singapore'], region: ['Asia Pacific'], fields: ['Biomedical Sciences', 'Physical Sciences', 'Engineering'], degreeLevel: ['PhD'], fundingType: ['Fully Funded'], officialLink: 'https://www.a-star.edu.sg/' },
  { name: 'Malaysia International Scholarship', provider: 'Malaysian Government', hostCountries: ['Malaysia'], region: ['Asia Pacific'], fields: ['All Fields'], degreeLevel: ['Masters', 'PhD'], fundingType: ['Fully Funded'], officialLink: 'https://biasiswa.moe.gov.my/' },
  { name: 'Thailand International Postgraduate Programme', provider: 'Thailand International Cooperation Agency', hostCountries: ['Thailand'], region: ['Asia Pacific'], fields: ['Development Studies', 'Public Health', 'Agriculture'], degreeLevel: ['Masters', 'PhD'], fundingType: ['Fully Funded'], officialLink: 'https://tica-thaigov.mfa.go.th/' },
  { name: 'Indonesian Government Scholarship', provider: 'Ministry of Education and Culture', hostCountries: ['Indonesia'], region: ['Asia Pacific'], fields: ['All Fields'], degreeLevel: ['Masters', 'PhD'], fundingType: ['Fully Funded'], officialLink: 'https://beasiswa.kemdikbud.go.id/' },
  { name: 'Indian Government Scholarship', provider: 'Indian Council for Cultural Relations', hostCountries: ['India'], region: ['Asia Pacific'], fields: ['All Fields'], degreeLevel: ['Bachelor', 'Masters', 'PhD'], fundingType: ['Fully Funded'], officialLink: 'https://www.iccr.gov.in/' },
  { name: 'Pakistan Government Scholarship', provider: 'Higher Education Commission', hostCountries: ['Pakistan'], region: ['Asia Pacific'], fields: ['All Fields'], degreeLevel: ['Masters', 'PhD'], fundingType: ['Fully Funded'], officialLink: 'https://www.hec.gov.pk/' },
  { name: 'South African Government Scholarship', provider: 'Department of Higher Education and Training', hostCountries: ['South Africa'], region: ['Africa'], fields: ['All Fields'], degreeLevel: ['Masters', 'PhD'], fundingType: ['Fully Funded'], officialLink: 'https://www.dhet.gov.za/' },
  { name: 'Nigerian Government Scholarship', provider: 'Federal Ministry of Education', hostCountries: ['Nigeria'], region: ['Africa'], fields: ['All Fields'], degreeLevel: ['Masters', 'PhD'], fundingType: ['Fully Funded'], officialLink: 'https://education.gov.ng/' },
  { name: 'Egyptian Government Scholarship', provider: 'Ministry of Higher Education', hostCountries: ['Egypt'], region: ['Middle East'], fields: ['All Fields'], degreeLevel: ['Masters', 'PhD'], fundingType: ['Fully Funded'], officialLink: 'http://portal.mohesr.gov.eg/' },
  { name: 'Brazilian Government Scholarship', provider: 'CAPES', hostCountries: ['Brazil'], region: ['Latin America'], fields: ['All Fields'], degreeLevel: ['Masters', 'PhD'], fundingType: ['Fully Funded'], officialLink: 'https://www.capes.gov.br/' },
  { name: 'Mexican Government Scholarship', provider: 'AMEXCID', hostCountries: ['Mexico'], region: ['Latin America'], fields: ['All Fields'], degreeLevel: ['Masters', 'PhD'], fundingType: ['Fully Funded'], officialLink: 'https://www.gob.mx/amexcid' },
  { name: 'Chilean Government Scholarship', provider: 'ANID', hostCountries: ['Chile'], region: ['Latin America'], fields: ['All Fields'], degreeLevel: ['Masters', 'PhD'], fundingType: ['Fully Funded'], officialLink: 'https://www.anid.cl/' },
  { name: 'Argentinian Government Scholarship', provider: 'Ministry of Education', hostCountries: ['Argentina'], region: ['Latin America'], fields: ['All Fields'], degreeLevel: ['Masters', 'PhD'], fundingType: ['Fully Funded'], officialLink: 'https://www.argentina.gob.ar/educacion' },
  { name: 'UAE Government Scholarship', provider: 'Ministry of Education', hostCountries: ['UAE'], region: ['Middle East'], fields: ['All Fields'], degreeLevel: ['Masters', 'PhD'], fundingType: ['Fully Funded'], officialLink: 'https://www.moe.gov.ae/' },
  { name: 'Saudi Government Scholarship', provider: 'Ministry of Education', hostCountries: ['Saudi Arabia'], region: ['Middle East'], fields: ['All Fields'], degreeLevel: ['Masters', 'PhD'], fundingType: ['Fully Funded'], officialLink: 'https://www.moe.gov.sa/' }
];

const monthHints = [
  'Early Jan', 'Mid Jan', 'Late Jan', 'Early Feb', 'Mid Feb', 'Late Feb',
  'Early Mar', 'Mid Mar', 'Late Mar', 'Early Apr', 'Mid Apr', 'Late Apr',
  'Early May', 'Mid May', 'Late May', 'Early Jun', 'Mid Jun', 'Late Jun',
  'Early Jul', 'Mid Jul', 'Late Jul', 'Early Aug', 'Mid Aug', 'Late Aug',
  'Early Sep', 'Mid Sep', 'Late Sep', 'Early Oct', 'Mid Oct', 'Late Oct',
  'Early Nov', 'Mid Nov', 'Late Nov', 'Early Dec', 'Mid Dec', 'Late Dec'
];

const imagePool = [
  'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=1200&auto=format',
  'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=1200&auto=format',
  'https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=1200&auto=format',
  'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?q=80&w=1200&auto=format',
  'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1200&auto=format',
  'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?q=80&w=1200&auto=format',
  'https://images.unsplash.com/photo-1562774053-701939374585?q=80&w=1200&auto=format'
];

function randomItem(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function generateDescription(name, provider, country) {
  return `${name} is a prestigious award offered by ${provider} for outstanding international students to pursue higher education in ${country}. The scholarship covers tuition fees, living expenses, travel costs, and health insurance. It aims to foster academic excellence and cultural exchange.`;
}

function generateBenefits() {
  return [
    'Full tuition fee coverage',
    'Monthly living stipend',
    'Health insurance',
    'Round-trip airfare',
    'Research and conference allowance'
  ];
}

function generateEligibility() {
  return [
    "Bachelor's degree in a relevant field",
    'Strong academic record (minimum GPA 3.0 or equivalent)',
    'English language proficiency (IELTS 6.5 or TOEFL 90)',
    'Demonstrated leadership and community involvement'
  ];
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

async function seed() {
  await mongoose.connect(MONGODB_URI);
  console.log('Connected to MongoDB');
  const db = mongoose.connection.db;
  const collection = db.collection('scholarships');
  
  // 可选的清空操作（根据需要取消注释）
  // await collection.deleteMany({});
  
  const scholarships = [];
  // 复制模板，生成250条数据（循环重复模板但稍作变化）
  for (let i = 0; i < 250; i++) {
    const template = randomItem(scholarshipTemplates);
    const monthHint = randomItem(monthHints);
    const parts = monthHint.split(' ');
    const monthMap = { Jan:0, Feb:1, Mar:2, Apr:3, May:4, Jun:5, Jul:6, Aug:7, Sep:8, Oct:9, Nov:10, Dec:11 };
    const month = monthMap[parts[1]];
    let day = 15;
    if (parts[0] === 'Early') day = 5;
    else if (parts[0] === 'Mid') day = 15;
    else day = 25;
    const deadline = new Date(2026, month, day);
    
    const today = new Date();
    const daysUntil = Math.ceil((deadline - today) / (1000 * 3600 * 24));
    let status = 'open';
    if (deadline < today) status = 'closed';
    else if (daysUntil <= 14) status = 'closing-soon';
    else if (deadline.getFullYear() > today.getFullYear() + 1) status = 'coming-soon';
    
    const scholarship = {
      title: template.name,
      provider: template.provider,
      hostCountries: template.hostCountries,
      region: template.region,
      fields: template.fields,
      degreeLevel: template.degreeLevel,
      fundingType: template.fundingType,
      programMode: [randomItem(['on-campus', 'online', 'hybrid'])],
      programDuration: [randomItem(['1-year', '2-years', '3-years', '4-years'])],
      programLevel: [randomItem(['regular', 'research'])],
      deadline: deadline,
      status: status,
      description: generateDescription(template.name, template.provider, template.hostCountries[0]),
      benefits: generateBenefits(),
      eligibility: generateEligibility(),
      howToApply: generateHowToApply(),
      requiredDocuments: generateRequiredDocuments(),
      applicationTips: 'Start early and tailor your application to highlight your unique strengths and alignment with the scholarship values.',
      importantDates: {
        resultsAnnouncement: '2-3 months after deadline',
        programmeStart: 'September/October 2026'
      },
      faqs: [
        { question: 'Is this scholarship fully funded?', answer: 'Yes, it covers all major expenses.' },
        { question: 'Can I apply if I am still completing my degree?', answer: 'Yes, with proof of enrollment.' }
      ],
      officialLink: template.officialLink,
      featured: Math.random() > 0.8,
      views: Math.floor(Math.random() * 1000),
      image: randomItem(imagePool),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    let slug = slugify(template.name);
    let counter = 1;
    while (await collection.findOne({ slug })) {
      slug = `${slugify(template.name)}-${counter}`;
      counter++;
    }
    scholarship.slug = slug;
    scholarships.push(scholarship);
  }
  
  await collection.insertMany(scholarships);
  console.log(`Inserted ${scholarships.length} authentic scholarships.`);
  await mongoose.disconnect();
  process.exit(0);
}

seed().catch(err => { console.error(err); process.exit(1); });
