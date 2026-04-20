// Load environment variables from .env.local
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

const now = new Date();
const futureDate1 = new Date(now);
futureDate1.setMonth(now.getMonth() + 3);
const futureDate2 = new Date(now);
futureDate2.setMonth(now.getMonth() + 5);
const futureDate3 = new Date(now);
futureDate3.setMonth(now.getMonth() + 1);
const futureDate4 = new Date(now);
futureDate4.setMonth(now.getMonth() + 6);
const futureDate5 = new Date(now);
futureDate5.setMonth(now.getMonth() + 2);
const futureDate6 = new Date(now);
futureDate6.setDate(now.getDate() + 10);
const futureDate7 = new Date(now);
futureDate7.setMonth(now.getMonth() + 4);
const futureDate8 = new Date(now);
futureDate8.setFullYear(now.getFullYear() + 1);
const futureDate9 = new Date(now);
futureDate9.setDate(now.getDate() + 45);
const futureDate10 = new Date(now);
futureDate10.setMonth(now.getMonth() + 2);

const scholarships = [
  {
    title: "Rhodes Scholarship 2026 at University of Oxford",
    provider: "Rhodes Trust",
    hostCountries: ["United Kingdom"],
    region: ["Europe"],
    fields: ["All Fields"],
    degreeLevel: ["Masters", "PhD"],
    fundingType: ["Fully Funded"],
    programMode: ["on-campus", "full-time"],
    programDuration: ["2-years"],
    programLevel: ["research"],
    deadline: futureDate1,
    status: "open",
    description: "The Rhodes Scholarship is the oldest and perhaps the most prestigious international scholarship programme in the world, enabling outstanding young people from around the world to study at the University of Oxford.",
    benefits: [
      "Full tuition fees",
      "Annual stipend of £18,180",
      "Flights to and from Oxford",
      "Settling in allowance",
      "Health insurance"
    ],
    eligibility: [
      "Age between 19 and 25",
      "Completed an undergraduate degree with first-class honours",
      "Demonstrated leadership and commitment to service",
      "English language proficiency"
    ],
    howToApply: [
      "Check eligibility for your country/region",
      "Prepare academic transcripts and CV",
      "Write a personal statement (1000 words)",
      "Obtain 5-8 letters of recommendation",
      "Submit online application",
      "Attend interview if shortlisted"
    ],
    requiredDocuments: [
      "Academic transcripts",
      "CV/Resume",
      "Personal statement",
      "Birth certificate or passport",
      "Letters of recommendation",
      "English proficiency test scores"
    ],
    applicationTips: "Focus on demonstrating academic excellence, leadership potential, and commitment to making a difference in the world.",
    importantDates: {
      resultsAnnouncement: "November 2026",
      programmeStart: "October 2027"
    },
    faqs: [
      { question: "Is there an age limit?", answer: "Yes, applicants must be between 19 and 25 years old." },
      { question: "Can I apply if I am already at Oxford?", answer: "No, the Rhodes Scholarship is for new students only." }
    ],
    officialLink: "https://www.rhodeshouse.ox.ac.uk/scholarships/",
    featured: true,
    image: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=1200&h=630&fit=crop"
  },
  {
    title: "Eiffel Excellence Scholarship Program 2026",
    provider: "French Ministry for Europe and Foreign Affairs",
    hostCountries: ["France"],
    region: ["Europe"],
    fields: ["Engineering", "Economics & Finance", "Law", "Political Science"],
    degreeLevel: ["Masters", "PhD"],
    fundingType: ["Fully Funded"],
    programMode: ["on-campus", "full-time"],
    programDuration: ["1-year", "2-years"],
    programLevel: ["research", "regular"],
    deadline: futureDate2,
    status: "coming-soon",
    description: "The Eiffel Excellence Scholarship Program was established by the French Ministry for Europe and Foreign Affairs to attract top international students to French higher education institutions.",
    benefits: [
      "Monthly allowance of €1,181 for Master's students",
      "Monthly allowance of €1,700 for PhD students",
      "Round-trip international airfare",
      "Health insurance",
      "Cultural activities"
    ],
    eligibility: [
      "Non-French nationality",
      "Age up to 25 for Master's, up to 30 for PhD",
      "Excellent academic record",
      "Nominated by a French higher education institution"
    ],
    howToApply: [
      "Contact the international office of your chosen French university",
      "University submits nomination on your behalf",
      "Complete Eiffel application form",
      "Submit all required documents to the university"
    ],
    requiredDocuments: [
      "CV/Resume",
      "Academic transcripts",
      "Letters of recommendation",
      "Statement of purpose",
      "Proof of nationality"
    ],
    officialLink: "https://www.campusfrance.org/en/eiffel-scholarship-program",
    featured: true,
    image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=1200&h=630&fit=crop"
  },
  {
    title: "Joint Japan World Bank Graduate Scholarship 2026",
    provider: "World Bank Group",
    hostCountries: ["Japan", "United States", "United Kingdom", "France", "Netherlands"],
    region: ["Global"],
    fields: ["Economics & Finance", "Public Policy", "Development Studies", "Health Sciences"],
    degreeLevel: ["Masters"],
    fundingType: ["Fully Funded"],
    programMode: ["on-campus", "full-time"],
    programDuration: ["2-years"],
    programLevel: ["regular"],
    deadline: futureDate3,
    status: "open",
    description: "The Joint Japan/World Bank Graduate Scholarship Program (JJ/WBGSP) provides scholarships to mid-career professionals from developing countries to pursue master's degrees in development-related fields.",
    benefits: [
      "Full tuition fees",
      "Monthly living stipend",
      "Round-trip airfare",
      "Health insurance",
      "Travel allowance"
    ],
    eligibility: [
      "Citizen of a World Bank member developing country",
      "Bachelor's degree",
      "At least 3 years of development-related work experience",
      "Under 45 years old",
      "English proficiency"
    ],
    howToApply: [
      "Review preferred university programs",
      "Prepare application documents",
      "Submit online application through World Bank portal",
      "Wait for selection results"
    ],
    requiredDocuments: [
      "Academic transcripts",
      "CV/Resume",
      "Two letters of recommendation",
      "Statement of purpose",
      "Proof of employment"
    ],
    officialLink: "https://www.worldbank.org/en/programs/scholarships",
    featured: true,
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&h=630&fit=crop"
  },
  {
    title: "Swiss Government Excellence Scholarships 2026-2027",
    provider: "Swiss Government",
    hostCountries: ["Switzerland"],
    region: ["Europe"],
    fields: ["All Fields"],
    degreeLevel: ["PhD", "Postdoctoral"],
    fundingType: ["Fully Funded"],
    programMode: ["on-campus", "full-time", "research"],
    programDuration: ["1-year", "3-years"],
    programLevel: ["research"],
    deadline: futureDate4,
    status: "coming-soon",
    description: "The Swiss Government Excellence Scholarships promote international exchange and research cooperation between Switzerland and over 180 other countries.",
    benefits: [
      "Monthly stipend of CHF 1,920",
      "Tuition fee waiver",
      "Health insurance",
      "Housing allowance",
      "Travel expenses"
    ],
    eligibility: [
      "Master's degree for PhD applicants",
      "PhD degree for postdoctoral applicants",
      "Under 35 years old",
      "Research proposal",
      "Letter of acceptance from a Swiss professor"
    ],
    howToApply: [
      "Find a Swiss university and professor",
      "Prepare research proposal",
      "Submit application to Swiss embassy",
      "Wait for selection"
    ],
    requiredDocuments: [
      "Research proposal",
      "CV",
      "Academic transcripts",
      "Letters of recommendation",
      "Letter of acceptance from professor"
    ],
    officialLink: "https://www.sbfi.admin.ch/scholarships",
    featured: false,
    image: "https://images.unsplash.com/photo-1527668752968-14dc70a27c95?w=1200&h=630&fit=crop"
  },
  {
    title: "Turkiye Burslari Scholarship 2026",
    provider: "Government of Turkey",
    hostCountries: ["Turkey"],
    region: ["Middle East"],
    fields: ["All Fields"],
    degreeLevel: ["Bachelor", "Masters", "PhD"],
    fundingType: ["Fully Funded"],
    programMode: ["on-campus", "full-time"],
    programDuration: ["1-year", "2-years", "3-years", "4-years"],
    programLevel: ["regular", "research"],
    deadline: futureDate5,
    status: "open",
    description: "Turkiye Burslari is a government-funded, competitive scholarship program awarded to outstanding students and researchers to pursue full-time or short-term programs at top Turkish universities.",
    benefits: [
      "Full tuition fees",
      "Monthly stipend (1,700 TL for undergraduate, 2,400 TL for master's, 3,000 TL for PhD)",
      "Accommodation support",
      "Health insurance",
      "Turkish language course",
      "Round-trip flight tickets"
    ],
    eligibility: [
      "Non-Turkish citizen",
      "Minimum academic achievement: 70% for undergraduate, 75% for graduate",
      "Age limits: under 21 for Bachelor, under 30 for Master's, under 35 for PhD",
      "Good health condition"
    ],
    howToApply: [
      "Create account on Turkiye Burslari portal",
      "Fill out online application form",
      "Upload required documents",
      "Wait for shortlisting and interview invitation"
    ],
    requiredDocuments: [
      "Valid passport",
      "Recent photograph",
      "Academic transcripts",
      "Diploma or temporary graduation certificate",
      "Language test scores (if any)",
      "Statement of purpose"
    ],
    officialLink: "https://www.turkiyeburslari.gov.tr/",
    featured: true,
    image: "https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=1200&h=630&fit=crop"
  },
  {
    title: "Commonwealth Shared Scholarships 2026",
    provider: "UK Foreign, Commonwealth and Development Office",
    hostCountries: ["United Kingdom"],
    region: ["Europe"],
    fields: ["Development Studies", "Public Health", "Education", "Engineering", "Environmental Sciences"],
    degreeLevel: ["Masters"],
    fundingType: ["Fully Funded"],
    programMode: ["on-campus", "full-time"],
    programDuration: ["1-year"],
    programLevel: ["regular"],
    deadline: futureDate6,
    status: "closing-soon",
    description: "Commonwealth Shared Scholarships are for candidates from least developed and lower middle income Commonwealth countries to study selected master's courses at UK universities.",
    benefits: [
      "Full tuition fees",
      "Monthly living allowance of £1,236",
      "Return airfare",
      "Warm clothing allowance",
      "Thesis grant",
      "Study travel grant"
    ],
    eligibility: [
      "Citizen of eligible Commonwealth country",
      "Bachelor's degree with first class or upper second class",
      "Not have studied or worked in a developed country for more than one year",
      "Commitment to return to home country"
    ],
    howToApply: [
      "Check participating universities and courses",
      "Apply to the university directly",
      "University nominates selected candidates",
      "Commonwealth Scholarship Commission makes final decision"
    ],
    requiredDocuments: [
      "Academic transcripts",
      "Degree certificate",
      "Two references",
      "Statement of purpose",
      "Proof of citizenship"
    ],
    officialLink: "https://cscuk.fcdo.gov.uk/scholarships/commonwealth-shared-scholarships/",
    featured: false,
    image: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=1200&h=630&fit=crop"
  },
  {
    title: "New Zealand Government Scholarships 2026",
    provider: "New Zealand Ministry of Foreign Affairs and Trade",
    hostCountries: ["New Zealand"],
    region: ["Asia Pacific"],
    fields: ["Agriculture", "Renewable Energy", "Disaster Management", "Public Policy", "Education"],
    degreeLevel: ["Masters", "PhD"],
    fundingType: ["Fully Funded"],
    programMode: ["on-campus", "full-time"],
    programDuration: ["1-year", "2-years", "3-years"],
    programLevel: ["research", "regular"],
    deadline: futureDate7,
    status: "coming-soon",
    description: "New Zealand Government Scholarships provide opportunities for students from developing countries to study in New Zealand and gain knowledge and skills for their country's development.",
    benefits: [
      "Full tuition fees",
      "Living allowance of NZ$491 per week",
      "Establishment allowance",
      "Health insurance",
      "Return airfare"
    ],
    eligibility: [
      "Citizen of eligible Pacific, Asian, African, or Latin American country",
      "Bachelor's degree for master's applicants",
      "At least 2 years of work experience",
      "English proficiency (IELTS 6.5+)"
    ],
    howToApply: [
      "Check eligibility for your country",
      "Choose courses and universities",
      "Prepare application documents",
      "Submit online application"
    ],
    requiredDocuments: [
      "Academic transcripts",
      "CV/Resume",
      "Letters of recommendation",
      "English test scores",
      "Statement of purpose"
    ],
    officialLink: "https://www.mfat.govt.nz/en/aid-and-development/scholarships/",
    featured: false,
    image: "https://images.unsplash.com/photo-1507699622108-4be3abd695ad?w=1200&h=630&fit=crop"
  },
  {
    title: "Ireland Government Scholarship 2026 (GOI-IES)",
    provider: "Government of Ireland",
    hostCountries: ["Ireland"],
    region: ["Europe"],
    fields: ["All Fields"],
    degreeLevel: ["Masters", "PhD"],
    fundingType: ["Fully Funded"],
    programMode: ["on-campus", "full-time", "research"],
    programDuration: ["1-year", "2-years", "3-years", "4-years"],
    programLevel: ["research", "regular"],
    deadline: futureDate8,
    status: "coming-soon",
    description: "The Government of Ireland International Education Scholarship (GOI-IES) program supports high-caliber international students who wish to study at Irish higher education institutions.",
    benefits: [
      "Full tuition fee waiver",
      "€10,000 stipend for living expenses",
      "Health insurance support"
    ],
    eligibility: [
      "Non-EU/EEA nationality",
      "Excellent academic record",
      "Offer letter from an Irish university",
      "English language proficiency"
    ],
    howToApply: [
      "Secure admission to an Irish university",
      "Complete online GOI-IES application",
      "Submit personal statement and references",
      "Wait for selection results"
    ],
    requiredDocuments: [
      "Academic transcripts",
      "Offer letter from Irish university",
      "Personal statement",
      "Two letters of recommendation",
      "English proficiency certificate"
    ],
    officialLink: "https://www.gov.ie/en/service/e8418-government-of-ireland-international-education-scholarship-programme/",
    featured: false,
    image: "https://images.unsplash.com/photo-1582034358936-9b6ac7c1559d?w=1200&h=630&fit=crop"
  },
  {
    title: "KAUST Scholarship for International Students 2026",
    provider: "King Abdullah University of Science and Technology",
    hostCountries: ["Saudi Arabia"],
    region: ["Middle East"],
    fields: ["Engineering", "Computer Science & IT", "Natural Sciences", "Mathematics", "Environmental Sciences"],
    degreeLevel: ["Masters", "PhD"],
    fundingType: ["Fully Funded"],
    programMode: ["on-campus", "full-time", "research"],
    programDuration: ["2-years", "3-years", "4-years"],
    programLevel: ["research"],
    deadline: futureDate9,
    status: "open",
    description: "KAUST provides full scholarships to exceptional graduate students from around the world to pursue master's and PhD programs in science, engineering, and technology.",
    benefits: [
      "Full tuition fees",
      "Annual living stipend of $20,000-$30,000",
      "Free housing",
      "Health insurance",
      "Travel allowance"
    ],
    eligibility: [
      "Bachelor's degree for master's applicants",
      "Master's degree for PhD applicants",
      "Strong academic record (GPA 3.5/4.0 or equivalent)",
      "English proficiency (TOEFL 79 or IELTS 6.5)"
    ],
    howToApply: [
      "Create account on KAUST admissions portal",
      "Select program and upload documents",
      "Provide contact details for references",
      "Submit application"
    ],
    requiredDocuments: [
      "Academic transcripts",
      "Statement of purpose",
      "Three letters of recommendation",
      "CV/Resume",
      "English test scores",
      "GRE scores (optional but recommended)"
    ],
    officialLink: "https://www.kaust.edu.sa/en/study",
    featured: false,
    image: "https://images.unsplash.com/photo-1562774053-701939374585?w=1200&h=630&fit=crop"
  },
  {
    title: "ADB-Japan Scholarship Program 2026",
    provider: "Asian Development Bank",
    hostCountries: ["Japan", "United States", "United Kingdom", "Australia", "New Zealand", "Singapore", "Thailand"],
    region: ["Asia Pacific"],
    fields: ["Economics & Finance", "Business & Management", "Engineering", "Environmental Sciences", "Public Policy"],
    degreeLevel: ["Masters"],
    fundingType: ["Fully Funded"],
    programMode: ["on-campus", "full-time"],
    programDuration: ["1-year", "2-years"],
    programLevel: ["regular"],
    deadline: futureDate10,
    status: "open",
    description: "The Asian Development Bank-Japan Scholarship Program (ADB-JSP) provides opportunities for citizens of ADB's developing member countries to pursue postgraduate studies in development-related fields.",
    benefits: [
      "Full tuition fees",
      "Monthly subsistence allowance",
      "Housing allowance",
      "Books and instructional materials allowance",
      "Health insurance",
      "Travel expenses"
    ],
    eligibility: [
      "Citizen of an ADB borrowing member country",
      "Bachelor's degree with superior academic record",
      "At least 2 years of professional work experience",
      "Under 35 years old",
      "English proficiency"
    ],
    howToApply: [
      "Choose from designated institutions",
      "Apply directly to the university",
      "Complete university and ADB-JSP application forms",
      "Submit all required documents"
    ],
    requiredDocuments: [
      "Academic transcripts",
      "Degree certificate",
      "Employment certificate",
      "Two letters of recommendation",
      "Statement of purpose",
      "Income tax return of family"
    ],
    officialLink: "https://www.adb.org/work-with-us/careers/japan-scholarship-program",
    featured: false,
    image: "https://images.unsplash.com/photo-1490806843957-31f4c9a91c65?w=1200&h=630&fit=crop"
  }
];

async function insertScholarships() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');
    
    const db = mongoose.connection.db;
    const collection = db.collection('scholarships');
    
    let insertedCount = 0;
    for (const s of scholarships) {
      // Generate slug
      let slug = slugify(s.title);
      const existing = await collection.findOne({ slug });
      if (existing) {
        slug = `${slug}-${Date.now().toString().slice(-4)}`;
      }
      
      // Calculate status based on deadline
      const deadlineDate = new Date(s.deadline);
      const today = new Date();
      const daysUntil = Math.ceil((deadlineDate - today) / (1000 * 3600 * 24));
      let status = s.status;
      if (status === 'open' && daysUntil <= 14 && daysUntil > 0) status = 'closing-soon';
      else if (deadlineDate < today) status = 'closed';
      
      const scholarshipData = {
        ...s,
        slug,
        status,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      await collection.insertOne(scholarshipData);
      insertedCount++;
      console.log(`Inserted: ${s.title}`);
    }
    
    console.log(`\nSuccessfully inserted ${insertedCount} scholarships.`);
    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('Error inserting scholarships:', error.message);
    process.exit(1);
  }
}

insertScholarships();
