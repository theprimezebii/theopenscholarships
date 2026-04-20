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

// 辅助函数：生成 slug
function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .substring(0, 60);
}

// 基础数据池
const providers = [
  'UK Foreign, Commonwealth and Development Office',
  'German Academic Exchange Service (DAAD)',
  'US Department of State',
  'Japanese Government (MEXT)',
  'Australian Government',
  'European Union',
  'Swiss Government',
  'Stanford University',
  'University of Oxford',
  'Bill and Melinda Gates Foundation',
  'Asian Development Bank',
  'World Bank Group',
  'Government of Canada',
  'Government of France',
  'Government of Netherlands',
  'Government of Sweden',
  'Government of Norway',
  'Government of Ireland',
  'Government of New Zealand',
  'Rhodes Trust',
  'Commonwealth Scholarship Commission',
  'Chevening Secretariat',
  'Fulbright Commission',
  'Erasmus Mundus Consortium',
  'KAUST',
  'Turkiye Burslari',
  'China Scholarship Council',
  'Korea Government',
  'Italian Government',
  'Spanish Government'
];

const hostCountriesList = [
  ['United Kingdom'], ['Germany'], ['United States'], ['Japan'], ['Australia'],
  ['Canada'], ['France'], ['Netherlands'], ['Sweden'], ['Switzerland'],
  ['Italy'], ['Spain'], ['Norway'], ['Denmark'], ['Finland'],
  ['Belgium'], ['Austria'], ['Ireland'], ['New Zealand'], ['Singapore'],
  ['China'], ['South Korea'], ['Turkey'], ['Saudi Arabia'], ['UAE'],
  ['Multiple Countries']
];

const fieldsList = [
  ['All Fields'],
  ['Engineering', 'Technology'],
  ['Computer Science & IT', 'AI & Machine Learning'],
  ['Medicine & Health', 'Public Health'],
  ['Business & Management', 'Economics & Finance'],
  ['Social Sciences', 'Law', 'International Relations'],
  ['Humanities', 'Arts & Design'],
  ['Natural Sciences', 'Mathematics', 'Environmental Sciences'],
  ['Education & Training'],
  ['Development Studies', 'Public Policy'],
  ['Agriculture', 'Renewable Energy']
];

const degreeLevels = [
  ['Bachelor'], ['Masters'], ['PhD'], ['Bachelor', 'Masters'], ['Masters', 'PhD'], ['All Levels']
];

const fundingTypes = [
  ['Fully Funded'],
  ['Partial Funding'],
  ['Tuition Waiver'],
  ['Living Stipend'],
  ['Travel Grant'],
  ['Fully Funded', 'Tuition Waiver', 'Living Stipend']
];

const programModes = [
  ['on-campus'], ['online'], ['hybrid'], ['on-campus', 'full-time'], ['part-time']
];

const programDurations = [
  ['1-year'], ['2-years'], ['3-years'], ['4-years'], ['1-year', '2-years']
];

const programLevels = [
  ['regular'], ['research'], ['executive'], ['regular', 'research']
];

const regions = [
  ['Europe'], ['North America'], ['Asia Pacific'], ['Middle East'], ['Africa'], ['Latin America'], ['Global']
];

// 截止月份提示（Early/Mid/Late + 月份）
const monthHints = [
  'Early Jan', 'Mid Jan', 'Late Jan',
  'Early Feb', 'Mid Feb', 'Late Feb',
  'Early Mar', 'Mid Mar', 'Late Mar',
  'Early Apr', 'Mid Apr', 'Late Apr',
  'Early May', 'Mid May', 'Late May',
  'Early Jun', 'Mid Jun', 'Late Jun',
  'Early Jul', 'Mid Jul', 'Late Jul',
  'Early Aug', 'Mid Aug', 'Late Aug',
  'Early Sep', 'Mid Sep', 'Late Sep',
  'Early Oct', 'Mid Oct', 'Late Oct',
  'Early Nov', 'Mid Nov', 'Late Nov',
  'Early Dec', 'Mid Dec', 'Late Dec'
];

// 图片 URL 池（教育、校园、毕业相关）
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

// 生成描述文本
function generateDescription(title, provider, country) {
  return `${title} offered by ${provider} provides an exceptional opportunity for students to study in ${country}. This prestigious award covers all major expenses and is designed for outstanding candidates demonstrating academic excellence and leadership potential.`;
}

// 生成 benefits
function generateBenefits() {
  return [
    'Full tuition fee coverage',
    'Monthly living stipend',
    'Health insurance',
    'Round-trip airfare',
    'Research and conference allowances'
  ];
}

// 生成 eligibility
function generateEligibility(degree) {
  return [
    `Bachelor's degree in a relevant field`,
    `Strong academic record (minimum GPA 3.0)`,
    `English language proficiency (IELTS 6.5+)`,
    `Demonstrated leadership and community involvement`
  ];
}

// 生成 howToApply
function generateHowToApply() {
  return [
    'Complete the online application form',
    'Upload all required documents',
    'Submit two letters of recommendation',
    'Write a statement of purpose',
    'Attend an interview if shortlisted'
  ];
}

// 生成 requiredDocuments
function generateRequiredDocuments() {
  return [
    'Academic transcripts',
    'CV / Resume',
    'Statement of purpose',
    'Two letters of recommendation',
    'Proof of English proficiency'
  ];
}

// 生成随机元素
function randomItem(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

// 生成一条完整的奖学金数据
function generateScholarship(index) {
  const provider = randomItem(providers);
  const hostCountries = randomItem(hostCountriesList);
  const country = hostCountries[0];
  const fields = randomItem(fieldsList);
  const degreeLevel = randomItem(degreeLevels);
  const fundingType = randomItem(fundingTypes);
  const programMode = randomItem(programModes);
  const programDuration = randomItem(programDurations);
  const programLevel = randomItem(programLevels);
  const region = randomItem(regions);
  const monthHint = randomItem(monthHints);
  const image = randomItem(imagePool);
  
  const title = `${provider} Scholarship ${index + 1} in ${fields[0]}`;
  const slug = slugify(title);
  
  // 将月份提示转换为一个具体的日期（用于排序，但前端只会显示提示文本）
  // 这里生成一个固定的参考日期，仅用于内部排序
  const monthMap = {
    Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5,
    Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11
  };
  const parts = monthHint.split(' ');
  const month = monthMap[parts[1]];
  let day = 15;
  if (parts[0] === 'Early') day = 5;
  else if (parts[0] === 'Mid') day = 15;
  else day = 25;
  const deadline = new Date(2026, month, day);
  
  // 计算状态
  const today = new Date();
  const daysUntil = Math.ceil((deadline - today) / (1000 * 3600 * 24));
  let status = 'open';
  if (deadline < today) status = 'closed';
  else if (daysUntil <= 14) status = 'closing-soon';
  else if (deadline.getFullYear() > today.getFullYear() + 1) status = 'coming-soon';
  
  return {
    title,
    slug,
    provider,
    hostCountries,
    region,
    fields,
    degreeLevel,
    fundingType,
    programMode,
    programDuration,
    programLevel,
    deadline,
    status,
    description: generateDescription(title, provider, country),
    benefits: generateBenefits(),
    eligibility: generateEligibility(degreeLevel[0]),
    howToApply: generateHowToApply(),
    requiredDocuments: generateRequiredDocuments(),
    applicationTips: 'Start your application early and tailor your personal statement to the scholarship mission.',
    importantDates: {
      resultsAnnouncement: '2-3 months after deadline',
      programmeStart: 'September/October 2026'
    },
    faqs: [
      { question: 'Is this scholarship fully funded?', answer: 'Yes, it covers tuition, living costs, and travel.' },
      { question: 'Can I apply if I am still completing my degree?', answer: 'Yes, final-year students may apply with proof of enrollment.' }
    ],
    officialLink: 'https://example.com/scholarship',
    featured: Math.random() > 0.8,
    views: Math.floor(Math.random() * 1000),
    image
  };
}

async function seed() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');
    
    const db = mongoose.connection.db;
    const collection = db.collection('scholarships');
    
    // 清空现有数据（可选，谨慎操作）
    // await collection.deleteMany({});
    // console.log('Cleared existing scholarships');
    
    const scholarships = [];
    for (let i = 0; i < 250; i++) {
      const scholarship = generateScholarship(i);
      // 确保 slug 唯一
      let slug = scholarship.slug;
      let counter = 1;
      while (await collection.findOne({ slug })) {
        slug = `${scholarship.slug}-${counter}`;
        counter++;
      }
      scholarship.slug = slug;
      scholarships.push(scholarship);
    }
    
    await collection.insertMany(scholarships);
    console.log(`Successfully inserted ${scholarships.length} scholarships.`);
    
    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('Error seeding scholarships:', error);
    process.exit(1);
  }
}

seed();
