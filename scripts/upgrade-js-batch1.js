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
    title: "JavaScript Fundamentals",
    content: `
      <h2>1. JavaScript Engine & Runtime</h2>
      <p>JavaScript is a high-level, interpreted language. The <strong>Engine</strong> (e.g., V8 in Chrome) parses code, converts it to an Abstract Syntax Tree (AST), and compiles it to machine code via a Just-In-Time (JIT) compiler. The <strong>Runtime</strong> includes the engine, Web APIs (DOM, setTimeout), the Callback Queue, and the Event Loop.</p>
      
      <h2>2. Variables (var, let, const)</h2>
      <ul>
        <li><code>var</code>: Function-scoped, hoisted and initialized with <code>undefined</code>.</li>
        <li><code>let</code>: Block-scoped, hoisted but kept in the Temporal Dead Zone (TDZ). Can be reassigned.</li>
        <li><code>const</code>: Block-scoped, hoisted but kept in TDZ. Cannot be reassigned.</li>
      </ul>
      <pre><code>
// Example
console.log(a); // undefined
var a = 5;

// console.log(b); // ReferenceError: Cannot access 'b' before initialization
let b = 10;
      </code></pre>

      <h2>3. Data Types & Equality</h2>
      <p>Primitives: <code>string, number, boolean, null, undefined, symbol, bigint</code>. Reference types: Objects, Arrays, Functions.</p>
      <p><strong>== (Loose Equality)</strong> performs type coercion. <strong>=== (Strict Equality)</strong> does not.</p>
      <pre><code>
console.log(5 == "5"); // true
console.log(5 === "5"); // false
console.log(typeof null); // "object" (historic bug)
      </code></pre>
    `,
    questions: [
      { text: "What is the result of `typeof null` in JavaScript?", options: ["null", "undefined", "object", "string"], correctAnswer: "object", difficulty: "Easy", explanation: "Due to a legacy bug in JavaScript, typeof null returns 'object'." },
      { text: "Which keyword declares a block-scoped variable that can be reassigned?", options: ["var", "let", "const", "function"], correctAnswer: "let", difficulty: "Easy", explanation: "let is block-scoped and allows reassignment, unlike const." },
      { text: "What is the output of `[] == ![]`?", options: ["true", "false", "TypeError", "undefined"], correctAnswer: "true", difficulty: "Medium", explanation: "![] evaluates to false. [] == false coerces [] to an empty string '', and false to 0. '' == 0 coerces to 0 == 0, which is true." },
      { text: "Which of the following describes the Temporal Dead Zone (TDZ)?", options: ["A time where var declarations are paused", "The period between a let/const declaration and its initialization", "When the event loop is blocked", "A memory leak"], correctAnswer: "The period between a let/const declaration and its initialization", difficulty: "Medium", explanation: "Variables declared with let and const exist in the TDZ from the start of the block until the declaration is processed." },
      { text: "What does a JIT (Just-In-Time) compiler do in the V8 engine?", options: ["Compiles code to binary on a server", "Interprets code line-by-line without compiling", "Compiles code during execution for optimization", "Transpiles ES6 to ES5"], correctAnswer: "Compiles code during execution for optimization", difficulty: "Hard", explanation: "JIT compilation combines interpretation and compilation, translating code into machine code during execution and optimizing hot paths." },
      { text: "What is the output of `console.log(1 < 2 < 3)` and `console.log(3 > 2 > 1)`?", options: ["true, true", "false, false", "true, false", "false, true"], correctAnswer: "true, false", difficulty: "Hard", explanation: "1 < 2 evaluates to true. true < 3 coerces true to 1, so 1 < 3 is true. 3 > 2 evaluates to true. true > 1 coerces true to 1, so 1 > 1 is false." }
    ]
  },
  {
    title: "Scope & Execution",
    content: `
      <h2>1. Lexical Scope & Scope Chain</h2>
      <p>JavaScript uses Lexical Scoping, meaning variable scope is determined by where variables and blocks are physically written in the code. When a variable isn't found in the current scope, the engine looks up the <strong>Scope Chain</strong> to the parent scope, all the way to the Global Scope.</p>

      <h2>2. Execution Context</h2>
      <p>Everything in JS runs inside an Execution Context. The Global Execution Context is created by default. A Function Execution Context is created when a function is invoked.</p>
      <p><strong>Phase 1: Memory Creation Phase (Hoisting)</strong> - Variables and functions are allocated in memory.</p>
      <p><strong>Phase 2: Code Execution Phase</strong> - Code is executed line by line.</p>

      <h2>3. Call Stack</h2>
      <p>The Call Stack manages Execution Contexts using a Last-In-First-Out (LIFO) structure. The currently executing function is always at the top of the stack.</p>
      <pre><code>
function first() {
  second();
  console.log("First");
}
function second() {
  console.log("Second");
}
first(); 
// Output: "Second", then "First"
// Stack trace: Global -> first() -> second() -> pop second() -> pop first()
      </code></pre>
    `,
    questions: [
      { text: "What is Lexical Scoping?", options: ["Scope determined by the function caller at runtime", "Scope determined by where variables are declared in the source code", "Scope that is restricted to the browser window", "Scope determined by the this keyword"], correctAnswer: "Scope determined by where variables are declared in the source code", difficulty: "Easy", explanation: "Lexical scope means scope is defined at lexing time (compile time) based on where things are physically written." },
      { text: "What data structure does the JavaScript engine use to keep track of function execution?", options: ["Queue", "Linked List", "Tree", "Stack"], correctAnswer: "Stack", difficulty: "Easy", explanation: "The Call Stack uses a LIFO (Last In, First Out) structure to manage execution contexts." },
      { text: "During the Memory Creation Phase of an Execution Context, what value is assigned to `var` declarations?", options: ["null", "undefined", "The assigned value in the code", "ReferenceError"], correctAnswer: "undefined", difficulty: "Medium", explanation: "Variables declared with var are hoisted and initially set to undefined during the creation phase." },
      { text: "What happens when a variable is not found in the current scope?", options: ["A ReferenceError is immediately thrown", "The engine looks down the scope chain to child scopes", "The engine looks up the scope chain to parent scopes", "The variable is automatically created in the current scope"], correctAnswer: "The engine looks up the scope chain to parent scopes", difficulty: "Medium", explanation: "The scope chain defines how variables are resolved. It travels upwards from inner scopes to outer scopes." },
      { text: "What is Variable Shadowing?", options: ["When a variable is hidden by the TDZ", "When an inner scope declares a variable with the same name as an outer scope variable", "When a variable is garbage collected", "When a variable is hoisted"], correctAnswer: "When an inner scope declares a variable with the same name as an outer scope variable", difficulty: "Hard", explanation: "Shadowing occurs when a local variable shares the same name as a variable in the outer scope, effectively 'hiding' the outer variable." },
      { text: "What happens if the Call Stack exceeds its maximum size?", options: ["The Event Loop crashes", "A RangeError: Maximum call stack size exceeded is thrown", "The browser allocates more memory automatically", "The oldest context is dropped"], correctAnswer: "A RangeError: Maximum call stack size exceeded is thrown", difficulty: "Hard", explanation: "This is known as a stack overflow, typically caused by infinite recursion, resulting in a RangeError." }
    ]
  },
  {
    title: "Functions & Closures",
    content: `
      <h2>1. Higher-Order Functions</h2>
      <p>Functions in JS are first-class citizens, meaning they can be assigned to variables, passed as arguments, and returned from other functions. A <strong>Higher-Order Function</strong> is a function that takes a function as an argument or returns one.</p>

      <h2>2. Pure Functions</h2>
      <p>A pure function always produces the same output for the same input and produces no side effects (e.g., modifying global state or DOM).</p>

      <h2>3. Closures</h2>
      <p>A <strong>Closure</strong> is a function that remembers its outer variables and can access them even after the outer function has finished executing. The inner function preserves the lexical scope of the outer function.</p>
      <pre><code>
// Closure for Data Privacy
function createCounter() {
  let count = 0; // Private variable
  return function() {
    count++;
    return count;
  }
}
const counter = createCounter();
console.log(counter()); // 1
console.log(counter()); // 2
      </code></pre>
    `,
    questions: [
      { text: "What is a Higher-Order Function?", options: ["A function that executes very fast", "A function that takes another function as an argument or returns a function", "A function that runs asynchronously", "A function declared inside an object"], correctAnswer: "A function that takes another function as an argument or returns a function", difficulty: "Easy", explanation: "Because functions are first-class citizens in JS, they can be treated like any other variable, allowing higher-order functions." },
      { text: "What is a Closure?", options: ["A function that is immediately invoked", "A function bundled with its lexical environment", "A function that has no side effects", "A loop that terminates"], correctAnswer: "A function bundled with its lexical environment", difficulty: "Easy", explanation: "A closure allows an inner function to access an outer function's scope even after the outer function has returned." },
      { text: "What is the primary benefit of using closures in JavaScript?", options: ["They make code execute faster", "They allow for data privacy and encapsulation", "They prevent the Event Loop from blocking", "They act as a substitute for Promises"], correctAnswer: "They allow for data privacy and encapsulation", difficulty: "Medium", explanation: "Closures allow you to create private variables that cannot be accessed or modified directly from the outside." },
      { text: "Which of the following is an example of an IIFE (Immediately Invoked Function Expression)?", options: ["function fn() { }()", "(function() { })()", "let fn = function() { }", "setTimeout(() => {}, 0)"], correctAnswer: "(function() { })()", difficulty: "Medium", explanation: "An IIFE is defined inside parentheses to make it an expression, followed by () to invoke it immediately." },
      { text: "What is Function Currying?", options: ["Binding `this` to a function", "Translating a function with multiple arguments into a sequence of nested functions each taking a single argument", "Executing a function recursively", "Caching the results of a function"], correctAnswer: "Translating a function with multiple arguments into a sequence of nested functions each taking a single argument", difficulty: "Hard", explanation: "Currying transforms a function like f(a, b, c) into f(a)(b)(c)." },
      { text: "What is the output of this closure loop? `for (var i = 0; i < 3; i++) { setTimeout(() => console.log(i), 0); }`", options: ["0, 1, 2", "3, 3, 3", "undefined, undefined, undefined", "ReferenceError"], correctAnswer: "3, 3, 3", difficulty: "Hard", explanation: "Because `var` is function scoped, there is only one `i` binding. The loop finishes synchronously making `i = 3` before any of the asynchronous setTimeouts run." }
    ]
  }
];

async function applyBatch1() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("Connected to DB.");

    // Delete old overlapping topics from DB
    const oldTitles = [
      "Variables, Scope, and Hoisting", 
      "Closures", 
      "JavaScript Fundamentals", 
      "Scope & Execution", 
      "Functions"
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

    // Insert upgraded topics
    let orderCounter = 1;
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

    // We also need to rewrite seed-data.json so it matches the DB and we don't duplicate on next run
    const dataPath = path.resolve(__dirname, '../data/seed-data.json');
    let seedData = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));
    const jsIndex = seedData.findIndex(t => t.name === "JavaScript");
    
    // Filter out the old overlapping ones
    seedData[jsIndex].topics = seedData[jsIndex].topics.filter(t => !oldTitles.includes(t.title));
    
    // Prepend the upgraded ones
    for (let i = upgradedTopics.length - 1; i >= 0; i--) {
      upgradedTopics[i].order = i + 1;
      seedData[jsIndex].topics.unshift(upgradedTopics[i]);
    }
    
    // Fix orders
    seedData[jsIndex].topics.forEach((t, i) => t.order = i + 1);

    fs.writeFileSync(dataPath, JSON.stringify(seedData, null, 2));
    console.log("seed-data.json updated successfully.");

  } catch (error) {
    console.error("Migration error:", error);
  } finally {
    mongoose.disconnect();
  }
}

applyBatch1();
