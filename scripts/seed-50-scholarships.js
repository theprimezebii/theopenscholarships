// scripts/seed-50-scholarships.js
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

// 预定义的图片池 (已验证可用的 Unsplash 教育/校园图片)
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

// 生成截止日期提示 ("Early Jan", "Mid Mar", etc.)
function generateDeadline() {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const month = months[Math.floor(Math.random() * months.length)];
  const type = Math.random();
  let day;
  if (type < 0.33) day = 5;
  else if (type < 0.66) day = 15;
  else day = 25;
  // 映射到 2026 年的实际日期（仅用于内部排序，前端会显示提示文本）
  const monthIndex = months.indexOf(month);
  return new Date(2026, monthIndex, day);
}

// 根据截止日期计算状态
function calculateStatus(deadline) {
  const today = new Date();
  const daysUntil = Math.ceil((deadline - today) / (1000 * 60 * 60 * 24));
  if (deadline < today) return 'closed';
  if (daysUntil <= 14) return 'closing-soon';
  if (deadline.getFullYear() > today.getFullYear() + 1) return 'coming-soon';
  return 'open';
}

// 生成默认的常见问题
function generateFaqs() {
  return [
    { question: 'Is this scholarship fully funded?', answer: 'Yes, it covers tuition, living expenses, travel, and health insurance.' },
    { question: 'Can I apply if I am still completing my degree?', answer: 'Final-year students may apply with proof of enrollment and expected graduation.' },
    { question: 'Is there an application fee?', answer: 'No, there is no fee to apply for this scholarship.' }
  ];
}

// 生成默认的福利列表
function generateBenefits() {
  return [
    'Full tuition fee coverage',
    'Monthly living stipend',
    'Health insurance',
    'Round-trip airfare',
    'Research and conference allowances'
  ];
}

// 生成默认的资格要求
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

// 生成默认的申请步骤
function generateHowToApply() {
  return [
    'Complete the online application form',
    'Upload academic transcripts and degree certificates',
    'Submit two letters of recommendation',
    'Write a statement of purpose',
    'Attend an interview if shortlisted'
  ];
}

// 生成默认的必要文件
function generateRequiredDocuments() {
  return [
    'Academic transcripts',
    'Curriculum Vitae',
    'Statement of purpose',
    'Two letters of recommendation',
    'Proof of English proficiency'
  ];
}

// 50 个真实且搜索量高的奖学金模板
const scholarshipTemplates = [
  // 英国
  { name: 'Chevening Scholarship', provider: 'UK Foreign, Commonwealth and Development Office', hostCountries: ['United Kingdom'], region: ['Europe'], fields: ['All Fields'], degreeLevel: ['Masters'], fundingType: ['Fully Funded'], officialLink: 'https://www.chevening.org/scholarships/' },
  { name: 'Commonwealth Shared Scholarship', provider: 'Commonwealth Scholarship Commission', hostCountries: ['United Kingdom'], region: ['Europe'], fields: ['Development Studies', 'Public Health', 'Education', 'Engineering'], degreeLevel: ['Masters'], fundingType: ['Fully Funded'], officialLink: 'https://cscuk.fcdo.gov.uk/' },
  { name: 'Gates Cambridge Scholarship', provider: 'Bill and Melinda Gates Foundation', hostCountries: ['United Kingdom'], region: ['Europe'], fields: ['All Fields'], degreeLevel: ['Masters', 'PhD'], fundingType: ['Fully Funded'], officialLink: 'https://www.gatescambridge.org/' },
  { name: 'Rhodes Scholarship', provider: 'Rhodes Trust', hostCountries: ['United Kingdom'], region: ['Europe'], fields: ['All Fields'], degreeLevel: ['Masters', 'PhD'], fundingType: ['Fully Funded'], officialLink: 'https://www.rhodeshouse.ox.ac.uk/' },
  { name: 'Clarendon Scholarship', provider: 'University of Oxford', hostCountries: ['United Kingdom'], region: ['Europe'], fields: ['All Fields'], degreeLevel: ['Masters', 'PhD'], fundingType: ['Fully Funded'], officialLink: 'https://www.ox.ac.uk/clarendon' },
  // 德国
  { name: 'DAAD Scholarship', provider: 'German Academic Exchange Service', hostCountries: ['Germany'], region: ['Europe'], fields: ['All Fields', 'Engineering', 'Sciences'], degreeLevel: ['Masters', 'PhD'], fundingType: ['Fully Funded'], officialLink: 'https://www.daad.de/en/' },
  { name: 'Heinrich Böll Foundation Scholarship', provider: 'Heinrich Böll Foundation', hostCountries: ['Germany'], region: ['Europe'], fields: ['All Fields'], degreeLevel: ['Masters', 'PhD'], fundingType: ['Fully Funded'], officialLink: 'https://www.boell.de/en/scholarships' },
  { name: 'Konrad-Adenauer-Stiftung Scholarship', provider: 'Konrad Adenauer Foundation', hostCountries: ['Germany'], region: ['Europe'], fields: ['All Fields'], degreeLevel: ['Masters', 'PhD'], fundingType: ['Fully Funded'], officialLink: 'https://www.kas.de/en/scholarships' },
  // 美国
  { name: 'Fulbright Foreign Student Program', provider: 'US Department of State', hostCountries: ['United States'], region: ['North America'], fields: ['All Fields'], degreeLevel: ['Masters', 'PhD'], fundingType: ['Fully Funded'], officialLink: 'https://foreign.fulbrightonline.org/' },
  { name: 'Knight-Hennessy Scholars', provider: 'Stanford University', hostCountries: ['United States'], region: ['North America'], fields: ['All Fields'], degreeLevel: ['Masters', 'PhD'], fundingType: ['Fully Funded'], officialLink: 'https://knight-hennessy.stanford.edu/' },
  { name: 'Hubert H. Humphrey Fellowship', provider: 'US Department of State', hostCountries: ['United States'], region: ['North America'], fields: ['Public Policy', 'Education', 'Public Health'], degreeLevel: ['Non-degree'], fundingType: ['Fully Funded'], officialLink: 'https://www.humphreyfellowship.org/' },
  // 澳大利亚
  { name: 'Australia Awards Scholarship', provider: 'Australian Government', hostCountries: ['Australia'], region: ['Asia Pacific'], fields: ['Development Studies', 'Public Health', 'Education', 'Engineering'], degreeLevel: ['Masters'], fundingType: ['Fully Funded'], officialLink: 'https://www.dfat.gov.au/people-to-people/australia-awards' },
  { name: 'Endeavour Postgraduate Scholarship', provider: 'Australian Government', hostCountries: ['Australia'], region: ['Asia Pacific'], fields: ['All Fields'], degreeLevel: ['Masters', 'PhD'], fundingType: ['Fully Funded'], officialLink: 'https://www.education.gov.au/endeavour' },
  // 日本
  { name: 'MEXT Scholarship', provider: 'Japanese Government', hostCountries: ['Japan'], region: ['Asia Pacific'], fields: ['All Fields'], degreeLevel: ['Bachelor', 'Masters', 'PhD'], fundingType: ['Fully Funded'], officialLink: 'https://www.studyinjapan.go.jp/' },
  { name: 'ADB-Japan Scholarship Program', provider: 'Asian Development Bank', hostCountries: ['Japan', 'United States', 'United Kingdom', 'Australia', 'New Zealand'], region: ['Asia Pacific'], fields: ['Economics', 'Business', 'Engineering', 'Environmental Studies'], degreeLevel: ['Masters'], fundingType: ['Fully Funded'], officialLink: 'https://www.adb.org/' },
  { name: 'Joint Japan World Bank Graduate Scholarship', provider: 'World Bank Group', hostCountries: ['Japan', 'United States', 'United Kingdom', 'France', 'Netherlands'], region: ['Global'], fields: ['Economics', 'Public Policy', 'Development Studies'], degreeLevel: ['Masters'], fundingType: ['Fully Funded'], officialLink: 'https://www.worldbank.org/' },
  // 欧洲其他地区
  { name: 'Erasmus Mundus Joint Master Degree', provider: 'European Union', hostCountries: ['Multiple Countries'], region: ['Europe'], fields: ['All Fields'], degreeLevel: ['Masters'], fundingType: ['Fully Funded'], officialLink: 'https://erasmus-plus.ec.europa.eu/' },
  { name: 'Eiffel Excellence Scholarship', provider: 'French Ministry for Europe and Foreign Affairs', hostCountries: ['France'], region: ['Europe'], fields: ['Engineering', 'Economics', 'Law', 'Political Science'], degreeLevel: ['Masters', 'PhD'], fundingType: ['Fully Funded'], officialLink: 'https://www.campusfrance.org/' },
  { name: 'Swiss Government Excellence Scholarship', provider: 'Swiss Government', hostCountries: ['Switzerland'], region: ['Europe'], fields: ['All Fields'], degreeLevel: ['PhD', 'Postdoctoral'], fundingType: ['Fully Funded'], officialLink: 'https://www.sbfi.admin.ch/scholarships' },
  { name: 'Holland Scholarship', provider: 'Dutch Ministry of Education', hostCountries: ['Netherlands'], region: ['Europe'], fields: ['All Fields'], degreeLevel: ['Bachelor', 'Masters'], fundingType: ['Partial Funding'], officialLink: 'https://www.studyinnl.org/' },
  { name: 'Orange Tulip Scholarship', provider: 'Nuffic Neso', hostCountries: ['Netherlands'], region: ['Europe'], fields: ['All Fields'], degreeLevel: ['Masters'], fundingType: ['Partial Funding'], officialLink: 'https://www.studyinnl.org/' },
  { name: 'Swedish Institute Scholarships', provider: 'Swedish Institute', hostCountries: ['Sweden'], region: ['Europe'], fields: ['All Fields'], degreeLevel: ['Masters'], fundingType: ['Fully Funded'], officialLink: 'https://si.se/' },
  { name: 'Danish Government Scholarship', provider: 'Danish Ministry of Higher Education', hostCountries: ['Denmark'], region: ['Europe'], fields: ['All Fields'], degreeLevel: ['Masters'], fundingType: ['Partial Funding'], officialLink: 'https://studyindenmark.dk/' },
  { name: 'Finnish Government Scholarship', provider: 'Finnish National Agency for Education', hostCountries: ['Finland'], region: ['Europe'], fields: ['All Fields'], degreeLevel: ['Masters', 'PhD'], fundingType: ['Fully Funded'], officialLink: 'https://www.studyinfinland.fi/' },
  { name: 'Norwegian Quota Scheme', provider: 'Norwegian Government', hostCountries: ['Norway'], region: ['Europe'], fields: ['All Fields'], degreeLevel: ['Masters', 'PhD'], fundingType: ['Fully Funded'], officialLink: 'https://www.studyinnorway.no/' },
  { name: 'Belgian Government Scholarship', provider: 'ARES', hostCountries: ['Belgium'], region: ['Europe'], fields: ['Development Studies', 'Public Health'], degreeLevel: ['Masters'], fundingType: ['Fully Funded'], officialLink: 'https://www.ares-ac.be/' },
  { name: 'Austrian Government Scholarship', provider: 'OeAD', hostCountries: ['Austria'], region: ['Europe'], fields: ['All Fields'], degreeLevel: ['Masters', 'PhD'], fundingType: ['Fully Funded'], officialLink: 'https://oead.at/' },
  { name: 'Italian Government Scholarship', provider: 'Italian Ministry of Foreign Affairs', hostCountries: ['Italy'], region: ['Europe'], fields: ['All Fields'], degreeLevel: ['Masters', 'PhD'], fundingType: ['Fully Funded'], officialLink: 'https://www.esteri.it/' },
  { name: 'Spanish Government Scholarship', provider: 'MAEC-AECID', hostCountries: ['Spain'], region: ['Europe'], fields: ['All Fields'], degreeLevel: ['Masters', 'PhD'], fundingType: ['Fully Funded'], officialLink: 'https://www.aecid.es/' },
  // 加拿大
  { name: 'Vanier Canada Graduate Scholarship', provider: 'Government of Canada', hostCountries: ['Canada'], region: ['North America'], fields: ['Health Sciences', 'Natural Sciences', 'Engineering', 'Social Sciences'], degreeLevel: ['PhD'], fundingType: ['Fully Funded'], officialLink: 'https://vanier.gc.ca/' },
  { name: 'Banting Postdoctoral Fellowships', provider: 'Government of Canada', hostCountries: ['Canada'], region: ['North America'], fields: ['Health Sciences', 'Natural Sciences', 'Engineering', 'Social Sciences'], degreeLevel: ['Postdoctoral'], fundingType: ['Fully Funded'], officialLink: 'https://banting.fellowships-bourses.gc.ca/' },
  // 新西兰
  { name: 'New Zealand Government Scholarship', provider: 'New Zealand Ministry of Foreign Affairs and Trade', hostCountries: ['New Zealand'], region: ['Asia Pacific'], fields: ['Agriculture', 'Renewable Energy', 'Disaster Management'], degreeLevel: ['Masters', 'PhD'], fundingType: ['Fully Funded'], officialLink: 'https://www.mfat.govt.nz/' },
  // 爱尔兰
  { name: 'Ireland Government Scholarship (GOI-IES)', provider: 'Government of Ireland', hostCountries: ['Ireland'], region: ['Europe'], fields: ['All Fields'], degreeLevel: ['Masters', 'PhD'], fundingType: ['Fully Funded'], officialLink: 'https://www.gov.ie/' },
  // 土耳其
  { name: 'Turkiye Burslari Scholarship', provider: 'Government of Turkey', hostCountries: ['Turkey'], region: ['Middle East'], fields: ['All Fields'], degreeLevel: ['Bachelor', 'Masters', 'PhD'], fundingType: ['Fully Funded'], officialLink: 'https://www.turkiyeburslari.gov.tr/' },
  // 沙特阿拉伯
  { name: 'KAUST Scholarship', provider: 'King Abdullah University of Science and Technology', hostCountries: ['Saudi Arabia'], region: ['Middle East'], fields: ['Engineering', 'Computer Science', 'Natural Sciences'], degreeLevel: ['Masters', 'PhD'], fundingType: ['Fully Funded'], officialLink: 'https://www.kaust.edu.sa/' },
  // 中国
  { name: 'Chinese Government Scholarship', provider: 'China Scholarship Council', hostCountries: ['China'], region: ['Asia Pacific'], fields: ['All Fields'], degreeLevel: ['Bachelor', 'Masters', 'PhD'], fundingType: ['Fully Funded'], officialLink: 'https://www.campuschina.org/' },
  // 韩国
  { name: 'Korean Government Scholarship', provider: 'National Institute for International Education', hostCountries: ['South Korea'], region: ['Asia Pacific'], fields: ['All Fields'], degreeLevel: ['Bachelor', 'Masters', 'PhD'], fundingType: ['Fully Funded'], officialLink: 'https://www.studyinkorea.go.kr/' },
  // 新加坡
  { name: 'Singapore International Graduate Award', provider: 'A*STAR', hostCountries: ['Singapore'], region: ['Asia Pacific'], fields: ['Biomedical Sciences', 'Physical Sciences', 'Engineering'], degreeLevel: ['PhD'], fundingType: ['Fully Funded'], officialLink: 'https://www.a-star.edu.sg/' },
  // 马来西亚
  { name: 'Malaysia International Scholarship', provider: 'Malaysian Government', hostCountries: ['Malaysia'], region: ['Asia Pacific'], fields: ['All Fields'], degreeLevel: ['Masters', 'PhD'], fundingType: ['Fully Funded'], officialLink: 'https://biasiswa.moe.gov.my/' },
  // 泰国
  { name: 'Thailand International Postgraduate Programme', provider: 'Thailand International Cooperation Agency', hostCountries: ['Thailand'], region: ['Asia Pacific'], fields: ['Development Studies', 'Public Health', 'Agriculture'], degreeLevel: ['Masters', 'PhD'], fundingType: ['Fully Funded'], officialLink: 'https://tica-thaigov.mfa.go.th/' },
  // 印度尼西亚
  { name: 'Indonesian Government Scholarship', provider: 'Ministry of Education and Culture', hostCountries: ['Indonesia'], region: ['Asia Pacific'], fields: ['All Fields'], degreeLevel: ['Masters', 'PhD'], fundingType: ['Fully Funded'], officialLink: 'https://beasiswa.kemdikbud.go.id/' },
  // 印度
  { name: 'Indian Government Scholarship', provider: 'Indian Council for Cultural Relations', hostCountries: ['India'], region: ['Asia Pacific'], fields: ['All Fields'], degreeLevel: ['Bachelor', 'Masters', 'PhD'], fundingType: ['Fully Funded'], officialLink: 'https://www.iccr.gov.in/' },
  // 巴基斯坦
  { name: 'Pakistan Government Scholarship', provider: 'Higher Education Commission', hostCountries: ['Pakistan'], region: ['Asia Pacific'], fields: ['All Fields'], degreeLevel: ['Masters', 'PhD'], fundingType: ['Fully Funded'], officialLink: 'https://www.hec.gov.pk/' },
  // 南非
  { name: 'South African Government Scholarship', provider: 'Department of Higher Education and Training', hostCountries: ['South Africa'], region: ['Africa'], fields: ['All Fields'], degreeLevel: ['Masters', 'PhD'], fundingType: ['Fully Funded'], officialLink: 'https://www.dhet.gov.za/' },
  // 尼日利亚
  { name: 'Nigerian Government Scholarship', provider: 'Federal Ministry of Education', hostCountries: ['Nigeria'], region: ['Africa'], fields: ['All Fields'], degreeLevel: ['Masters', 'PhD'], fundingType: ['Fully Funded'], officialLink: 'https://education.gov.ng/' },
  // 埃及
  { name: 'Egyptian Government Scholarship', provider: 'Ministry of Higher Education', hostCountries: ['Egypt'], region: ['Middle East'], fields: ['All Fields'], degreeLevel: ['Masters', 'PhD'], fundingType: ['Fully Funded'], officialLink: 'http://portal.mohesr.gov.eg/' },
  // 巴西
  { name: 'Brazilian Government Scholarship', provider: 'CAPES', hostCountries: ['Brazil'], region: ['Latin America'], fields: ['All Fields'], degreeLevel: ['Masters', 'PhD'], fundingType: ['Fully Funded'], officialLink: 'https://www.capes.gov.br/' },
  // 墨西哥
  { name: 'Mexican Government Scholarship', provider: 'AMEXCID', hostCountries: ['Mexico'], region: ['Latin America'], fields: ['All Fields'], degreeLevel: ['Masters', 'PhD'], fundingType: ['Fully Funded'], officialLink: 'https://www.gob.mx/amexcid' },
  // 智利
  { name: 'Chilean Government Scholarship', provider: 'ANID', hostCountries: ['Chile'], region: ['Latin America'], fields: ['All Fields'], degreeLevel: ['Masters', 'PhD'], fundingType: ['Fully Funded'], officialLink: 'https://www.anid.cl/' },
  // 阿根廷
  { name: 'Argentinian Government Scholarship', provider: 'Ministry of Education', hostCountries: ['Argentina'], region: ['Latin America'], fields: ['All Fields'], degreeLevel: ['Masters', 'PhD'], fundingType: ['Fully Funded'], officialLink: 'https://www.argentina.gob.ar/educacion' },
  // 阿联酋
  { name: 'UAE Government Scholarship', provider: 'Ministry of Education', hostCountries: ['UAE'], region: ['Middle East'], fields: ['All Fields'], degreeLevel: ['Masters', 'PhD'], fundingType: ['Fully Funded'], officialLink: 'https://www.moe.gov.ae/' },
  // 沙特 (第二个)
  { name: 'Saudi Government Scholarship', provider: 'Ministry of Education', hostCountries: ['Saudi Arabia'], region: ['Middle East'], fields: ['All Fields'], degreeLevel: ['Masters', 'PhD'], fundingType: ['Fully Funded'], officialLink: 'https://www.moe.gov.sa/' }
];

async function seed() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');
    const db = mongoose.connection.db;
    const collection = db.collection('scholarships');
    
    let inserted = 0;
    let skipped = 0;
    
    for (const template of scholarshipTemplates) {
      // 检查是否已存在（通过slug）
      let slug = slugify(template.name);
      const existing = await collection.findOne({ slug });
      if (existing) {
        console.log(`Skipping existing: ${template.name}`);
        skipped++;
        continue;
      }
      
      // 确保slug唯一
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