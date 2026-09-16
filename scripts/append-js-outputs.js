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

const outputTopics = [
  {
    title: "Hoisting Output Questions",
    content: "<h2>Hoisting in Practice</h2><p>Predicting the output of variables accessed before declaration.</p>",
    questions: [
      { text: "What is the output of: `console.log(a); var a = 5;`?", options: ["5", "undefined", "ReferenceError", "null"], correctAnswer: "undefined", difficulty: "Easy", explanation: "With `var`, the declaration is hoisted to the top of the scope, but the initialization (= 5) is not." }
    ]
  },
  {
    title: "Event Loop Output Questions",
    content: "<h2>Event Loop execution order</h2><p>Predicting the exact execution order of sync code, Microtasks (Promises), and Macrotasks (setTimeout).</p>",
    questions: [
      { text: "What is the output? `console.log(1); setTimeout(() => console.log(2), 0); Promise.resolve().then(() => console.log(3)); console.log(4);`", options: ["1, 2, 3, 4", "1, 4, 3, 2", "1, 4, 2, 3", "1, 3, 4, 2"], correctAnswer: "1, 4, 3, 2", difficulty: "Hard", explanation: "Synchronous code runs first (1, 4). Then Microtasks like Promises run (3). Finally, Macrotasks like setTimeout run (2)." }
    ]
  },
  {
    title: "Closure Output Questions",
    content: "<h2>Closures and Loops</h2><p>Predicting the output of callbacks inside loops referencing `var` vs `let`.</p>",
    questions: [
      { text: "What is the output? `for (var i = 0; i < 3; i++) { setTimeout(() => console.log(i), 100); }`", options: ["0, 1, 2", "3, 3, 3", "undefined, undefined, undefined", "1, 2, 3"], correctAnswer: "3, 3, 3", difficulty: "Medium", explanation: "`var` is function-scoped. By the time the timeouts run, the loop has finished and `i` is 3. The callbacks all reference the same `i`." }
    ]
  },
  {
    title: "This Keyword Output Questions",
    content: "<h2>Context Prediction</h2><p>Determining what `this` evaluates to inside nested objects and arrow functions.</p>",
    questions: [
      { text: "What is the output? `const obj = { name: 'Dev', getName: () => this.name }; console.log(obj.getName());`", options: ["Dev", "undefined", "ReferenceError", "null"], correctAnswer: "undefined", difficulty: "Medium", explanation: "Arrow functions do not bind their own `this`. They inherit `this` from the enclosing lexical scope (the global object window here), which doesn't have a `name` property." }
    ]
  }
];

async function addOutputQuestions() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("Connected to DB.");

    // Update JSON file
    const dataPath = path.resolve(__dirname, '../data/seed-data.json');
    let seedData = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));
    
    const jsIndex = seedData.findIndex(t => t.name === "JavaScript");
    let startOrder = seedData[jsIndex].topics.length + 1;
    
    for (const cat of outputTopics) {
      cat.order = startOrder++;
      seedData[jsIndex].topics.push(cat);
    }
    
    fs.writeFileSync(dataPath, JSON.stringify(seedData, null, 2));
    console.log(`Added ${outputTopics.length} output-based topics to seed-data.json`);

  } catch (error) {
    console.error("Migration error:", error);
  } finally {
    mongoose.disconnect();
  }
}

addOutputQuestions();
