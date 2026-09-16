const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
require('dotenv').config({ path: '.env' });

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error("Please define MONGODB_URI in .env");
  process.exit(1);
}

const topicSchema = new mongoose.Schema({ techId: mongoose.Schema.Types.ObjectId, title: String, content: String, order: Number });
const Topic = mongoose.models.Topic || mongoose.model("Topic", topicSchema);

async function cleanNumbers() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("Connected to DB.");

    // 1. Update JSON file
    const dataPath = path.resolve(__dirname, '../data/seed-data.json');
    let seedData = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));
    
    let jsonUpdated = 0;
    for (const tech of seedData) {
      for (const topic of tech.topics) {
        // Match things like "1. ", "12. "
        const match = topic.title.match(/^\d+\.\s*(.*)/);
        if (match) {
          topic.title = match[1].trim();
          jsonUpdated++;
        }
      }
    }
    
    fs.writeFileSync(dataPath, JSON.stringify(seedData, null, 2));
    console.log(`Removed numbers from ${jsonUpdated} topics in seed-data.json`);

    // 2. Update DB
    const topics = await Topic.find({});
    let dbUpdated = 0;
    for (const topic of topics) {
      const match = topic.title.match(/^\d+\.\s*(.*)/);
      if (match) {
        topic.title = match[1].trim();
        await topic.save();
        dbUpdated++;
      }
    }
    console.log(`Removed numbers from ${dbUpdated} topics in MongoDB`);

  } catch (error) {
    console.error("Migration error:", error);
  } finally {
    mongoose.disconnect();
  }
}

cleanNumbers();
