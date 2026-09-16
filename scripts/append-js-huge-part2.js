const fs = require('fs');
const path = require('path');

const dataPath = path.resolve(__dirname, '../data/seed-data.json');
let seedData = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));

const jsIndex = seedData.findIndex(t => t.name === "JavaScript");

if (jsIndex === -1) {
  console.error("JavaScript technology not found in seed-data.json");
  process.exit(1);
}

const jsCategoriesPart2 = [
  {
    title: "13. DOM",
    content: "<h2>DOM</h2><p>Selecting elements, creating/modifying/removing elements, traversal, event bubbling, capturing, delegation, and custom events.</p>",
    questions: [
      { text: "What is the difference between event bubbling and event capturing?", options: ["Bubbling goes from target to root, capturing goes from root to target", "Capturing goes from target to root, bubbling goes from root to target", "They are the same thing", "Capturing stops the event, bubbling does not"], correctAnswer: "Bubbling goes from target to root, capturing goes from root to target", difficulty: "Medium", explanation: "In the event flow, capturing happens first (down the tree), followed by the target phase, followed by bubbling (up the tree)." }
    ]
  },
  {
    title: "14. Browser APIs",
    content: "<h2>Browser APIs</h2><p>Browser storage (LocalStorage, SessionStorage, Cookies, IndexedDB), Fetch API, Geolocation, Web Workers, and WebSockets.</p>",
    questions: [
      { text: "What is the storage limit for LocalStorage in most modern browsers?", options: ["~5MB", "~50MB", "Unlimited", "4KB"], correctAnswer: "~5MB", difficulty: "Easy", explanation: "LocalStorage typically allows around 5MB of storage per origin." }
    ]
  },
  {
    title: "15. Modules",
    content: "<h2>Modules</h2><p>ES Modules (import/export), Named vs Default exports, CommonJS (require), and circular dependencies.</p>",
    questions: [
      { text: "Which keyword is used in ES Modules to export a single, fallback value from a module?", options: ["export default", "module.exports", "export single", "export all"], correctAnswer: "export default", difficulty: "Easy", explanation: "export default allows you to export exactly one default value from a file." }
    ]
  },
  {
    title: "16. Memory Management",
    content: "<h2>Memory Management</h2><p>Stack vs Heap, Garbage Collection (Mark-and-Sweep), Memory Leaks, WeakMap, and WeakSet.</p>",
    questions: [
      { text: "Why might you use a WeakMap instead of a Map?", options: ["WeakMap allows garbage collection of its keys if there are no other references to them", "WeakMap is faster for iterating", "WeakMap supports primitive keys", "WeakMap is synchronous"], correctAnswer: "WeakMap allows garbage collection of its keys if there are no other references to them", difficulty: "Hard", explanation: "WeakMaps hold 'weak' references to key objects, meaning they do not prevent garbage collection if the key object is unreferenced elsewhere." }
    ]
  },
  {
    title: "17. Error Handling",
    content: "<h2>Error Handling</h2><p>try/catch/finally, throw, Error objects, custom errors, Syntax vs Runtime errors, and async error handling.</p>",
    questions: [
      { text: "Does a finally block execute if a return statement is inside the try block?", options: ["Yes, always", "No, it skips finally", "Only if an error is thrown", "It causes a syntax error"], correctAnswer: "Yes, always", difficulty: "Medium", explanation: "The finally block executes regardless of whether an exception is thrown or caught, and even if a return statement is executed within the try or catch block." }
    ]
  },
  {
    title: "18. Iterators & Generators",
    content: "<h2>Iterators & Generators</h2><p>Iterable Protocol, Iterator Protocol, Symbol.iterator, yield, generator delegation.</p>",
    questions: [
      { text: "Which symbol must an object implement to be iterable (e.g., usable in a for...of loop)?", options: ["Symbol.iterator", "Symbol.iterable", "Symbol.loop", "Symbol.next"], correctAnswer: "Symbol.iterator", difficulty: "Medium", explanation: "An object must have a method at the Symbol.iterator key that returns an iterator object." }
    ]
  },
  {
    title: "19. Functional Programming",
    content: "<h2>Functional Programming</h2><p>Pure functions, immutability, first-class functions, composition, currying, and referential transparency.</p>",
    questions: [
      { text: "What is Currying in JavaScript?", options: ["Evaluating a function with multiple arguments as a sequence of functions, each taking a single argument", "Binding 'this' to a function permanently", "Creating an infinite loop", "A performance optimization technique"], correctAnswer: "Evaluating a function with multiple arguments as a sequence of functions, each taking a single argument", difficulty: "Medium", explanation: "Currying transforms a function f(a, b, c) into f(a)(b)(c)." }
    ]
  },
  {
    title: "20. Advanced JavaScript",
    content: "<h2>Advanced JavaScript</h2><p>Debouncing, throttling, polyfills, structured clone, custom implementations of bind/call/apply/map/promise.</p>",
    questions: [
      { text: "What is the difference between debouncing and throttling?", options: ["Debouncing delays execution until a pause occurs; throttling limits execution to once every X milliseconds", "They are identical", "Throttling delays execution; debouncing limits it", "Debouncing applies to DOM events; throttling applies to fetch requests"], correctAnswer: "Debouncing delays execution until a pause occurs; throttling limits execution to once every X milliseconds", difficulty: "Hard", explanation: "Debounce groups multiple rapid fires into one final execution. Throttle ensures a function executes at a regular interval during continuous events." }
    ]
  },
  {
    title: "21. Regular Expressions",
    content: "<h2>Regex</h2><p>Patterns, character classes, quantifiers, groups, lookahead/lookbehind, and flags.</p>",
    questions: [
      { text: "What does the 'g' flag do in a Regular Expression?", options: ["Global search (finds all matches)", "Case-insensitive search", "Multiline search", "Greedy match"], correctAnswer: "Global search (finds all matches)", difficulty: "Easy", explanation: "The 'g' flag tells the regex engine to search the entire string and return all matches, rather than stopping after the first match." }
    ]
  },
  {
    title: "22. JSON & Data Handling",
    content: "<h2>JSON</h2><p>JSON.parse(), JSON.stringify(), serialization, circular references, and data transformation.</p>",
    questions: [
      { text: "What happens when you call JSON.stringify() on an object containing a circular reference?", options: ["It throws a TypeError", "It ignores the circular reference", "It loops infinitely", "It returns null"], correctAnswer: "It throws a TypeError", difficulty: "Medium", explanation: "JSON.stringify() cannot serialize circular structures and will throw a 'Converting circular structure to JSON' TypeError." }
    ]
  },
  {
    title: "23. Security",
    content: "<h2>Security</h2><p>XSS, CSRF, Prototype Pollution, CSP, Secure Cookies, CORS, and Same-Origin Policy.</p>",
    questions: [
      { text: "What does CORS stand for?", options: ["Cross-Origin Resource Sharing", "Cross-Object Reference Security", "Cascading Object Rendering System", "Cross-Origin Routing System"], correctAnswer: "Cross-Origin Resource Sharing", difficulty: "Easy", explanation: "CORS is an HTTP-header based mechanism that allows a server to indicate any origins other than its own from which a browser should permit loading resources." }
    ]
  },
  {
    title: "24. Performance",
    content: "<h2>Performance</h2><p>Browser rendering, Reflow vs Repaint, layout thrashing, code splitting, tree shaking, and web workers.</p>",
    questions: [
      { text: "What causes 'Layout Thrashing' in the browser?", options: ["Repeatedly reading and writing to the DOM in rapid succession, forcing synchronous layouts", "Having too many CSS files", "Executing WebAssembly code", "Using too many setInterval calls"], correctAnswer: "Repeatedly reading and writing to the DOM in rapid succession, forcing synchronous layouts", difficulty: "Hard", explanation: "Layout thrashing occurs when JavaScript writes to the DOM and immediately reads a layout property, forcing the browser to prematurely calculate the layout." }
    ]
  },
  {
    title: "25. Node.js-Specific JavaScript",
    content: "<h2>Node.js Specifics</h2><p>V8 Engine, Node Event Loop, Streams, Buffers, global, process, and worker threads.</p>",
    questions: [
      { text: "What is the global object equivalent to the browser's `window` in Node.js?", options: ["global", "window", "document", "process"], correctAnswer: "global", difficulty: "Easy", explanation: "In Node.js, the top-level scope is not the global scope (due to modules), but the `global` object serves as the global namespace." }
    ]
  },
  {
    title: "26. Interview Coding Topics",
    content: "<h2>Coding Questions</h2><p>String manipulation, arrays, flattening, deep cloning, grouping, chunking, and recursion.</p>",
    questions: [
      { text: "Which array method is best for deeply flattening an array?", options: ["Array.prototype.flat(Infinity)", "Array.prototype.map()", "Array.prototype.reduce()", "Array.prototype.concat()"], correctAnswer: "Array.prototype.flat(Infinity)", difficulty: "Medium", explanation: "Calling flat() with Infinity as the depth parameter will recursively flatten an array of arbitrary depth." }
    ]
  },
  {
    title: "27. Output-Based Interview Questions",
    content: "<h2>Output-Based Questions</h2><p>Predicting the output of tricky code snippets involving hoisting, scope, closures, Promises, and the event loop.</p>",
    questions: [
      { text: "What is the output of: `console.log(0.1 + 0.2 === 0.3)`?", options: ["false", "true", "TypeError", "undefined"], correctAnswer: "false", difficulty: "Medium", explanation: "Due to floating point precision in IEEE 754, 0.1 + 0.2 equals 0.30000000000000004, which is not strictly equal to 0.3." }
    ]
  }
];

let startOrder = seedData[jsIndex].topics.length + 1;
for (const cat of jsCategoriesPart2) {
  cat.order = startOrder++;
  seedData[jsIndex].topics.push(cat);
}

fs.writeFileSync(dataPath, JSON.stringify(seedData, null, 2));
console.log(`Appended the final ${jsCategoriesPart2.length} massive categories to JavaScript!`);
