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
    title: "Objects",
    content: `
      <h2>1. Object Creation & Properties</h2>
      <p>Objects are collections of key-value pairs. Keys are strings (or Symbols). Values can be any data type. You can create objects using object literals <code>{}</code>, the <code>new Object()</code> syntax, or <code>Object.create()</code>.</p>
      
      <h2>2. Object Methods</h2>
      <ul>
        <li><code>Object.keys(obj)</code>: Returns an array of keys.</li>
        <li><code>Object.values(obj)</code>: Returns an array of values.</li>
        <li><code>Object.entries(obj)</code>: Returns an array of [key, value] pairs.</li>
        <li><code>Object.assign(target, source)</code>: Copies properties from source to target.</li>
      </ul>

      <h2>3. Immutability</h2>
      <p><code>Object.freeze()</code> makes an object entirely immutable. <code>Object.seal()</code> prevents adding or removing properties, but allows modifying existing ones.</p>
      <pre><code>
const user = { name: "Alice", role: "Admin" };
Object.freeze(user);
user.name = "Bob"; // Fails silently in non-strict mode
console.log(user.name); // "Alice"
      </code></pre>

      <h2>4. Shallow vs Deep Copy</h2>
      <p>The spread operator <code>{...obj}</code> creates a <strong>shallow copy</strong>. Nested objects are still referenced by memory address. To create a <strong>deep copy</strong>, you can use <code>JSON.parse(JSON.stringify(obj))</code> or the modern <code>structuredClone(obj)</code>.</p>
    `,
    questions: [
      { text: "What is the result of using the spread operator `{...obj}` on an object with nested objects?", options: ["A complete deep clone is created", "A shallow copy is created; nested objects share the same memory reference", "A TypeError is thrown", "The nested objects are converted to strings"], correctAnswer: "A shallow copy is created; nested objects share the same memory reference", difficulty: "Easy", explanation: "The spread operator only copies the first level of properties. Nested objects copy by reference." },
      { text: "Which method returns an array of a given object's own enumerable string-keyed property [key, value] pairs?", options: ["Object.keys()", "Object.values()", "Object.entries()", "Object.assign()"], correctAnswer: "Object.entries()", difficulty: "Easy", explanation: "Object.entries() returns an array containing arrays of the [key, value] pairs." },
      { text: "What is the difference between Object.freeze() and Object.seal()?", options: ["freeze allows modifying existing properties, seal does not", "seal allows modifying existing properties, freeze does not", "They are exactly the same", "freeze is for arrays, seal is for objects"], correctAnswer: "seal allows modifying existing properties, freeze does not", difficulty: "Medium", explanation: "Object.seal() prevents adding/removing properties but allows changing existing ones. freeze() makes the object completely immutable." },
      { text: "How does the modern `structuredClone()` function improve upon `JSON.parse(JSON.stringify())`?", options: ["It is synchronous", "It works in older browsers natively", "It can clone Maps, Sets, Dates, and handle circular references", "It minifies the object data"], correctAnswer: "It can clone Maps, Sets, Dates, and handle circular references", difficulty: "Medium", explanation: "structuredClone is the modern native way to deep clone objects and supports complex types that JSON stringification breaks on." },
      { text: "What happens when you try to reassign a property of an Object.freeze() object in Strict Mode?", options: ["It fails silently", "It throws a TypeError", "It successfully changes the property", "It deletes the property instead"], correctAnswer: "It throws a TypeError", difficulty: "Hard", explanation: "In non-strict mode it fails silently, but in strict mode, mutating a frozen object throws a TypeError." },
      { text: "If obj = { a: 1 }, what does Object.defineProperty(obj, 'b', { value: 2 }) do if 'enumerable' is not specified?", options: ["Creates 'b', which shows up in Object.keys()", "Creates 'b', but it does NOT show up in Object.keys()", "Throws an error", "Modifies property 'a'"], correctAnswer: "Creates 'b', but it does NOT show up in Object.keys()", difficulty: "Hard", explanation: "By default, properties added via Object.defineProperty are not enumerable, not configurable, and not writable unless explicitly set to true." }
    ]
  },
  {
    title: "Prototypes & Inheritance",
    content: `
      <h2>1. The Prototype Chain</h2>
      <p>Every object in JavaScript has a built-in property called its <strong>prototype</strong>. The prototype is itself an object, so the prototype will have its own prototype, making a <strong>prototype chain</strong>. The chain ends when it reaches a prototype that has <code>null</code> for its own prototype.</p>

      <h2>2. __proto__ vs prototype</h2>
      <p><code>__proto__</code> is the actual object that is used in the lookup chain to resolve methods, etc. <code>prototype</code> is the object that is used to build <code>__proto__</code> when you create an object with <code>new</code>.</p>

      <h2>3. ES6 Classes</h2>
      <p>Classes in JS are syntactic sugar over the existing prototype-based inheritance. They provide a cleaner syntax to create objects and deal with inheritance.</p>
      <pre><code>
class Animal {
  constructor(name) {
    this.name = name;
  }
  speak() {
    console.log(this.name + ' makes a noise.');
  }
}

class Dog extends Animal {
  constructor(name) {
    super(name); // Call the parent constructor
  }
  speak() {
    console.log(this.name + ' barks.');
  }
}
      </code></pre>
    `,
    questions: [
      { text: "What keyword is used to inherit from a parent class in ES6?", options: ["inherits", "extends", "super", "implement"], correctAnswer: "extends", difficulty: "Easy", explanation: "The 'extends' keyword is used in class declarations or class expressions to create a class that is a child of another class." },
      { text: "What is the top-most prototype in the JavaScript prototype chain?", options: ["Function.prototype", "Array.prototype", "Object.prototype", "null"], correctAnswer: "Object.prototype", difficulty: "Easy", explanation: "Nearly all objects in JavaScript are instances of Object; a typical object inherits properties from Object.prototype." },
      { text: "What does the `super()` function do in a child class constructor?", options: ["References the global object", "Throws an error", "Calls the parent class's constructor", "Returns the current instance"], correctAnswer: "Calls the parent class's constructor", difficulty: "Medium", explanation: "In a derived class with a constructor, you must call super() before you can use 'this'." },
      { text: "How can you programmatically get the prototype of a specific object instance?", options: ["object.prototype", "Object.getPrototypeOf(object)", "object.parent", "object.__parent__"], correctAnswer: "Object.getPrototypeOf(object)", difficulty: "Medium", explanation: "Object.getPrototypeOf() is the standard method to get the prototype of an object, rather than using the deprecated __proto__ property." },
      { text: "What is the difference between an object's `__proto__` and a function's `prototype` property?", options: ["They are identical", "__proto__ is the actual prototype chain link for an instance; prototype is the object attached to instances created via 'new' on that function", "prototype is for arrays, __proto__ is for objects", "__proto__ is a method, prototype is a string"], correctAnswer: "__proto__ is the actual prototype chain link for an instance; prototype is the object attached to instances created via 'new' on that function", difficulty: "Hard", explanation: "The 'prototype' property on a constructor function is what it *assigns* to the __proto__ of instances it creates." },
      { text: "What happens if you define a method inside an ES6 class without the `static` keyword?", options: ["It is attached to the class itself, not instances", "It is attached to the instance's prototype", "It throws a Syntax Error", "It is attached directly to the instance object"], correctAnswer: "It is attached to the instance's prototype", difficulty: "Hard", explanation: "Standard methods in a class body are placed on the class's prototype, so all instances share the same function reference." }
    ]
  },
  {
    title: "`this` Keyword",
    content: `
      <h2>1. Execution Context Binding</h2>
      <p>The value of <code>this</code> is evaluated at runtime depending on the function's execution context. It behaves differently in strict mode vs non-strict mode.</p>

      <h2>2. The 4 Rules of 'this' Binding</h2>
      <ul>
        <li><strong>Implicit Binding:</strong> When a function is called as a method of an object (e.g., <code>obj.method()</code>), <code>this</code> points to the object.</li>
        <li><strong>Explicit Binding:</strong> Using <code>.call()</code>, <code>.apply()</code>, or <code>.bind()</code> to explicitly state what <code>this</code> should be.</li>
        <li><strong>New Binding:</strong> When a function is called with the <code>new</code> keyword, <code>this</code> points to the newly created instance.</li>
        <li><strong>Default Binding:</strong> A standalone function invocation defaults <code>this</code> to the global object (window) or <code>undefined</code> in strict mode.</li>
      </ul>

      <h2>3. Arrow Functions</h2>
      <p>Arrow functions do not have their own <code>this</code> context. They inherit <code>this</code> lexically from the parent scope at the time they are defined.</p>
      <pre><code>
const user = {
  name: "Alice",
  regularFunc: function() { console.log(this.name); },
  arrowFunc: () => { console.log(this.name); }
};
user.regularFunc(); // "Alice"
user.arrowFunc(); // undefined (inherits from window)
      </code></pre>
    `,
    questions: [
      { text: "What does `this` refer to in a standard standalone function call in non-strict mode?", options: ["undefined", "null", "The Global Object (e.g., window in browsers)", "An empty object"], correctAnswer: "The Global Object (e.g., window in browsers)", difficulty: "Easy", explanation: "Default binding points 'this' to the global object when not in strict mode." },
      { text: "How do Arrow Functions handle the `this` keyword?", options: ["They bind it to the object calling them", "They bind it to the global object always", "They lexically bind it to the enclosing scope", "They throw an error if this is used"], correctAnswer: "They lexically bind it to the enclosing scope", difficulty: "Easy", explanation: "Arrow functions do not bind their own 'this'. They inherit it from the parent scope." },
      { text: "What is the difference between `.call()` and `.apply()`?", options: [".call takes arguments as an array; .apply takes arguments separated by commas", ".apply takes arguments as an array; .call takes arguments separated by commas", "There is no difference", ".call returns a new function; .apply executes it immediately"], correctAnswer: ".apply takes arguments as an array; .call takes arguments separated by commas", difficulty: "Medium", explanation: "Both invoke the function immediately and explicitly set 'this', but apply expects an array of arguments (A for Array)." },
      { text: "What does `.bind()` return?", options: ["The result of the function execution", "undefined", "A new function with the `this` context permanently bound", "An array"], correctAnswer: "A new function with the `this` context permanently bound", difficulty: "Medium", explanation: ".bind() does not execute the function immediately; it returns a new bound instance of the function." },
      { text: "What happens if you use the `new` keyword on an arrow function?", options: ["It creates a new object successfully", "It throws a TypeError because arrow functions are not constructors", "It returns undefined", "It creates a global variable"], correctAnswer: "It throws a TypeError because arrow functions are not constructors", difficulty: "Hard", explanation: "Arrow functions do not have a [[Construct]] method and cannot be used with 'new'." },
      { text: "If `const bound = fn.bind(obj1);`, what happens if you call `bound.call(obj2)`?", options: ["'this' becomes obj2", "'this' remains obj1", "It throws an error", "'this' becomes the global object"], correctAnswer: "'this' remains obj1", difficulty: "Hard", explanation: "Once a function is bound using .bind(), its 'this' context cannot be changed again, even with .call() or .apply()." }
    ]
  },
  {
    title: "Arrays",
    content: `
      <h2>1. Array Methods Overview</h2>
      <p>JavaScript provides numerous built-in methods for array manipulation. Understanding which methods mutate the original array versus returning a new array is critical for React and Functional Programming.</p>
      
      <h2>2. Mutating Methods</h2>
      <ul>
        <li><code>push()</code> / <code>pop()</code>: Add/remove from end.</li>
        <li><code>shift()</code> / <code>unshift()</code>: Add/remove from beginning.</li>
        <li><code>splice(start, deleteCount, item1...)</code>: Modifies array in place.</li>
        <li><code>sort()</code> / <code>reverse()</code>: Mutates original array in place.</li>
      </ul>

      <h2>3. Non-Mutating (Immutable) Methods</h2>
      <ul>
        <li><code>map()</code>: Returns a new array with transformed elements.</li>
        <li><code>filter()</code>: Returns a new array with elements that pass a test.</li>
        <li><code>reduce()</code>: Reduces the array to a single value.</li>
        <li><code>slice(start, end)</code>: Returns a shallow copy of a portion of an array.</li>
      </ul>
      <pre><code>
const nums = [1, 2, 3];
const doubled = nums.map(n => n * 2); // [2, 4, 6]
console.log(nums); // [1, 2, 3] (original unchanged)
      </code></pre>
    `,
    questions: [
      { text: "Which array method modifies the original array?", options: ["slice()", "map()", "filter()", "splice()"], correctAnswer: "splice()", difficulty: "Easy", explanation: "splice() adds/removes items to/from an array, changing the original array." },
      { text: "What does the `.map()` method return?", options: ["A single value", "undefined", "A completely new array with the results of calling a provided function on every element", "The original array, modified"], correctAnswer: "A completely new array with the results of calling a provided function on every element", difficulty: "Easy", explanation: "map() is an immutable method that transforms every element and returns a new array." },
      { text: "What is the difference between `slice()` and `splice()`?", options: ["They are identical", "slice mutates the array; splice returns a copy", "splice mutates the array; slice returns a copy", "Neither mutates the array"], correctAnswer: "splice mutates the array; slice returns a copy", difficulty: "Medium", explanation: "slice(start, end) returns a portion of the array without modifying it. splice() modifies the array in place." },
      { text: "How does the `.reduce()` method work?", options: ["It removes elements from an array", "It executes a reducer function on each element, resulting in a single output value", "It returns an array of booleans", "It flattens a multi-dimensional array"], correctAnswer: "It executes a reducer function on each element, resulting in a single output value", difficulty: "Medium", explanation: "reduce() takes an accumulator and the current value, and iterates through the array to produce a single final value." },
      { text: "By default, how does the `sort()` method sort elements?", options: ["Numerically in ascending order", "Numerically in descending order", "It converts elements to strings and compares their UTF-16 code unit values sequences", "Randomly"], correctAnswer: "It converts elements to strings and compares their UTF-16 code unit values sequences", difficulty: "Hard", explanation: "Without a compare function, sort() converts elements to strings. This means [1, 10, 2] sorts to [1, 10, 2] instead of [1, 2, 10]." },
      { text: "What is an 'Array-Like Object' and how can you convert it to a real Array?", options: ["An object with a .length property; use Array.from()", "A string; use Object.values()", "An object with numeric keys; use JSON.parse()", "A Set; use .flat()"], correctAnswer: "An object with a .length property; use Array.from()", difficulty: "Hard", explanation: "Objects like the `arguments` object or DOM NodeLists have numeric indices and a length property, but lack array methods. Array.from() converts them to real arrays." }
    ]
  }
];

async function applyBatch2() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("Connected to DB.");

    // Delete old overlapping topics from DB
    const oldTitles = [
      "Objects", 
      "Prototypes & Inheritance", 
      "`this` Keyword", 
      "Arrays"
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

    // Determine starting order
    // In batch 1, we made 1, 2, 3. The first 3 of the JSON are those.
    // We will place these at 4, 5, 6, 7.
    let orderCounter = 4;
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
    
    // Insert the new ones at index 3 (after the first 3 from Batch 1)
    seedData[jsIndex].topics.splice(3, 0, ...upgradedTopics);
    
    // Fix orders for all
    seedData[jsIndex].topics.forEach((t, i) => t.order = i + 1);

    fs.writeFileSync(dataPath, JSON.stringify(seedData, null, 2));
    console.log("seed-data.json updated successfully.");

  } catch (error) {
    console.error("Migration error:", error);
  } finally {
    mongoose.disconnect();
  }
}

applyBatch2();
