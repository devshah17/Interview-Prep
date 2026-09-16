const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
require('dotenv').config({ path: '.env' });

const MONGODB_URI = process.env.MONGODB_URI;

const topicSchema = new mongoose.Schema({ techId: mongoose.Schema.Types.ObjectId, title: String, content: String, order: Number });
const Topic = mongoose.models.Topic || mongoose.model("Topic", topicSchema);
const questionSchema = new mongoose.Schema({ techId: mongoose.Schema.Types.ObjectId, topicId: mongoose.Schema.Types.ObjectId, text: String, options: [String], correctAnswer: String, difficulty: String, explanation: String });
const Question = mongoose.models.Question || mongoose.model("Question", questionSchema);
const technologySchema = new mongoose.Schema({ name: String, description: String });
const Technology = mongoose.models.Technology || mongoose.model("Technology", technologySchema);

const upgradedTopics = [
  {
    title: "Strings & Regex",
    content: `
      <h2>1. String Methods</h2>
      <p>Strings are immutable primitives. Important methods include <code>split()</code>, <code>slice()</code>, <code>substring()</code>, <code>replace()</code>, <code>trim()</code>, and <code>includes()</code>.</p>
      
      <h2>2. Template Literals</h2>
      <p>Introduced in ES6, they use backticks and allow multi-line strings and interpolation using <code>\${expression}</code>.</p>
      <pre><code>
const name = "World";
console.log(\`Hello, \${name}!\`);
      </code></pre>

      <h2>3. Regular Expressions (Regex)</h2>
      <p>Used for pattern matching. Flags include <code>g</code> (global), <code>i</code> (case-insensitive), and <code>m</code> (multiline).</p>
      <ul>
        <li><code>^</code> matches the beginning of input.</li>
        <li><code>$</code> matches the end of input.</li>
        <li><code>+</code> matches 1 or more times.</li>
        <li><code>*</code> matches 0 or more times.</li>
      </ul>
    `,
    questions: [
      { text: "Which string method extracts a section of a string and returns it as a new string, without modifying the original string?", options: ["splice()", "slice()", "split()", "trim()"], correctAnswer: "slice()", difficulty: "Easy", explanation: "slice(start, end) extracts a portion of a string. splice() is an array method, not a string method." },
      { text: "What syntax is used for string interpolation in ES6 template literals?", options: ["#{expression}", "${expression}", "<%= expression %>", "{{expression}}"], correctAnswer: "${expression}", difficulty: "Easy", explanation: "Template literals use backticks and ${} to embed expressions." },
      { text: "What is the difference between `substring()` and `substr()`?", options: ["They are identical", "substring takes a start and end index; substr takes a start index and a length", "substr takes a start and end index; substring takes a start index and a length", "substr is an array method"], correctAnswer: "substring takes a start and end index; substr takes a start index and a length", difficulty: "Medium", explanation: "Note: substr() is considered legacy and its use should be avoided in modern code." },
      { text: "What does the regular expression flag 'i' do?", options: ["Global search", "Case-insensitive search", "Multiline search", "Stops at the first match"], correctAnswer: "Case-insensitive search", difficulty: "Medium", explanation: "The 'i' flag ignores case when matching letters." },
      { text: "In regular expressions, what does a Lookahead `(?=...)` do?", options: ["Asserts that what immediately follows the current position in the string matches the pattern, without consuming characters", "Searches the string backwards", "Replaces the pattern with the specified string", "Matches any single character"], correctAnswer: "Asserts that what immediately follows the current position in the string matches the pattern, without consuming characters", difficulty: "Hard", explanation: "Lookaheads are zero-width assertions. They check if a pattern exists ahead without moving the regex pointer." },
      { text: "What is the output of `\"hello\".replace(/l/g, \"1\")`?", options: ["he1lo", "he11o", "hello", "11111"], correctAnswer: "he11o", difficulty: "Hard", explanation: "The 'g' flag ensures that all occurrences of 'l' are replaced with '1'." }
    ]
  },
  {
    title: "Modern ES6+",
    content: `
      <h2>1. Destructuring & Spread/Rest</h2>
      <p>Destructuring allows you to unpack values from arrays or properties from objects into distinct variables. The Rest operator (<code>...args</code>) collects multiple elements into a single array. The Spread operator expands iterables into individual elements.</p>

      <h2>2. Optional Chaining (?.) & Nullish Coalescing (??)</h2>
      <p>Optional chaining allows reading the value of a property located deep within a chain without throwing an error if a reference is nullish.</p>
      <p>Nullish Coalescing returns its right-hand side operand when its left-hand side is exactly <code>null</code> or <code>undefined</code>.</p>
      <pre><code>
const user = { profile: { name: "Alice" } };
console.log(user?.profile?.age ?? 25); // 25
      </code></pre>

      <h2>3. Collections (Map, Set)</h2>
      <p><code>Map</code> holds key-value pairs and remembers insertion order. Any value can be used as either a key or a value. <code>Set</code> lets you store unique values of any type.</p>
    `,
    questions: [
      { text: "What does the Spread operator (`...`) do when used on an array?", options: ["It condenses the array into a single string", "It expands the array elements into individual arguments/elements", "It reverses the array", "It creates a multi-dimensional array"], correctAnswer: "It expands the array elements into individual arguments/elements", difficulty: "Easy", explanation: "Spread 'unpacks' an iterable. E.g., Math.max(...[1, 2, 3]) becomes Math.max(1, 2, 3)." },
      { text: "Which modern feature safely accesses deeply nested object properties without throwing a TypeError?", options: ["Nullish Coalescing", "Optional Chaining", "Ternary Operator", "Spread Operator"], correctAnswer: "Optional Chaining", difficulty: "Easy", explanation: "Optional Chaining (?.) short-circuits and returns undefined if the property before it is null or undefined." },
      { text: "How is a Map different from a standard Object?", options: ["Maps can only have string keys", "Maps do not remember insertion order", "Maps allow keys of any data type (including objects and functions)", "Maps are strictly immutable"], correctAnswer: "Maps allow keys of any data type (including objects and functions)", difficulty: "Medium", explanation: "Unlike regular objects which convert keys to strings/symbols, Maps can use objects, functions, or any primitive as a key." },
      { text: "What happens when you add a duplicate value to a `Set`?", options: ["It throws an error", "It overwrites the entire Set", "It creates an array of that value", "It simply ignores the duplicate"], correctAnswer: "It simply ignores the duplicate", difficulty: "Medium", explanation: "A Set is a collection of unique values. Adding a duplicate has no effect." },
      { text: "What is the difference between `||` (Logical OR) and `??` (Nullish Coalescing)?", options: ["They are identical", "`||` returns the right side if the left is falsey (e.g., 0, ''); `??` only returns the right side if the left is strictly null or undefined", "`??` returns the right side if the left is falsey; `||` checks for null/undefined", "`??` is used for math operations"], correctAnswer: "`||` returns the right side if the left is falsey (e.g., 0, ''); `??` only returns the right side if the left is strictly null or undefined", difficulty: "Hard", explanation: "This is crucial when 0 or '' are valid values that shouldn't be overwritten by defaults." },
      { text: "What does the Rest operator do in function parameters? E.g., `function foo(a, ...b) {}`", options: ["It creates a copy of the arguments object", "It collects all remaining arguments into an array", "It expands an array into individual arguments", "It stops the function execution"], correctAnswer: "It collects all remaining arguments into an array", difficulty: "Hard", explanation: "In function definitions, ...b gathers the rest of the comma-separated arguments into a standard array named b." }
    ]
  },
  {
    title: "Asynchronous JavaScript",
    content: `
      <h2>1. The Event Loop</h2>
      <p>JS is single-threaded. It handles concurrency using the Event Loop. Synchronous code executes first on the Call Stack. Asynchronous callbacks are sent to the Web APIs, then to Queues.</p>
      <ul>
        <li><strong>Microtask Queue:</strong> Promises (<code>.then</code>, <code>catch</code>, <code>finally</code>), <code>queueMicrotask</code>, <code>MutationObserver</code>.</li>
        <li><strong>Macrotask Queue:</strong> <code>setTimeout</code>, <code>setInterval</code>, DOM events, fetch callbacks.</li>
      </ul>
      <p><em>The Event Loop empties the entire Microtask queue before running a single Macrotask.</em></p>

      <h2>2. Promises</h2>
      <p>A Promise represents the eventual completion (or failure) of an asynchronous operation. It has three states: Pending, Fulfilled, or Rejected.</p>
      <pre><code>
Promise.resolve(1)
  .then(res => res * 2)
  .then(res => console.log(res)); // 2
      </code></pre>

      <h2>3. Async / Await</h2>
      <p>Syntactic sugar over Promises. An <code>async</code> function always returns a Promise. The <code>await</code> keyword pauses the execution of the async function until the Promise settles.</p>
    `,
    questions: [
      { text: "What are the three possible states of a Promise?", options: ["Running, Paused, Stopped", "Pending, Fulfilled, Rejected", "Waiting, Resolving, Catching", "Sync, Async, Await"], correctAnswer: "Pending, Fulfilled, Rejected", difficulty: "Easy", explanation: "A Promise starts as Pending, and then settles into either a Fulfilled (success) or Rejected (failure) state." },
      { text: "What keyword is used to pause the execution of an async function until a Promise settles?", options: ["pause", "wait", "yield", "await"], correctAnswer: "await", difficulty: "Easy", explanation: "The await keyword blocks the execution of code within the async function until the awaited Promise is resolved or rejected." },
      { text: "Which queue has a higher priority in the Event Loop?", options: ["Macrotask Queue", "Microtask Queue", "Callback Queue", "They have equal priority"], correctAnswer: "Microtask Queue", difficulty: "Medium", explanation: "After the Call Stack is empty, the Event Loop will process all tasks in the Microtask Queue before moving on to the Macrotask Queue." },
      { text: "What happens if a Promise in `Promise.all()` rejects?", options: ["It waits for the others to finish and returns an array of successes", "The entire Promise.all rejects immediately with that error", "It throws a syntax error", "It ignores the error and continues"], correctAnswer: "The entire Promise.all rejects immediately with that error", difficulty: "Medium", explanation: "Promise.all() has fail-fast behavior. If one rejects, the whole thing rejects immediately. Use Promise.allSettled() if you want to wait for all regardless of failure." },
      { text: "What does `Promise.race()` do?", options: ["Returns the first Promise to fulfill, ignoring rejections", "Returns the first Promise to settle (either fulfill or reject)", "Runs Promises sequentially", "Slows down Promise execution for debugging"], correctAnswer: "Returns the first Promise to settle (either fulfill or reject)", difficulty: "Hard", explanation: "Promise.race() resolves or rejects as soon as the *first* promise in the iterable resolves or rejects." },
      { text: "What is the output? `setTimeout(()=>console.log('A'),0); Promise.resolve().then(()=>console.log('B')); console.log('C');`", options: ["A, B, C", "C, A, B", "C, B, A", "B, C, A"], correctAnswer: "C, B, A", difficulty: "Hard", explanation: "'C' is sync (Call Stack). 'B' is a microtask (Promise). 'A' is a macrotask (setTimeout). Order is Stack -> Micro -> Macro." }
    ]
  }
];

async function applyBatch3() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("Connected to DB.");

    // Delete old overlapping topics from DB
    const oldTitles = [
      "Strings & Regex", 
      "Modern ES6+", 
      "Asynchronous JavaScript",
      "Asynchronous JS: Event Loop & Promises" // an old duplicate
    ];
    
    const jsTech = await Technology.findOne({ name: "JavaScript" });
    if (!jsTech) return;

    for (const title of oldTitles) {
      const topics = await Topic.find({ techId: jsTech._id, title: title });
      for (const t of topics) {
        await Question.deleteMany({ topicId: t._id });
        await Topic.deleteOne({ _id: t._id });
      }
    }

    // Determine starting order (Batch 2 finished at order 7, so we start at 8)
    let orderCounter = 8;
    for (const newT of upgradedTopics) {
      const createdTopic = await Topic.create({
        techId: jsTech._id,
        title: newT.title,
        content: newT.content,
        order: orderCounter++
      });

      for (const q of newT.questions) {
        await Question.create({
          techId: jsTech._id,
          topicId: createdTopic._id,
          text: q.text,
          options: q.options,
          correctAnswer: q.correctAnswer,
          difficulty: q.difficulty,
          explanation: q.explanation
        });
      }
      console.log(`Upgraded Topic added: ${createdTopic.title} (with 6 questions)`);
    }

    // Update seed-data.json
    const dataPath = path.resolve(__dirname, '../data/seed-data.json');
    let seedData = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));
    const jsIndex = seedData.findIndex(t => t.name === "JavaScript");
    
    // Filter out the old overlapping ones
    seedData[jsIndex].topics = seedData[jsIndex].topics.filter(t => !oldTitles.includes(t.title));
    
    // Insert the new ones at index 7
    seedData[jsIndex].topics.splice(7, 0, ...upgradedTopics);
    
    // Fix orders for all
    seedData[jsIndex].topics.forEach((t, i) => t.order = i + 1);

    fs.writeFileSync(dataPath, JSON.stringify(seedData, null, 2));
    console.log("seed-data.json updated successfully for Batch 3.");

  } catch (error) {
    console.error("Migration error:", error);
  } finally {
    mongoose.disconnect();
  }
}

applyBatch3();
