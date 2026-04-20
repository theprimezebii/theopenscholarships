// scripts/addIndexes.js
const { MongoClient } = require('mongodb');
const fs = require('fs');
const path = require('path');

// Load environment variables from .env.local
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

async function createIndexes() {
  const client = new MongoClient(MONGODB_URI);
  
  try {
    console.log('🔌 Connecting to MongoDB...');
    await client.connect();
    console.log('✅ Connected');
    
    const db = client.db('fundedworld'); // Your database name
    const collection = db.collection('scholarships');
    
    console.log('\n📊 Creating indexes on scholarships collection...\n');
    
    const indexesToCreate = [
      { field: 'hostCountries', options: {} },
      { field: 'fields', options: {} },
      { field: 'degreeLevel', options: {} },
      { field: 'fundingType', options: {} },
      { field: 'status', options: {} },
      { field: 'region', options: {} },
      { field: 'programMode', options: {} },
      { field: 'programDuration', options: {} },
      { field: 'programLevel', options: {} },
      { field: 'deadline', options: {} },
      { field: 'provider', options: {} },
      { field: 'slug', options: { unique: true } },
    ];
    
    for (const item of indexesToCreate) {
      const indexKey = { [item.field]: 1 };
      const indexName = `${item.field}_1`;
      
      try {
        await collection.createIndex(indexKey, item.options);
        console.log(`  ✅ Created index on "${item.field}"${item.options.unique ? ' (unique)' : ''}`);
      } catch (err) {
        if (err.code === 85 || err.message.includes('already exists')) {
          console.log(`  ⏭️  Index on "${item.field}" already exists`);
        } else {
          console.error(`  ❌ Failed to create index on "${item.field}":`, err.message);
        }
      }
    }
    
    // Create text index for search
    console.log('\n📝 Creating text search index...');
    try {
      await collection.createIndex(
        { title: 'text', provider: 'text', description: 'text' },
        { name: 'text_search' }
      );
      console.log('  ✅ Created text search index');
    } catch (err) {
      if (err.code === 85 || err.message.includes('already exists')) {
        console.log('  ⏭️  Text search index already exists');
      } else {
        console.error('  ❌ Failed to create text index:', err.message);
      }
    }
    
    console.log('\n🎉 All indexes processed!');
    
    // List all current indexes
    console.log('\n📋 Current indexes:');
    const indexes = await collection.indexes();
    indexes.forEach(idx => {
      console.log(`  - ${idx.name}: ${JSON.stringify(idx.key)}`);
    });
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await client.close();
  }
}

createIndexes();