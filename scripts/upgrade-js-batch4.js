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
    title: "DOM & Browser APIs",
    content: `
      <h2>1. The DOM (Document Object Model)</h2>
      <p>The DOM is an object-oriented representation of the web page. We use JS to select elements (<code>querySelector</code>) and modify them.</p>
      
      <h2>2. Event Propagation</h2>
      <p>When an event occurs, it travels through the DOM tree in three phases:</p>
      <ol>
        <li><strong>Capturing Phase:</strong> Travels down from the window to the target.</li>
        <li><strong>Target Phase:</strong> Reaches the target element.</li>
        <li><strong>Bubbling Phase:</strong> Bubbles up from the target back to the window.</li>
      </ol>
      <p><strong>Event Delegation</strong> is the pattern of attaching a single event listener to a parent element to catch bubbling events from its children.</p>

      <h2>3. Web Storage</h2>
      <p><code>localStorage</code> (persists until deleted, ~5MB) vs <code>sessionStorage</code> (cleared when tab closes).</p>
    `,
    questions: [
      { text: "What is the difference between event bubbling and event capturing?", options: ["Bubbling goes from target to root, capturing goes from root to target", "Capturing goes from target to root, bubbling goes from root to target", "They are the same thing", "Capturing stops the event, bubbling does not"], correctAnswer: "Bubbling goes from target to root, capturing goes from root to target", difficulty: "Easy", explanation: "Event bubbling propagates upwards. Capturing propagates downwards." },
      { text: "Which method prevents an event from propagating further in the capturing and bubbling phases?", options: ["event.preventDefault()", "event.stopPropagation()", "event.cancel()", "event.stopImmediatePropagation()"], correctAnswer: "event.stopPropagation()", difficulty: "Easy", explanation: "stopPropagation() stops the event from moving up or down the DOM tree." },
      { text: "What is the storage capacity limit for LocalStorage in most modern browsers?", options: ["~5MB", "~50MB", "Unlimited", "4KB"], correctAnswer: "~5MB", difficulty: "Medium", explanation: "LocalStorage is limited to about 5MB per origin." },
      { text: "What does `event.preventDefault()` do?", options: ["Stops event bubbling", "Prevents the default browser action for that event", "Removes the event listener", "Refreshes the page"], correctAnswer: "Prevents the default browser action for that event", difficulty: "Medium", explanation: "It stops things like form submissions from reloading the page or links from navigating." },
      { text: "What is Event Delegation?", options: ["Passing events to a Web Worker", "Attaching a single event listener to a parent element to handle events from multiple dynamic children", "Preventing the default action", "Stopping event propagation entirely"], correctAnswer: "Attaching a single event listener to a parent element to handle events from multiple dynamic children", difficulty: "Hard", explanation: "Event delegation leverages event bubbling to handle events efficiently at a higher level, which is great for dynamically added elements." },
      { text: "How can you attach an event listener that triggers during the Capturing phase rather than the Bubbling phase?", options: ["element.addEventListener('click', fn, true)", "element.addEventListener('click', fn, false)", "element.oncapture = fn", "It's not possible in modern browsers"], correctAnswer: "element.addEventListener('click', fn, true)", difficulty: "Hard", explanation: "Passing `true` as the third argument to addEventListener (the `useCapture` flag) sets the listener to trigger during the capturing phase." }
    ]
  },
  {
    title: "Modules & Memory Management",
    content: `
      <h2>1. JavaScript Modules</h2>
      <p>Modules allow splitting code into separate files. <strong>ES Modules (ESM)</strong> use <code>import / export</code>. <strong>CommonJS (CJS)</strong> uses <code>require() / module.exports</code> (common in older Node.js).</p>
      
      <h2>2. Memory & Garbage Collection</h2>
      <p>Memory is allocated in the <strong>Stack</strong> (static data, primitives) and the <strong>Heap</strong> (objects, arrays). JS automatically clears unused memory using a Garbage Collector.</p>
      <p>The most common GC algorithm is <strong>Mark-and-Sweep</strong>. It starts at the roots (global object) and marks all reachable objects. Unreachable objects are swept away.</p>

      <h2>3. Memory Leaks</h2>
      <p>Common causes of memory leaks include accidental global variables, uncleared intervals/timers, and unremoved event listeners holding references to DOM elements.</p>
    `,
    questions: [
      { text: "Which syntax is used for importing a module in standard ES Modules (ES6)?", options: ["require('module')", "import { x } from 'module'", "include 'module'", "fetch('module')"], correctAnswer: "import { x } from 'module'", difficulty: "Easy", explanation: "ES Modules use the import and export keywords." },
      { text: "Where are primitive values and execution contexts stored in memory?", options: ["The Heap", "The Stack", "The Event Loop", "The Web APIs"], correctAnswer: "The Stack", difficulty: "Easy", explanation: "The Stack handles static memory allocation (primitives and function calls), while the Heap handles dynamic memory (objects)." },
      { text: "What is the primary Garbage Collection algorithm used by modern JavaScript engines?", options: ["Reference Counting", "Mark-and-Sweep", "Manual Allocation", "First-In-First-Out"], correctAnswer: "Mark-and-Sweep", difficulty: "Medium", explanation: "Mark-and-Sweep finds all reachable objects starting from the global root. Anything unreachable is collected." },
      { text: "Which keyword is used in ES Modules to export a single, fallback value from a module?", options: ["export default", "module.exports", "export single", "export all"], correctAnswer: "export default", difficulty: "Medium", explanation: "export default allows you to export exactly one default value from a file." },
      { text: "What is a common cause of a memory leak in a Single Page Application (SPA)?", options: ["Using `let` instead of `var`", "Failing to call `removeEventListener` when a component unmounts", "Using too many Arrow Functions", "Using the Fetch API"], correctAnswer: "Failing to call `removeEventListener` when a component unmounts", difficulty: "Hard", explanation: "If an event listener references a DOM element or component state and is never removed, it prevents the Garbage Collector from freeing that memory even after the component is gone." },
      { text: "Why might you use a `WeakMap` instead of a standard `Map`?", options: ["WeakMap allows garbage collection of its keys if there are no other references to them", "WeakMap is faster for iterating", "WeakMap supports primitive keys", "WeakMap is synchronous"], correctAnswer: "WeakMap allows garbage collection of its keys if there are no other references to them", difficulty: "Hard", explanation: "WeakMaps hold 'weak' references to object keys. If the object key is deleted elsewhere, it gets garbage collected from the WeakMap too, preventing memory leaks." }
    ]
  },
  {
    title: "Functional Programming & Error Handling",
    content: `
      <h2>1. Functional Programming Concepts</h2>
      <p><strong>Pure Functions:</strong> No side effects, same input = same output.</p>
      <p><strong>Immutability:</strong> Data should not be changed after creation. Instead, create new copies.</p>
      <p><strong>Currying:</strong> Transforming a function with multiple arguments into a sequence of functions, each taking a single argument.</p>

      <h2>2. Error Handling</h2>
      <p>Errors are handled using <code>try...catch...finally</code> blocks. You can create custom errors by extending the <code>Error</code> class.</p>
      <pre><code>
try {
  throw new Error("Something broke!");
} catch (error) {
  console.log(error.message);
} finally {
  console.log("Runs no matter what.");
}
      </code></pre>
    `,
    questions: [
      { text: "What is a Pure Function?", options: ["A function that returns undefined", "A function with no side effects that always returns the same output for the same input", "A function that uses var", "An anonymous function"], correctAnswer: "A function with no side effects that always returns the same output for the same input", difficulty: "Easy", explanation: "Pure functions do not mutate external state and are highly predictable." },
      { text: "What happens in a `finally` block?", options: ["It only runs if an error occurs", "It only runs if no error occurs", "It executes regardless of whether an exception is thrown or caught", "It catches asynchronous errors"], correctAnswer: "It executes regardless of whether an exception is thrown or caught", difficulty: "Easy", explanation: "The finally block is used for cleanup code and runs unconditionally after try and catch." },
      { text: "What is Currying in JavaScript?", options: ["Evaluating a function with multiple arguments as a sequence of functions, each taking a single argument", "Binding 'this' to a function permanently", "Creating an infinite loop", "A performance optimization technique"], correctAnswer: "Evaluating a function with multiple arguments as a sequence of functions, each taking a single argument", difficulty: "Medium", explanation: "Currying transforms a function f(a, b, c) into f(a)(b)(c)." },
      { text: "Does a `finally` block execute if a `return` statement is inside the `try` block?", options: ["Yes, always", "No, it skips finally", "Only if an error is thrown", "It causes a syntax error"], correctAnswer: "Yes, always", difficulty: "Medium", explanation: "The finally block executes even if a return statement is encountered in the try or catch blocks." },
      { text: "In Functional Programming, what is 'Referential Transparency'?", options: ["The ability to access private variables", "An expression that can be replaced with its corresponding value without changing the program's behavior", "When functions return functions", "When a variable is hoisted"], correctAnswer: "An expression that can be replaced with its corresponding value without changing the program's behavior", difficulty: "Hard", explanation: "Referential transparency implies that a function is pure and evaluating it gives the same value for the same arguments every time." },
      { text: "How do you correctly handle an error inside an asynchronous `setTimeout` callback using `try...catch`?", options: ["Wrap the setTimeout call in a try...catch", "Wrap the code INSIDE the setTimeout callback in a try...catch", "Use Promise.catch()", "Errors in setTimeout cannot be caught"], correctAnswer: "Wrap the code INSIDE the setTimeout callback in a try...catch", difficulty: "Hard", explanation: "A try...catch block is synchronous. By the time the setTimeout callback runs on the Event Loop, the surrounding try...catch has already finished executing. The try...catch must be inside the callback." }
    ]
  }
];

async function applyBatch4() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("Connected to DB.");

    // Delete old overlapping topics from DB
    const oldTitles = [
      "DOM & Browser APIs",
      "DOM",
      "Browser APIs",
      "Modules",
      "Memory Management",
      "Error Handling",
      "Iterators & Generators",
      "Functional Programming",
      "Advanced JavaScript",
      "Performance"
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

    // Determine starting order (Batch 3 finished at 10, start at 11)
    let orderCounter = 11;
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
    
    // Insert the new ones at index 10
    seedData[jsIndex].topics.splice(10, 0, ...upgradedTopics);
    
    // Fix orders for all
    seedData[jsIndex].topics.forEach((t, i) => t.order = i + 1);

    fs.writeFileSync(dataPath, JSON.stringify(seedData, null, 2));
    console.log("seed-data.json updated successfully for Batch 4.");

  } catch (error) {
    console.error("Migration error:", error);
  } finally {
    mongoose.disconnect();
  }
}

applyBatch4();
