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
const questionSchema = new mongoose.Schema({ techId: mongoose.Schema.Types.ObjectId, topicId: mongoose.Schema.Types.ObjectId, text: String, options: [String], correctAnswer: String, difficulty: String, explanation: String });
const Question = mongoose.models.Question || mongoose.model("Question", questionSchema);

const newDetailedTopics = [
  {
    title: "Polyfills",
    content: "<h2>Polyfills</h2><p>A polyfill is a piece of code (usually JavaScript on the Web) used to provide modern functionality on older browsers that do not natively support it.</p>",
    questions: [
      { text: "When implementing a custom polyfill for Array.prototype.map, what is the most important rule about the return value?", options: ["It must return a modified version of the original array", "It must return a completely new array", "It must return undefined", "It must return a string"], correctAnswer: "It must return a completely new array", difficulty: "Medium", explanation: "The map() method always creates and returns a new array populated with the results." }
    ]
  },
  {
    title: "Debouncing and Throttling Implementation",
    content: "<h2>Advanced Optimization</h2><p>Writing custom debounce and throttle functions is a common interview task to test understanding of closures and setTimeout.</p>",
    questions: [
      { text: "In a custom debounce function, what happens if the function is called again before the timeout completes?", options: ["The function executes immediately", "A second timeout is started in parallel", "The previous timeout is cleared and a new one starts", "The new call is completely ignored"], correctAnswer: "The previous timeout is cleared and a new one starts", difficulty: "Hard", explanation: "Debouncing resets the timer on every call using clearTimeout(timerId) so the function only runs after a period of inactivity." }
    ]
  },
  {
    title: "Deep Equality Implementation",
    content: "<h2>Deep Equals</h2><p>Writing a function to determine if two deeply nested objects or arrays are structurally identical.</p>",
    questions: [
      { text: "When writing a deep equality function, what is the edge case when comparing two null values using typeof?", options: ["typeof null is 'null'", "typeof null is 'undefined'", "typeof null is 'object'", "typeof null throws an error"], correctAnswer: "typeof null is 'object'", difficulty: "Medium", explanation: "Because typeof null returns 'object', you must explicitly check if the value is null before treating it as a standard object in your deep equality logic." }
    ]
  },
  {
    title: "Event Emitter Implementation",
    content: "<h2>Publish/Subscribe Pattern</h2><p>Implementing a basic Event Emitter (pub/sub) class with 'on', 'emit', and 'off' methods.</p>",
    questions: [
      { text: "In a custom Event Emitter, what data structure is best used to store the registered events and their callbacks?", options: ["An array of strings", "A Set of functions", "An Object (or Map) where keys are event names and values are arrays of functions", "A single callback function"], correctAnswer: "An Object (or Map) where keys are event names and values are arrays of functions", difficulty: "Hard", explanation: "You need a dictionary to map a specific event name to a list (array) of listener functions that should be executed when emitted." }
    ]
  },
  {
    title: "Promise Implementation",
    content: "<h2>Custom Promises</h2><p>Understanding how a Promise works under the hood by implementing custom resolve, reject, and then chaining mechanisms.</p>",
    questions: [
      { text: "When implementing a custom Promise, how do you ensure the '.then' callbacks are executed asynchronously?", options: ["By using a while loop", "By wrapping the callback execution in setTimeout or queueMicrotask", "By using the async keyword", "By calling them immediately"], correctAnswer: "By wrapping the callback execution in setTimeout or queueMicrotask", difficulty: "Hard", explanation: "According to the Promise A+ spec, 'then' callbacks must not be executed synchronously. They must be deferred to a microtask queue or macro task queue." }
    ]
  }
];

async function addDetailedCodingTopics() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("Connected to DB.");

    // Update JSON file
    const dataPath = path.resolve(__dirname, '../data/seed-data.json');
    let seedData = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));
    
    const jsIndex = seedData.findIndex(t => t.name === "JavaScript");
    let startOrder = seedData[jsIndex].topics.length + 1;
    
    for (const cat of newDetailedTopics) {
      cat.order = startOrder++;
      seedData[jsIndex].topics.push(cat);
    }
    
    fs.writeFileSync(dataPath, JSON.stringify(seedData, null, 2));
    console.log(`Added ${newDetailedTopics.length} detailed implementation topics to seed-data.json`);

  } catch (error) {
    console.error("Migration error:", error);
  } finally {
    mongoose.disconnect();
  }
}

addDetailedCodingTopics();
