const fs = require('fs');
const path = require('path');

const dataPath = path.resolve(__dirname, '../data/seed-data.json');
const rawData = fs.readFileSync(dataPath, 'utf-8');
const seedData = JSON.parse(rawData);

const newData = [
  {
    name: "TypeScript",
    description: "A strongly typed programming language that builds on JavaScript, giving you better tooling at any scale.",
    topics: [
      {
        title: "Interfaces vs Types",
        order: 1,
        content: "<h2>Interfaces and Type Aliases</h2><p>Both can be used to describe the shape of an object. Interfaces are better for public API definitions because they support declaration merging, whereas types can be used for unions, primitives, and mapped types.</p>",
        questions: [
          {
            text: "Which feature is unique to Interfaces and cannot be done with Type Aliases?",
            options: ["Creating Union Types", "Declaration Merging", "Intersection Types", "Defining Primitive Aliases"],
            correctAnswer: "Declaration Merging",
            difficulty: "Medium",
            explanation: "Interfaces with the same name in the same scope will merge their declarations, which is highly useful for extending third-party libraries. Type aliases will throw an error."
          }
        ]
      },
      {
        title: "Generics",
        order: 2,
        content: "<h2>Understanding Generics</h2><p>Generics allow you to create reusable components that can work over a variety of types rather than a single one.</p>",
        questions: [
          {
            text: "What does <T> typically represent in TypeScript?",
            options: ["A special HTML tag", "A generic type parameter", "A Tuple declaration", "A throwing function"],
            correctAnswer: "A generic type parameter",
            difficulty: "Easy",
            explanation: "T is commonly used as a placeholder variable for a Generic Type."
          }
        ]
      }
    ]
  },
  {
    name: "MongoDB",
    description: "A document-based, NoSQL database program that uses JSON-like documents with optional schemas.",
    topics: [
      {
        title: "NoSQL Concepts & Documents",
        order: 1,
        content: "<h2>Document Model</h2><p>MongoDB stores data in flexible, JSON-like documents. This means fields can vary from document to document and data structure can be changed over time.</p>",
        questions: [
          {
            text: "In MongoDB, a single record is called a:",
            options: ["Row", "Table", "Document", "Collection"],
            correctAnswer: "Document",
            difficulty: "Easy",
            explanation: "In MongoDB, data is stored in BSON Documents (binary JSON), analogous to rows in a relational database."
          }
        ]
      },
      {
        title: "Aggregation Framework",
        order: 2,
        content: "<h2>Aggregations</h2><p>The aggregation pipeline is a framework for data aggregation modeled on the concept of data processing pipelines. Documents enter a multi-stage pipeline that transforms the documents into aggregated results.</p>",
        questions: [
          {
            text: "Which aggregation stage is used to filter documents?",
            options: ["$group", "$match", "$project", "$sort"],
            correctAnswer: "$match",
            difficulty: "Medium",
            explanation: "$match filters the documents to pass only the documents that match the specified condition(s) to the next pipeline stage."
          }
        ]
      }
    ]
  },
  {
    name: "System Design",
    description: "The process of defining the architecture, modules, interfaces, and data for a system to satisfy specified requirements.",
    topics: [
      {
        title: "Scaling: Vertical vs Horizontal",
        order: 1,
        content: "<h2>Scaling Methods</h2><p><strong>Vertical Scaling (Scale-Up):</strong> Adding more power (CPU, RAM) to your existing machine.<br/><strong>Horizontal Scaling (Scale-Out):</strong> Adding more machines to your pool of resources.</p>",
        questions: [
          {
            text: "What is a primary disadvantage of Vertical Scaling?",
            options: ["It requires rewriting the codebase", "It has a hard hardware limit and creates a single point of failure", "It requires complex load balancers", "Data consistency is difficult to maintain"],
            correctAnswer: "It has a hard hardware limit and creates a single point of failure",
            difficulty: "Medium",
            explanation: "You can only add so much RAM or CPU to one machine, and if that machine goes down, the entire system is down."
          }
        ]
      },
      {
        title: "Caching Strategies",
        order: 2,
        content: "<h2>Caching</h2><p>Caching stores copies of frequently accessed data in a temporary, fast-access storage layer (like Redis or Memcached). Strategies include Cache-Aside, Read-Through, and Write-Through.</p>",
        questions: [
          {
            text: "In the Cache-Aside pattern, what happens when a cache miss occurs?",
            options: ["The cache automatically fetches data from the DB", "The application queries the DB, returns the data, and writes it to the cache", "The request is rejected", "The database writes it to the cache directly"],
            correctAnswer: "The application queries the DB, returns the data, and writes it to the cache",
            difficulty: "Hard",
            explanation: "In Cache-Aside, the application code is responsible for checking the cache, querying the database on a miss, and then updating the cache."
          }
        ]
      }
    ]
  }
];

seedData.push(...newData);
fs.writeFileSync(dataPath, JSON.stringify(seedData, null, 2));
console.log("Appended TypeScript, MongoDB, and System Design to seed-data.json");
