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

async function clearTechData(techName: string) {
  const existingTech = await Technology.findOne({ name: techName });
  if (existingTech) {
    console.log(`Removing existing ${techName} data...`);
    await Topic.deleteMany({ techId: existingTech._id });
    await Question.deleteMany({ techId: existingTech._id });
    await Technology.deleteOne({ _id: existingTech._id });
  }
}

async function seed() {
  try {
    await mongoose.connect(MONGODB_URI!);
    console.log("Connected to MongoDB.");

    // ==========================================
    // REACT.JS
    // ==========================================
    await clearTechData("React.js");
    const reactTech = await Technology.create({
      name: "React.js",
      description: "A JavaScript library for building user interfaces.",
    });

    const rTopic1 = await Topic.create({
      techId: reactTech._id, title: "Virtual DOM & Reconciliation", order: 1,
      content: "<h2>Virtual DOM</h2><p>React creates an in-memory data structure cache (the Virtual DOM), computes the resulting differences, and then updates the browser's displayed DOM efficiently.</p><h2>Reconciliation</h2><p>The algorithm React uses to diff one tree with another to determine which parts need to be changed.</p>"
    });
    await Question.create([
      { techId: reactTech._id, topicId: rTopic1._id, difficulty: "Medium", text: "What is the Virtual DOM in React?", options: ["A direct copy of the real DOM used for CSS styling", "An in-memory representation of the real DOM", "A feature of HTML5", "A new browser standard"], correctAnswer: "An in-memory representation of the real DOM", explanation: "React maintains a lightweight representation of the DOM in memory. It compares this Virtual DOM with the real DOM to make efficient updates." },
      { techId: reactTech._id, topicId: rTopic1._id, difficulty: "Hard", text: "What algorithm does React use for Reconciliation?", options: ["A* Search", "Diffing Algorithm", "Binary Search", "Dijkstra's Algorithm"], correctAnswer: "Diffing Algorithm", explanation: "React uses a heuristic O(n) diffing algorithm based on two assumptions: two elements of different types will produce different trees, and the developer can hint at which child elements may be stable across different renders with a 'key' prop." }
    ]);

    const rTopic2 = await Topic.create({
      techId: reactTech._id, title: "Hooks in Depth", order: 2,
      content: "<h2>Common Hooks</h2><p>Hooks let you use state and other React features without writing a class.</p><ul><li><strong>useState:</strong> State management.</li><li><strong>useEffect:</strong> Side effects.</li><li><strong>useRef:</strong> Persistent mutable values that do not cause re-renders.</li><li><strong>useReducer:</strong> Complex state logic alternative to useState.</li></ul>"
    });
    await Question.create([
      { techId: reactTech._id, topicId: rTopic2._id, difficulty: "Medium", text: "How do you run a useEffect hook only once when the component mounts?", options: ["Omit the dependency array", "Pass an empty array [] as the second argument", "Return a function from the effect", "Use the useMount hook"], correctAnswer: "Pass an empty array [] as the second argument", explanation: "An empty dependency array tells React that your effect doesn’t depend on any values from props or state, so it never needs to re-run." },
      { techId: reactTech._id, topicId: rTopic2._id, difficulty: "Medium", text: "What is the primary difference between useState and useRef?", options: ["useRef is only for DOM elements", "useState causes a re-render when the value changes, useRef does not", "useRef can only store strings", "There is no difference"], correctAnswer: "useState causes a re-render when the value changes, useRef does not", explanation: "Updating a ref does not trigger a component re-render, whereas updating state does." },
      { techId: reactTech._id, topicId: rTopic2._id, difficulty: "Hard", text: "When should you prefer useReducer over useState?", options: ["Always", "Never", "When state logic is complex and involves multiple sub-values", "When you want to improve performance"], correctAnswer: "When state logic is complex and involves multiple sub-values", explanation: "useReducer is usually preferable to useState when you have complex state logic that involves multiple sub-values or when the next state depends on the previous one." }
    ]);

    const rTopic3 = await Topic.create({
      techId: reactTech._id, title: "Performance Optimization", order: 3,
      content: "<h2>Optimizing React Apps</h2><p>React provides several tools to prevent unnecessary re-renders.</p><ul><li><strong>React.memo:</strong> Higher order component that memoizes the rendered output of the wrapped component.</li><li><strong>useMemo:</strong> Memoizes a calculated value.</li><li><strong>useCallback:</strong> Memoizes a callback function.</li></ul>"
    });
    await Question.create([
      { techId: reactTech._id, topicId: rTopic3._id, difficulty: "Hard", text: "What does useCallback do?", options: ["Caches a value between renders", "Returns a memoized callback function", "Prevents a component from re-rendering", "Fetches data asynchronously"], correctAnswer: "Returns a memoized callback function", explanation: "useCallback returns a memoized version of the callback that only changes if one of the dependencies has changed." },
      { techId: reactTech._id, topicId: rTopic3._id, difficulty: "Medium", text: "When you wrap a component in React.memo, what happens?", options: ["It skips rendering if props have not changed", "It memorizes the state of the component", "It forces a re-render every time", "It converts it into a class component"], correctAnswer: "It skips rendering if props have not changed", explanation: "React.memo is a higher order component that performs a shallow comparison of props and skips rendering if they haven't changed." }
    ]);

    // ==========================================
    // NODE.JS
    // ==========================================
    await clearTechData("Node.js");
    const nodeTech = await Technology.create({
      name: "Node.js",
      description: "An asynchronous event-driven JavaScript runtime designed to build scalable network applications.",
    });

    const nTopic1 = await Topic.create({
      techId: nodeTech._id, title: "Event-Driven Architecture", order: 1,
      content: "<h2>Event Emitter</h2><p>Node.js is heavily built around an event-driven architecture. The <code>events</code> module provides an EventEmitter class that triggers events and handles callbacks.</p>"
    });
    await Question.create([
      { techId: nodeTech._id, topicId: nTopic1._id, difficulty: "Medium", text: "Which core module in Node.js provides the EventEmitter class?", options: ["http", "fs", "events", "stream"], correctAnswer: "events", explanation: "The 'events' module exposes the EventEmitter class, which is the foundation of Node's asynchronous event-driven architecture." },
      { techId: nodeTech._id, topicId: nTopic1._id, difficulty: "Easy", text: "How do you listen for an event using an EventEmitter instance?", options: ["emitter.listen('event', callback)", "emitter.on('event', callback)", "emitter.bind('event', callback)", "emitter.subscribe('event', callback)"], correctAnswer: "emitter.on('event', callback)", explanation: "The .on() method is used to register listeners for a specific event." }
    ]);

    const nTopic2 = await Topic.create({
      techId: nodeTech._id, title: "Streams & Buffers", order: 2,
      content: "<h2>Streams</h2><p>Streams are objects that let you read data from a source or write data to a destination in continuous fashion (Readable, Writable, Duplex, Transform).</p><h2>Buffers</h2><p>Buffers are used to represent a fixed-length sequence of bytes, often used when dealing with binary data.</p>"
    });
    await Question.create([
      { techId: nodeTech._id, topicId: nTopic2._id, difficulty: "Hard", text: "Which type of stream allows both reading and writing?", options: ["Readable", "Writable", "Duplex", "Transform"], correctAnswer: "Duplex", explanation: "A Duplex stream implements both the Readable and Writable interfaces, allowing data to be both read and written (e.g., a TCP socket)." },
      { techId: nodeTech._id, topicId: nTopic2._id, difficulty: "Medium", text: "What is a Buffer in Node.js?", options: ["A temporary storage area for a stream of binary data", "A tool for padding strings", "A memory leak prevention mechanism", "A type of readable stream"], correctAnswer: "A temporary storage area for a stream of binary data", explanation: "Buffers are designed to handle raw binary data outside the V8 engine, commonly used when reading from streams like files or network sockets." }
    ]);

    const nTopic3 = await Topic.create({
      techId: nodeTech._id, title: "Middleware & Express.js", order: 3,
      content: "<h2>Middleware</h2><p>Middleware functions are functions that have access to the request object (req), the response object (res), and the next middleware function in the application’s request-response cycle.</p>"
    });
    await Question.create([
      { techId: nodeTech._id, topicId: nTopic3._id, difficulty: "Easy", text: "What does the 'next' function do in an Express middleware?", options: ["Sends the response to the client", "Passes control to the next middleware function", "Throws an error", "Restarts the server"], correctAnswer: "Passes control to the next middleware function", explanation: "Calling next() passes control to the next middleware function in the stack. If left uncalled, the request will be left hanging." },
      { techId: nodeTech._id, topicId: nTopic3._id, difficulty: "Medium", text: "How do you define error-handling middleware in Express?", options: ["Use a try/catch block", "Define a middleware function with 4 arguments: (err, req, res, next)", "Use the app.error() method", "Throw a new Error()"], correctAnswer: "Define a middleware function with 4 arguments: (err, req, res, next)", explanation: "Express recognizes middleware as error-handling middleware if it specifically takes exactly 4 arguments." }
    ]);


    // ==========================================
    // NEXT.JS
    // ==========================================
    await clearTechData("Next.js");
    const nextTech = await Technology.create({
      name: "Next.js",
      description: "The React Framework for the Web, providing hybrid static & server rendering, and smart bundling.",
    });

    const nxTopic1 = await Topic.create({
      techId: nextTech._id, title: "Server vs Client Components", order: 1,
      content: "<h2>App Router Architecture</h2><p>In the Next.js App Router, components are Server Components by default. They run on the server, resulting in zero client-side JavaScript bundle size. Client Components use <code>'use client'</code> and run on the browser.</p>"
    });
    await Question.create([
      { techId: nextTech._id, topicId: nxTopic1._id, difficulty: "Easy", text: "How do you explicitly declare a Client Component in the Next.js App Router?", options: ["export default ClientComponent;", "By using the 'use client' directive at the top of the file", "By placing it in the /client directory", "By using the useEffect hook"], correctAnswer: "By using the 'use client' directive at the top of the file", explanation: "The 'use client' directive marks a file boundary where Next.js switches from Server to Client rendering." },
      { techId: nextTech._id, topicId: nxTopic1._id, difficulty: "Medium", text: "Which of the following is true about Server Components?", options: ["They can use useState and useEffect", "They add to the client-side bundle size", "They cannot use React hooks like useState", "They only run on the client"], correctAnswer: "They cannot use React hooks like useState", explanation: "Server Components are rendered on the server and do not support interactive hooks like useState or useEffect." }
    ]);

    const nxTopic2 = await Topic.create({
      techId: nextTech._id, title: "Data Fetching & Caching", order: 2,
      content: "<h2>Fetch API in Next.js</h2><p>Next.js extends the native Web <code>fetch()</code> API to allow each request on the server to set its own persistent caching and revalidation semantics.</p>"
    });
    await Question.create([
      { techId: nextTech._id, topicId: nxTopic2._id, difficulty: "Hard", text: "How can you revalidate cached data on demand in Next.js?", options: ["Using router.refresh()", "Using the revalidatePath or revalidateTag functions", "By clearing the browser cache", "Using the setTimeout function"], correctAnswer: "Using the revalidatePath or revalidateTag functions", explanation: "Next.js provides revalidatePath and revalidateTag Server Actions to purge cached data on-demand." },
      { techId: nextTech._id, topicId: nxTopic2._id, difficulty: "Medium", text: "What is the default caching behavior of fetch() in a Next.js Server Component?", options: ["{ cache: 'no-store' }", "{ cache: 'force-cache' }", "It varies depending on the route type", "No caching"], correctAnswer: "{ cache: 'force-cache' }", explanation: "By default, Next.js aggressively caches fetch requests with 'force-cache', meaning the data is cached indefinitely unless revalidated (in Next 13/14; behavior shifted slightly in 15 but force-cache remains a core default paradigm for static routes)." }
    ]);

    const nxTopic3 = await Topic.create({
      techId: nextTech._id, title: "Routing & Layouts", order: 3,
      content: "<h2>File-System Based Routing</h2><p>Next.js uses a file-system based router. Folders define routes, and special files like <code>page.tsx</code>, <code>layout.tsx</code>, and <code>loading.tsx</code> define the UI.</p>"
    });
    await Question.create([
      { techId: nextTech._id, topicId: nxTopic3._id, difficulty: "Easy", text: "What is the purpose of layout.tsx?", options: ["To define global CSS styles", "To wrap pages and persist UI across route changes", "To handle API requests", "To define the 404 error page"], correctAnswer: "To wrap pages and persist UI across route changes", explanation: "Layouts preserve state, remain interactive, and do not re-render when navigating between pages." },
      { techId: nextTech._id, topicId: nxTopic3._id, difficulty: "Medium", text: "How do you create a dynamic route parameter like an ID?", options: ["Create a file named [id].tsx", "Create a folder named [id]", "Use the useRouter hook", "Define it in next.config.js"], correctAnswer: "Create a folder named [id]", explanation: "In the App Router, dynamic segments are created by wrapping a folder's name in square brackets, e.g., [id]." }
    ]);

    console.log("Successfully seeded expanded topics for React, Node, and Next.js!");
  } catch (error) {
    console.error("Seed error:", error);
  } finally {
    mongoose.disconnect();
  }
}

seed();
