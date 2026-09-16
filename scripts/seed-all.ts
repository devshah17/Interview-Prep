import mongoose from "mongoose";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";

dotenv.config({ path: ".env" });

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error("Please define MONGODB_URI in .env");
  process.exit(1);
}

const technologySchema = new mongoose.Schema({ name: String, description: String });
const Technology = mongoose.models.Technology || mongoose.model("Technology", technologySchema);

const topicSchema = new mongoose.Schema({ techId: mongoose.Schema.Types.ObjectId, title: String, content: String, order: Number });
const Topic = mongoose.models.Topic || mongoose.model("Topic", topicSchema);

const questionSchema = new mongoose.Schema({ techId: mongoose.Schema.Types.ObjectId, topicId: mongoose.Schema.Types.ObjectId, text: String, options: [String], correctAnswer: String, difficulty: String, explanation: String });
const Question = mongoose.models.Question || mongoose.model("Question", questionSchema);

async function seedFromJson() {
  try {
    await mongoose.connect(MONGODB_URI!);
    console.log("Connected to MongoDB. Upserting data from JSON...");

    const dataPath = path.resolve(process.cwd(), "data/seed-data.json");
    const rawData = fs.readFileSync(dataPath, "utf-8");
    const seedData = JSON.parse(rawData);

    for (const techData of seedData) {
      // Upsert Technology
      let tech = await Technology.findOne({ name: techData.name });
      if (!tech) {
        tech = await Technology.create({
          name: techData.name,
          description: techData.description
        });
        console.log(`Created Technology: ${tech.name}`);
      } else {
        console.log(`Found existing Technology: ${tech.name}`);
      }

      // Upsert Topics
      for (const topicData of techData.topics) {
        let topic = await Topic.findOne({ techId: tech._id, title: topicData.title });
        if (!topic) {
          topic = await Topic.create({
            techId: tech._id,
            title: topicData.title,
            content: topicData.content,
            order: topicData.order
          });
          console.log(`  Created Topic: ${topic.title}`);
        } else {
          console.log(`  Found existing Topic: ${topic.title}`);
        }

        // Upsert Questions
        for (const qData of topicData.questions) {
          let question = await Question.findOne({ topicId: topic._id, text: qData.text });
          if (!question) {
            await Question.create({
              techId: tech._id,
              topicId: topic._id,
              text: qData.text,
              options: qData.options,
              correctAnswer: qData.correctAnswer,
              difficulty: qData.difficulty,
              explanation: qData.explanation
            });
            console.log(`    Created Question: ${qData.text.substring(0, 30)}...`);
          }
        }
      }
    }

    console.log("Data seeding from JSON complete!");
  } catch (error) {
    console.error("Seed error:", error);
  } finally {
    mongoose.disconnect();
  }
}

seedFromJson();
