import * as dotenv from 'dotenv';
import * as path from 'path';

// 必须在导入数据库模块前加载环境变量
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

import { connectToDatabase } from '../lib/mongodb';
import Scholarship from '../models/Scholarship';
import { slugify } from '../lib/slugify';

async function updateSlugs() {
  await connectToDatabase();
  const scholarships = await Scholarship.find({}).lean();
  
  let updatedCount = 0;
  for (const s of scholarships) {
    const newSlug = slugify(s.title);
    if (newSlug !== s.slug) {
      const existing = await Scholarship.findOne({ slug: newSlug, _id: { $ne: s._id } });
      const finalSlug = existing ? `${newSlug}-${Date.now().toString().slice(-4)}` : newSlug;
      await Scholarship.updateOne({ _id: s._id }, { $set: { slug: finalSlug } });
      console.log(`Updated: ${s.title} → ${finalSlug}`);
      updatedCount++;
    }
  }
  console.log(`Slug update complete. Updated ${updatedCount} scholarships.`);
  process.exit(0);
}

updateSlugs().catch(console.error);
