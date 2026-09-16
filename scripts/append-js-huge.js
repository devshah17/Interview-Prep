const fs = require('fs');
const path = require('path');

const dataPath = path.resolve(__dirname, '../data/seed-data.json');
let seedData = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));

const jsIndex = seedData.findIndex(t => t.name === "JavaScript");

if (jsIndex === -1) {
  console.error("JavaScript technology not found in seed-data.json");
  process.exit(1);
}

const jsCategories = [
  {
    title: "1. JavaScript Fundamentals",
    content: "<h2>Fundamentals</h2><p>Covers JS execution context, runtime, engine, var/let/const, data types, type coercion, equality (== vs ===), truthy/falsy, null/undefined, and BigInt.</p>",
    questions: [
      { text: "What is the difference between null and undefined?", options: ["null is an object, undefined is a type", "They are identical in every way", "undefined is assigned by the developer, null by the engine", "undefined is used for math operations"], correctAnswer: "null is an object, undefined is a type", difficulty: "Easy", explanation: "typeof null is 'object', whereas typeof undefined is 'undefined'. undefined means a variable has been declared but not defined yet." }
    ]
  },
  {
    title: "2. Scope & Execution",
    content: "<h2>Scope & Execution</h2><p>Includes Global/Function/Block/Lexical Scope, Scope Chain, Hoisting, Temporal Dead Zone, Call Stack, and Environment Records.</p>",
    questions: [
      { text: "What is the Temporal Dead Zone (TDZ)?", options: ["A time where var declarations are paused", "The period between a let/const declaration and its initialization", "When the event loop is blocked", "A memory leak"], correctAnswer: "The period between a let/const declaration and its initialization", difficulty: "Medium", explanation: "Variables declared with let and const exist in the TDZ from the start of the block until the declaration is processed." }
    ]
  },
  {
    title: "3. Functions",
    content: "<h2>Functions</h2><p>Declarations, expressions, arrows, IIFE, higher-order functions, callbacks, pure functions, currying, and memoization.</p>",
    questions: [
      { text: "What is a Pure Function?", options: ["A function that returns undefined", "A function with no side effects that always returns the same output for the same input", "A function that uses var", "An anonymous function"], correctAnswer: "A function with no side effects that always returns the same output for the same input", difficulty: "Medium", explanation: "Pure functions do not mutate external state and are highly predictable." }
    ]
  },
  {
    title: "4. Closures",
    content: "<h2>Closures</h2><p>Lexical closures, data privacy, loops, and memory implications.</p>",
    questions: [
      { text: "How can closures be used for data privacy?", options: ["By encrypting variables", "By returning inner functions that access variables scoped to the outer function", "By using the private keyword", "By using const"], correctAnswer: "By returning inner functions that access variables scoped to the outer function", difficulty: "Medium", explanation: "Because the inner function retains access to the outer function's scope, you can hide variables from the global scope." }
    ]
  },
  {
    title: "5. Objects",
    content: "<h2>Objects</h2><p>Creation, property descriptors, computed properties, destructuring, spread, optional chaining, Object.keys/values/entries, Object.freeze vs seal.</p>",
    questions: [
      { text: "What is the difference between Object.freeze() and Object.seal()?", options: ["freeze allows modifying existing properties, seal does not", "seal allows modifying existing properties, freeze does not", "They are exactly the same", "freeze is for arrays, seal is for objects"], correctAnswer: "seal allows modifying existing properties, freeze does not", difficulty: "Hard", explanation: "Object.seal() prevents adding/removing properties but allows changing existing ones. freeze() makes the object completely immutable." }
    ]
  },
  {
    title: "6. Prototypes & Inheritance",
    content: "<h2>Prototypes</h2><p>Prototype chain, __proto__, Object.create(), classical vs prototypal inheritance, ES6 classes, super, getters/setters.</p>",
    questions: [
      { text: "What does the `super` keyword do in an ES6 class?", options: ["Calls the parent class's constructor", "References the global object", "Throws an error", "Returns the current instance"], correctAnswer: "Calls the parent class's constructor", difficulty: "Medium", explanation: "In a derived class, you must call super() before you can use 'this'." }
    ]
  },
  {
    title: "7. `this` Keyword",
    content: "<h2>this Context</h2><p>this in global/functions/arrows/objects, call(), apply(), bind(), explicit vs implicit binding.</p>",
    questions: [
      { text: "How does `this` work in an arrow function?", options: ["It refers to the object calling it", "It is always undefined", "It lexically binds to the enclosing scope", "It refers to the global window object"], correctAnswer: "It lexically binds to the enclosing scope", difficulty: "Medium", explanation: "Arrow functions do not bind their own `this`, they inherit it from the parent scope." }
    ]
  },
  {
    title: "8. Arrays",
    content: "<h2>Arrays</h2><p>map, filter, reduce, forEach, some, every, includes, flat, splice vs slice, mutable vs immutable methods.</p>",
    questions: [
      { text: "Which array method mutates the original array?", options: ["slice()", "map()", "filter()", "splice()"], correctAnswer: "splice()", difficulty: "Easy", explanation: "splice() modifies the array in place, while slice(), map(), and filter() return new arrays." }
    ]
  },
  {
    title: "9. Strings & Regex",
    content: "<h2>Strings</h2><p>Template literals, substring vs substr, split, replace, trim, and regular expressions.</p>",
    questions: [
      { text: "What will `\"hello\".split(\"\")` output?", options: ["['hello']", "['h', 'e', 'l', 'l', 'o']", "An error", "'hello'"], correctAnswer: "['h', 'e', 'l', 'l', 'o']", difficulty: "Easy", explanation: "Passing an empty string to split() separates the string into an array of individual characters." }
    ]
  },
  {
    title: "10. Modern ES6+",
    content: "<h2>Modern JS</h2><p>Modules, Promises, Symbols, Sets, Maps, WeakMaps, optional chaining, nullish coalescing.</p>",
    questions: [
      { text: "What does the nullish coalescing operator (??) do?", options: ["Returns the right operand when the left is null or undefined", "Returns the right operand when the left is falsy", "Throws an error if the left is null", "Coerces the value to boolean"], correctAnswer: "Returns the right operand when the left is null or undefined", difficulty: "Medium", explanation: "Unlike ||, which triggers on any falsy value (like 0 or ''), ?? only triggers on strictly null or undefined." }
    ]
  },
  {
    title: "11. Asynchronous JavaScript",
    content: "<h2>Async JS</h2><p>Callbacks, Promise states, chaining, Promise.all vs allSettled, race, any, async/await.</p>",
    questions: [
      { text: "What is the difference between Promise.all() and Promise.allSettled()?", options: ["Promise.all() rejects immediately if one promise fails; allSettled() waits for all to finish regardless of success/failure", "They are the same", "allSettled() only returns fulfilled promises", "Promise.all() cannot handle rejections"], correctAnswer: "Promise.all() rejects immediately if one promise fails; allSettled() waits for all to finish regardless of success/failure", difficulty: "Hard", explanation: "Promise.all() short-circuits on rejection. Promise.allSettled() always waits for everything and returns an array of objects describing the outcome of each promise." }
    ]
  },
  {
    title: "12. Browser APIs & DOM",
    content: "<h2>The Browser</h2><p>DOM selection, traversal, manipulation, event bubbling/capturing, delegation, LocalStorage, Fetch API, and Web Workers.</p>",
    questions: [
      { text: "What is Event Delegation?", options: ["Passing events to a web worker", "Attaching a single event listener to a parent element to handle events from multiple children", "Preventing the default action of an event", "Stopping event propagation entirely"], correctAnswer: "Attaching a single event listener to a parent element to handle events from multiple children", difficulty: "Medium", explanation: "Event delegation leverages event bubbling to handle events efficiently at a higher level in the DOM tree." }
    ]
  }
];

// Append giving order dynamically
let startOrder = seedData[jsIndex].topics.length + 1;
for (const cat of jsCategories) {
  cat.order = startOrder++;
  seedData[jsIndex].topics.push(cat);
}

fs.writeFileSync(dataPath, JSON.stringify(seedData, null, 2));
console.log(`Appended ${jsCategories.length} massive categories to JavaScript!`);
