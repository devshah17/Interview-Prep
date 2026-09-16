const fs = require('fs');
const path = require('path');

const dataPath = path.resolve(__dirname, '../data/seed-data.json');
const rawData = fs.readFileSync(dataPath, 'utf-8');
const seedData = JSON.parse(rawData);

// Find the indices
const tsIndex = seedData.findIndex(t => t.name === "TypeScript");
const mongoIndex = seedData.findIndex(t => t.name === "MongoDB");
const sdIndex = seedData.findIndex(t => t.name === "System Design");

// Add advanced TS topics
if (tsIndex !== -1) {
  seedData[tsIndex].topics.push(
    {
      title: "Utility Types & Mapped Types",
      order: 3,
      content: "<h2>Utility Types</h2><p>TypeScript provides several utility types (Partial, Pick, Omit, Record) to facilitate common type transformations.</p><h2>Mapped Types</h2><p>A mapped type is a generic type which uses a union of PropertyKeys (frequently created via a keyof) to iterate through keys to create a type.</p>",
      questions: [
        {
          text: "Which utility type constructs a type with all properties of T set to optional?",
          options: ["Omit<T>", "Partial<T>", "Readonly<T>", "Pick<T>"],
          correctAnswer: "Partial<T>",
          difficulty: "Medium",
          explanation: "Partial<T> returns a type representing all subsets of a given type."
        },
        {
          text: "What does the `keyof` operator do?",
          options: ["Returns the value of a key", "Takes an object type and produces a string or numeric literal union of its keys", "Iterates over an array", "Checks if a key exists in an object at runtime"],
          correctAnswer: "Takes an object type and produces a string or numeric literal union of its keys",
          difficulty: "Hard",
          explanation: "The keyof operator produces a union type of all public property names of a given type."
        }
      ]
    },
    {
      title: "Type Guards & Narrowing",
      order: 4,
      content: "<h2>Narrowing</h2><p>TypeScript can narrow types down to more specific types using type guards like <code>typeof</code>, <code>instanceof</code>, or custom type predicate functions returning <code>arg is Type</code>.</p>",
      questions: [
        {
          text: "How do you define a custom type guard in TypeScript?",
          options: ["By returning a boolean", "By using the `is` keyword in the return type (e.g., `animal is Fish`)", "By using the `as` keyword", "By throwing an Error on type mismatch"],
          correctAnswer: "By using the `is` keyword in the return type (e.g., `animal is Fish`)",
          difficulty: "Hard",
          explanation: "A custom type guard function must return a type predicate in the form `parameterName is Type`."
        }
      ]
    }
  );
}

// Add advanced MongoDB topics
if (mongoIndex !== -1) {
  seedData[mongoIndex].topics.push(
    {
      title: "Indexing & Performance",
      order: 3,
      content: "<h2>Indexes</h2><p>Indexes support the efficient execution of queries in MongoDB. Without indexes, MongoDB must perform a collection scan, i.e. scan every document in a collection, to select those documents that match the query statement.</p>",
      questions: [
        {
          text: "Which of the following is true about Compound Indexes?",
          options: ["They can only contain two fields", "The order of fields in the index does not matter", "The order of fields matters due to the ESR (Equality, Sort, Range) rule", "They are created automatically for every collection"],
          correctAnswer: "The order of fields matters due to the ESR (Equality, Sort, Range) rule",
          difficulty: "Hard",
          explanation: "In compound indexes, field order is crucial. The ESR rule is a guideline for ordering fields: Equality first, then Sort, then Range."
        }
      ]
    },
    {
      title: "Replication & Sharding",
      order: 4,
      content: "<h2>Scaling MongoDB</h2><p><strong>Replication (Replica Sets):</strong> Provides redundancy and high availability.<br/><strong>Sharding:</strong> Distributes data across multiple machines (Horizontal scaling).</p>",
      questions: [
        {
          text: "In a MongoDB Replica Set, what happens if the Primary node goes down?",
          options: ["The database becomes completely inaccessible forever", "An election is held among the Secondary nodes to choose a new Primary", "A Secondary node is randomly assigned without an election", "Data is lost"],
          correctAnswer: "An election is held among the Secondary nodes to choose a new Primary",
          difficulty: "Medium",
          explanation: "Replica sets provide automatic failover through an election process."
        }
      ]
    }
  );
}

// Add advanced System Design topics
if (sdIndex !== -1) {
  seedData[sdIndex].topics.push(
    {
      title: "Message Queues & Event-Driven Architecture",
      order: 3,
      content: "<h2>Asynchronous Processing</h2><p>Message queues (like RabbitMQ, Kafka, SQS) are used to decouple heavy processing, to buffer or batch work, and to smooth spiky workloads.</p>",
      questions: [
        {
          text: "Which of the following best describes Apache Kafka?",
          options: ["An in-memory caching store", "A relational database", "A distributed event streaming platform", "A frontend framework"],
          correctAnswer: "A distributed event streaming platform",
          difficulty: "Medium",
          explanation: "Kafka is optimized for high-throughput, low-latency event streaming and log aggregation."
        }
      ]
    },
    {
      title: "CAP Theorem",
      order: 4,
      content: "<h2>The CAP Theorem</h2><p>States that it is impossible for a distributed data store to simultaneously provide more than two out of the following three guarantees: Consistency, Availability, and Partition tolerance.</p>",
      questions: [
        {
          text: "In the context of the CAP Theorem, what does Partition Tolerance mean?",
          options: ["The system can be divided into smaller tables", "The system continues to operate despite an arbitrary number of messages being dropped/delayed by the network", "The data is partitioned equally across disks", "Every read receives the most recent write"],
          correctAnswer: "The system continues to operate despite an arbitrary number of messages being dropped/delayed by the network",
          difficulty: "Hard",
          explanation: "Partition tolerance implies the system functions even if network partitions occur."
        },
        {
          text: "Which combination does a typical relational database (like PostgreSQL) prioritize?",
          options: ["AP (Availability & Partition Tolerance)", "CA (Consistency & Availability)", "CP (Consistency & Partition Tolerance)", "None of the above"],
          correctAnswer: "CA (Consistency & Availability)",
          difficulty: "Hard",
          explanation: "Traditional RDBMS prioritize Consistency and Availability, but generally fail under network partitions (they are not typically distributed by default)."
        }
      ]
    }
  );
}

fs.writeFileSync(dataPath, JSON.stringify(seedData, null, 2));
console.log("Appended advanced topics to TS, Mongo, and System Design in seed-data.json");
