const mongoose = require('mongoose');

const uri = 'mongodb+srv://theprimezebii:Allah786allah@theopenscholarships-admin.9zxfvms.mongodb.net/theopenscholarships?retryWrites=true&w=majority';

const scholarships = [
  {
    title: "Chevening Scholarship 2026",
    slug: "chevening-scholarship-2026",
    provider: "UK Foreign, Commonwealth and Development Office",
    hostCountries: ["United Kingdom"],
    fields: ["All Fields"],
    degreeLevel: "Masters",
    fundingType: "Fully Funded",
    deadline: new Date("2025-11-05"),
    status: "closed",
    description: "The Chevening Scholarship is the UK government's international awards programme aimed at developing global leaders. Funded by the Foreign, Commonwealth and Development Office, Chevening offers fully funded master's degrees to outstanding emerging leaders from around the world. It is one of the most prestigious scholarships globally.",
    benefits: ["Full tuition fees", "Monthly stipend for living costs", "Return economy flight to the UK", "Arrival and departure allowances", "Visa application costs"],
    eligibility: ["Citizen of a Chevening-eligible country", "Return to your country for minimum two years after award ends", "Undergraduate degree for UK postgraduate entry", "At least two years of work experience", "Apply to three different UK university courses"],
    howToApply: ["Check your eligibility on the Chevening website", "Research and select three UK university courses", "Submit online application through Chevening portal", "If shortlisted, submit university applications and references", "Attend interview at British Embassy or High Commission", "Receive final decision and accept your award"],
    officialLink: "https://www.chevening.org/scholarships/",
    featured: true
  },
  {
    title: "DAAD Scholarship Germany 2026",
    slug: "daad-scholarship-germany-2026",
    provider: "German Academic Exchange Service (DAAD)",
    hostCountries: ["Germany"],
    fields: ["All Fields", "Development Studies", "Engineering", "Sciences"],
    degreeLevel: "Masters",
    fundingType: "Fully Funded",
    deadline: new Date("2026-04-15"),
    status: "open",
    description: "The DAAD Scholarship offers graduates from developing countries the opportunity to complete a master's degree in Germany. The programme is fully funded and designed to train future leaders who will contribute to the development of their home countries.",
    benefits: ["934 euros monthly stipend", "Health insurance coverage", "Travel allowance", "Study and research allowance", "German language course"],
    eligibility: ["Bachelor's degree from a developing country", "At least two years of professional experience", "Good academic record", "English or German language proficiency", "Commitment to return to home country after studies"],
    howToApply: ["Find a suitable master's programme on DAAD database", "Prepare application documents including CV and motivation letter", "Submit application through DAAD portal", "Wait for shortlisting and interview invitation", "Complete the interview", "Receive final decision"],
    officialLink: "https://www.daad.de/en/",
    featured: true
  },
  {
    title: "Fulbright Foreign Student Program 2026",
    slug: "fulbright-foreign-student-program-2026",
    provider: "US Department of State",
    hostCountries: ["United States"],
    fields: ["All Fields"],
    degreeLevel: "Masters",
    fundingType: "Fully Funded",
    deadline: new Date("2026-04-01"),
    status: "closed",
    description: "The Fulbright Foreign Student Program enables graduate students from around the world to study and conduct research in the United States. It is one of the most prestigious scholarship programmes globally, funded by the US government.",
    benefits: ["Full tuition coverage", "Monthly living stipend", "Health insurance", "Round-trip airfare", "Pre-departure orientation"],
    eligibility: ["Bachelor's degree or equivalent", "Strong academic record", "English language proficiency", "Leadership potential", "Commitment to return to home country"],
    howToApply: ["Check eligibility for your country", "Contact the Fulbright Commission or US Embassy", "Submit online application", "Take required standardized tests (TOEFL, GRE)", "Attend interview if shortlisted", "Receive final decision"],
    officialLink: "https://foreign.fulbrightonline.org/",
    featured: true
  },
  {
    title: "MEXT Scholarship Japan 2026",
    slug: "mext-scholarship-japan-2026",
    provider: "Japanese Government (MEXT)",
    hostCountries: ["Japan"],
    fields: ["All Fields", "Engineering", "Japanese Studies", "Sciences"],
    degreeLevel: "All Levels",
    fundingType: "Fully Funded",
    deadline: new Date("2026-05-30"),
    status: "coming-soon",
    description: "The MEXT Scholarship is offered by the Japanese Ministry of Education. It provides international students the opportunity to study at Japanese universities with full financial support.",
    benefits: ["Full tuition exemption", "Monthly stipend of 117,000 to 148,000 yen", "Round-trip airfare", "Preparatory Japanese language course", "Health insurance support"],
    eligibility: ["Hold a bachelor's degree for master's programme", "Under 35 years old", "Good academic record", "English or Japanese language proficiency", "Physically and mentally healthy"],
    howToApply: ["Choose your preferred university and supervisor", "Submit application through Japanese Embassy", "Take written examinations", "Attend interview", "Receive placement at university", "Travel to Japan"],
    officialLink: "https://www.studyinjapan.go.jp/en/",
    featured: true
  },
  {
    title: "Vanier Canada Graduate Scholarship 2026",
    slug: "vanier-canada-graduate-scholarship-2026",
    provider: "Government of Canada",
    hostCountries: ["Canada"],
    fields: ["Health Sciences", "Natural Sciences", "Engineering", "Social Sciences", "Humanities"],
    degreeLevel: "PhD",
    fundingType: "Fully Funded",
    deadline: new Date("2026-11-01"),
    status: "coming-soon",
    description: "The Vanier Canada Graduate Scholarship is one of the most prestigious doctoral awards in the world. It provides CAD 50,000 per year for three years to exceptional PhD students.",
    benefits: ["CAD 50,000 annual stipend", "3 years of funding (CAD 150,000 total)", "Research allowance", "Access to Canada's top research institutions", "Prestigious Vanier Scholar designation"],
    eligibility: ["Canadian citizen, permanent resident, or international student", "Nominated by a Canadian university", "Enrolled in or applying to a PhD programme", "Strong academic record", "Demonstrated research potential", "Leadership experience"],
    howToApply: ["Identify a Canadian university for your PhD", "Contact the graduate admissions office", "Secure admission to a PhD programme", "Work with your supervisor on the application", "University submits nomination to federal agencies", "Await results in spring"],
    officialLink: "https://vanier-banting.gc.ca/",
    featured: true
  },
  {
    title: "Erasmus Mundus Joint Masters 2026",
    slug: "erasmus-mundus-joint-masters-2026",
    provider: "European Union",
    hostCountries: ["Netherlands", "Germany", "France", "Spain", "Italy"],
    fields: ["All Fields", "Engineering", "Humanities", "Sciences", "Social Sciences"],
    degreeLevel: "Masters",
    fundingType: "Fully Funded",
    deadline: new Date("2026-02-12"),
    status: "closed",
    description: "Erasmus Mundus Joint Masters are prestigious international master's programmes offered by a consortium of European universities. Students study in at least two different European countries.",
    benefits: ["Full tuition fee coverage", "1400 euros monthly stipend", "Travel allowance", "Installation costs", "Health insurance"],
    eligibility: ["Bachelor's degree from any country", "English language proficiency", "No age limit", "Students from all nationalities", "Strong academic record"],
    howToApply: ["Browse available Erasmus Mundus programmes", "Check specific requirements for your chosen programme", "Prepare all required documents", "Submit online application", "Wait for selection results"],
    officialLink: "https://erasmus-plus.ec.europa.eu/opportunities",
    featured: false
  },
  {
    title: "Swiss Government Excellence Scholarship 2026",
    slug: "swiss-government-excellence-scholarship-2026",
    provider: "Swiss Government",
    hostCountries: ["Switzerland"],
    fields: ["All Fields", "Research", "Arts", "Sciences"],
    degreeLevel: "PhD",
    fundingType: "Fully Funded",
    deadline: new Date("2026-12-01"),
    status: "coming-soon",
    description: "The Swiss Government Excellence Scholarships aim to promote international exchange and research cooperation between Switzerland and over 180 other countries.",
    benefits: ["Monthly stipend", "Tuition fee waiver", "Health insurance", "Housing allowance", "Travel expenses"],
    eligibility: ["Master's degree or equivalent", "Research proposal", "Under 35 years old", "Good knowledge of English or German/French", "Letter of acceptance from a Swiss professor"],
    howToApply: ["Find a Swiss university and professor", "Prepare research proposal", "Submit application to Swiss embassy", "Wait for selection", "Accept scholarship"],
    officialLink: "https://www.sbfi.admin.ch/scholarships",
    featured: false
  },
  {
    title: "Australia Awards Scholarships 2026",
    slug: "australia-awards-scholarships-2026",
    provider: "Australian Government",
    hostCountries: ["Australia"],
    fields: ["Development Studies", "Public Health", "Education", "Agriculture", "Governance"],
    degreeLevel: "Masters",
    fundingType: "Fully Funded",
    deadline: new Date("2026-04-30"),
    status: "open",
    description: "Australia Awards Scholarships are long-term awards administered by the Department of Foreign Affairs and Trade. They aim to contribute to the development needs of Australia's partner countries.",
    benefits: ["Full tuition fees", "Return air travel", "Establishment allowance", "Contribution to living expenses", "Health insurance"],
    eligibility: ["Citizen of participating country", "Bachelor's degree", "At least two years work experience", "English proficiency", "Return to home country for two years"],
    howToApply: ["Check eligibility for your country", "Choose courses and universities", "Prepare application documents", "Submit online application", "Attend interview", "Receive outcome"],
    officialLink: "https://www.dfat.gov.au/scholarships",
    featured: false
  },
  {
    title: "Gates Cambridge Scholarship 2026",
    slug: "gates-cambridge-scholarship-2026",
    provider: "Bill and Melinda Gates Foundation",
    hostCountries: ["United Kingdom"],
    fields: ["All Fields"],
    degreeLevel: "PhD",
    fundingType: "Fully Funded",
    deadline: new Date("2026-12-03"),
    status: "coming-soon",
    description: "Gates Cambridge Scholarships are full-cost awards for outstanding applicants from outside the UK to pursue a full-time postgraduate degree at the University of Cambridge.",
    benefits: ["Full tuition fees", "Maintenance allowance", "Airfare", "Visa costs", "Research expenses"],
    eligibility: ["Citizen of any country outside UK", "Apply to Cambridge University", "Outstanding academic record", "Leadership potential", "Commitment to improving lives of others"],
    howToApply: ["Apply to University of Cambridge", "Submit Gates Cambridge application", "Provide academic transcripts", "Submit research proposal", "Attend interview", "Receive decision"],
    officialLink: "https://www.gatescambridge.org/",
    featured: false
  },
  {
    title: "Knight-Hennessy Scholars Program 2026",
    slug: "knight-hennessy-scholars-program-2026",
    provider: "Stanford University",
    hostCountries: ["United States"],
    fields: ["All Fields"],
    degreeLevel: "All Levels",
    fundingType: "Fully Funded",
    deadline: new Date("2026-10-08"),
    status: "coming-soon",
    description: "The Knight-Hennessy Scholars program cultivates a diverse, multidisciplinary community of emerging leaders from around the world. Scholars receive full funding to pursue graduate studies at Stanford.",
    benefits: ["Full tuition coverage", "Stipend for living expenses", "Travel allowance", "Academic enrichment opportunities", "Leadership development program"],
    eligibility: ["Apply to Stanford graduate program", "Bachelor's degree", "Outstanding academic record", "Leadership potential", "Civic commitment"],
    howToApply: ["Apply to Stanford graduate program", "Submit Knight-Hennessy application", "Complete video statement", "Provide recommendations", "Attend Immersion Weekend", "Receive decision"],
    officialLink: "https://knight-hennessy.stanford.edu/",
    featured: false
  }
];

async function seed() {
  try {
    await mongoose.connect(uri);
    console.log('Connected to MongoDB');
    
    const db = mongoose.connection.db;
    const collection = db.collection('scholarships');
    
    // Clear existing data
    await collection.deleteMany({});
    console.log('Cleared existing scholarships');
    
    // Insert new data
    const result = await collection.insertMany(scholarships);
    console.log(`Added ${result.insertedCount} scholarships`);
    
    console.log('\nScholarships added:');
    scholarships.forEach(s => console.log(`- ${s.title} (${s.hostCountries[0]})`));
    
    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error.message);
    process.exit(1);
  }
}

seed();
