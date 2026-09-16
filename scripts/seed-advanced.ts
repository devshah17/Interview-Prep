import mongoose from "mongoose";
import dotenv from "dotenv";

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

async function seedAdvanced() {
  try {
    await mongoose.connect(MONGODB_URI!);
    console.log("Connected to MongoDB for advanced seeding.");

    // Fetch existing technologies
    const jsTech = await Technology.findOne({ name: "JavaScript" });
    const reactTech = await Technology.findOne({ name: "React.js" });
    const nodeTech = await Technology.findOne({ name: "Node.js" });
    const nextTech = await Technology.findOne({ name: "Next.js" });

    // ==========================================
    // JAVASCRIPT ADVANCED
    // ==========================================
    if (jsTech) {
      console.log("Seeding advanced JavaScript topics...");
      const jsTop1 = await Topic.create({
        techId: jsTech._id, title: "Generators and Iterators", order: 10,
        content: "<h2>Generators</h2><p>Generators are functions that can be exited and later re-entered. Their context (variable bindings) will be saved across re-entrances. Defined using <code>function*</code> and the <code>yield</code> keyword.</p>"
      });
      await Question.create([{
        techId: jsTech._id, topicId: jsTop1._id, difficulty: "Hard", text: "What does the yield keyword do in a generator function?", options: ["It permanently stops the function execution", "It returns a value and pauses the execution of the generator", "It throws an error", "It forces garbage collection"], correctAnswer: "It returns a value and pauses the execution of the generator", explanation: "yield pauses the generator function and returns an IteratorResult object to the caller."
      }]);

      const jsTop2 = await Topic.create({
        techId: jsTech._id, title: "Memory Management & Garbage Collection", order: 11,
        content: "<h2>Garbage Collection</h2><p>JavaScript automatically allocates memory when objects are created and frees it when they are not used anymore (garbage collection). The main algorithm used is Mark-and-Sweep.</p>"
      });
      await Question.create([{
        techId: jsTech._id, topicId: jsTop2._id, difficulty: "Medium", text: "Which algorithm is primarily used by modern JavaScript engines for garbage collection?", options: ["Reference Counting", "Mark-and-Sweep", "First-In-First-Out", "Memory Paging"], correctAnswer: "Mark-and-Sweep", explanation: "Modern engines use Mark-and-Sweep, which traverses roots (like the global object) and marks reachable objects, sweeping away the unreachable ones."
      }]);
    }

    // ==========================================
    // REACT.JS ADVANCED
    // ==========================================
    if (reactTech) {
      console.log("Seeding advanced React.js topics...");
      const reactTop1 = await Topic.create({
        techId: reactTech._id, title: "React Suspense and Concurrent Mode", order: 10,
        content: "<h2>Suspense</h2><p><code>&lt;Suspense&gt;</code> lets your components 'wait' for something before they can render, showing a fallback UI while waiting.</p><h2>Concurrent Rendering</h2><p>React can interrupt, pause, resume, or abandon a render. This allows React to respond to user input quickly even if it's in the middle of a heavy rendering task.</p>"
      });
      await Question.create([{
        techId: reactTech._id, topicId: reactTop1._id, difficulty: "Hard", text: "What is a primary benefit of React's concurrent rendering?", options: ["It reduces the JavaScript bundle size", "It renders the UI faster by using multiple CPU threads", "It allows React to pause rendering to handle high-priority events like user input", "It completely eliminates the need for useEffect"], correctAnswer: "It allows React to pause rendering to handle high-priority events like user input", explanation: "Concurrent rendering makes the rendering process interruptible, ensuring the UI remains responsive during heavy updates."
      }]);

      const reactTop2 = await Topic.create({
        techId: reactTech._id, title: "Custom Hooks vs HOCs", order: 11,
        content: "<h2>Design Patterns</h2><p>Custom Hooks allow you to extract and reuse stateful logic. Higher-Order Components (HOCs) are functions that take a component and return a new component.</p>"
      });
      await Question.create([{
        techId: reactTech._id, topicId: reactTop2._id, difficulty: "Medium", text: "Why are Custom Hooks generally preferred over Higher-Order Components in modern React?", options: ["HOCs are deprecated in React 18", "Custom Hooks avoid 'wrapper hell' and make logic easier to share", "HOCs cannot access Context", "Custom Hooks run on the server"], correctAnswer: "Custom Hooks avoid 'wrapper hell' and make logic easier to share", explanation: "HOCs can lead to deeply nested component trees ('wrapper hell'). Hooks allow extracting logic into flat, reusable functions."
      }]);
    }

    // ==========================================
    // NODE.JS ADVANCED
    // ==========================================
    if (nodeTech) {
      console.log("Seeding advanced Node.js topics...");
      const nodeTop1 = await Topic.create({
        techId: nodeTech._id, title: "Cluster Module and Worker Threads", order: 10,
        content: "<h2>Cluster vs Worker Threads</h2><p>The <code>cluster</code> module allows you to create child processes that share server ports (scaling across CPU cores). <code>worker_threads</code> allow you to run JavaScript in parallel threads, useful for CPU-intensive tasks without blocking the main event loop.</p>"
      });
      await Question.create([{
        techId: nodeTech._id, topicId: nodeTop1._id, difficulty: "Hard", text: "When should you use worker_threads instead of the cluster module?", options: ["To handle more concurrent HTTP requests", "To share server ports", "To perform CPU-intensive JavaScript operations", "To access the DOM"], correctAnswer: "To perform CPU-intensive JavaScript operations", explanation: "Worker threads are designed for running CPU-intensive operations (like cryptography or image processing) in parallel without blocking the main event loop. Clustering is better for scaling network throughput."
      }]);

      const nodeTop2 = await Topic.create({
        techId: nodeTech._id, title: "Event Loop Phases in Depth", order: 11,
        content: "<h2>Phases</h2><p>The Node.js event loop runs in phases: Timers (setTimeout, setInterval), Pending Callbacks, Idle/Prepare, Poll (I/O), Check (setImmediate), and Close Callbacks.</p>"
      });
      await Question.create([{
        techId: nodeTech._id, topicId: nodeTop2._id, difficulty: "Hard", text: "In which phase of the Node.js Event Loop are incoming HTTP requests and file system reads processed?", options: ["Timers phase", "Poll phase", "Check phase", "Close callbacks phase"], correctAnswer: "Poll phase", explanation: "The poll phase retrieves new I/O events; executing I/O related callbacks."
      }]);
    }

    // ==========================================
    // NEXT.JS ADVANCED
    // ==========================================
    if (nextTech) {
      console.log("Seeding advanced Next.js topics...");
      const nextTop1 = await Topic.create({
        techId: nextTech._id, title: "Server Actions and Mutations", order: 10,
        content: "<h2>Server Actions</h2><p>Asynchronous functions that run on the server. They can be called directly from Client Components (via form actions or event handlers) to mutate data without needing to create API endpoints manually.</p>"
      });
      await Question.create([{
        techId: nextTech._id, topicId: nextTop1._id, difficulty: "Medium", text: "What is a primary advantage of using Server Actions in Next.js?", options: ["They allow you to write CSS in JS", "They eliminate the need to manually create API routes for data mutations", "They run faster on the client side", "They replace Redux"], correctAnswer: "They eliminate the need to manually create API routes for data mutations", explanation: "Server actions allow you to execute server-side code directly from client interactions without setting up intermediary API routes."
      }]);

      const nextTop2 = await Topic.create({
        techId: nextTech._id, title: "Middleware and Edge Runtime", order: 11,
        content: "<h2>Middleware</h2><p>Middleware allows you to run code before a request is completed. It runs on the Edge Runtime, which is a lightweight JavaScript environment that does not support all Node.js APIs.</p>"
      });
      await Question.create([{
        techId: nextTech._id, topicId: nextTop2._id, difficulty: "Hard", text: "Which of the following is TRUE about Next.js Middleware?", options: ["It has full access to all Node.js native modules like 'fs' and 'crypto'", "It runs exclusively on the browser", "It executes on the Edge Runtime, meaning it lacks access to certain Node.js APIs", "It is only executed on static pages"], correctAnswer: "It executes on the Edge Runtime, meaning it lacks access to certain Node.js APIs", explanation: "Middleware runs on the Edge Runtime for speed and global distribution, meaning it cannot use native Node.js APIs that depend on a full Node environment."
      }]);
    }

    console.log("Successfully seeded advanced topics for all technologies!");
  } catch (error) {
    console.error("Seed error:", error);
  } finally {
    mongoose.disconnect();
  }
}

seedAdvanced();
