// scripts/generate-filters-cache.js
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');

// Load .env.local
const envPath = path.join(__dirname, '..', '.env.local');
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
  console.error('❌ MONGODB_URI not found in .env.local');
  process.exit(1);
}

const ScholarshipSchema = new mongoose.Schema({}, { strict: false });
const Scholarship = mongoose.models.Scholarship || mongoose.model('Scholarship', ScholarshipSchema);

async function generateCache() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');
    
    const allScholarships = await Scholarship.find({}).lean();
    console.log(`📊 Processing ${allScholarships.length} scholarships...`);
    
    // Extract unique countries
    const countriesSet = new Set();
    allScholarships.forEach(s => {
      if (s.hostCountries && Array.isArray(s.hostCountries)) {
        s.hostCountries.forEach(c => countriesSet.add(c));
      }
    });
    const countries = Array.from(countriesSet).sort();
    
    // Extract unique fields/disciplines
    const fieldsSet = new Set();
    allScholarships.forEach(s => {
      if (s.fields && Array.isArray(s.fields)) {
        s.fields.forEach(f => fieldsSet.add(f));
      }
    });
    const disciplines = Array.from(fieldsSet).sort();
    
    // Get unique degree levels
    const degreesSet = new Set();
    allScholarships.forEach(s => {
      if (s.degreeLevel) {
        if (Array.isArray(s.degreeLevel)) {
          s.degreeLevel.forEach(d => degreesSet.add(d));
        } else {
          degreesSet.add(s.degreeLevel);
        }
      }
    });
    const degrees = Array.from(degreesSet).sort();
    
    // Get unique funding types
    const fundingSet = new Set();
    allScholarships.forEach(s => {
      if (s.fundingType) {
        if (Array.isArray(s.fundingType)) {
          s.fundingType.forEach(f => fundingSet.add(f));
        } else {
          fundingSet.add(s.fundingType);
        }
      } else {
        fundingSet.add('Fully Funded');
      }
    });
    const fundingTypes = Array.from(fundingSet).sort();
    
    // Count scholarships per country
    const countryCounts = {};
    countries.forEach(country => {
      countryCounts[country] = allScholarships.filter(s => 
        s.hostCountries && s.hostCountries.includes(country)
      ).length;
    });
    
    // Count scholarships per discipline
    const disciplineCounts = {};
    disciplines.forEach(discipline => {
      disciplineCounts[discipline] = allScholarships.filter(s => 
        s.fields && s.fields.includes(discipline)
      ).length;
    });
    
    // Programme stats
    const onlineCount = allScholarships.filter(s => s.programMode === 'online').length;
    const partTimeCount = allScholarships.filter(s => s.programMode === 'part-time').length;
    const oneYearCount = allScholarships.filter(s => s.programDuration === '1-year').length;
    const twoYearCount = allScholarships.filter(s => s.programDuration === '2-years').length;
    const executiveCount = allScholarships.filter(s => s.programLevel === 'executive').length;
    const researchCount = allScholarships.filter(s => s.programLevel === 'research').length;
    
    const data = {
      countries,
      countryCounts,
      disciplines,
      disciplineCounts,
      degrees,
      fundingTypes,
      programmeStats: {
        online: onlineCount,
        partTime: partTimeCount,
        oneYear: oneYearCount,
        twoYear: twoYearCount,
        executive: executiveCount,
        research: researchCount
      },
      generatedAt: new Date().toISOString()
    };
    
    const outputPath = path.join(__dirname, '..', 'public', 'filters-cache.json');
    fs.writeFileSync(outputPath, JSON.stringify(data, null, 2));
    console.log(`✅ Cache written to ${outputPath}`);
    
    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

generateCache();
