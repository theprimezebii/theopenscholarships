const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.local' });

const ScholarshipSchema = new mongoose.Schema({
  title: String,
  region: { type: String, default: 'Global' }
}, { strict: false });

const Scholarship = mongoose.models.Scholarship || mongoose.model('Scholarship', ScholarshipSchema);

async function migrate() {
  await mongoose.connect(process.env.MONGODB_URI);
  const result = await Scholarship.updateMany(
    { region: { $exists: false } },
    { $set: { region: 'Global' } }
  );
  console.log(`Updated ${result.modifiedCount} scholarships with region field`);
  await mongoose.disconnect();
}

migrate().catch(console.error);
