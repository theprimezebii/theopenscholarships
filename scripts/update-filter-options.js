const { connectToDatabase } = require('../lib/mongodb.ts');

async function updateFilters() {
  const mongoose = await connectToDatabase();
  const db = mongoose.connection.db;
  
  // Get all scholarships
  const scholarships = await db.collection('scholarships').find({}).toArray();
  
  // Extract unique values
  const disciplines = new Set();
  const fundingTypes = new Set();
  
  scholarships.forEach(s => {
    if (s.fields) s.fields.forEach(f => disciplines.add(f));
    if (s.fundingType) fundingTypes.add(s.fundingType);
  });
  
  console.log('Disciplines:', Array.from(disciplines));
  console.log('Funding Types:', Array.from(fundingTypes));
  
  process.exit(0);
}

updateFilters().catch(console.error);
