const fs = require('fs');
const path = require('path');

const dataPath = path.resolve(__dirname, '../data/seed-data.json');
let seedData = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));

const newData = [
  {
    name: "Python",
    description: "An interpreted, high-level, general-purpose programming language.",
    topics: [
      {
        title: "Lists vs Tuples",
        order: 1,
        content: "<h2>Data Structures</h2><p>Lists are mutable sequences, meaning their elements can be changed after creation. Tuples are immutable sequences.</p>",
        questions: [
          {
            text: "Which of the following is true about Tuples in Python?",
            options: ["They are mutable", "They are immutable", "They can only contain integers", "They are declared using square brackets []"],
            correctAnswer: "They are immutable",
            difficulty: "Easy",
            explanation: "Tuples cannot be modified after they are created."
          }
        ]
      },
      {
        title: "Decorators",
        order: 2,
        content: "<h2>Decorators</h2><p>A decorator is a design pattern in Python that allows a user to add new functionality to an existing object without modifying its structure.</p>",
        questions: [
          {
            text: "Which symbol is used to apply a decorator in Python?",
            options: ["#", "$", "@", "%"],
            correctAnswer: "@",
            difficulty: "Medium",
            explanation: "The @ symbol is syntactic sugar for passing a function into another function (the decorator)."
          }
        ]
      }
    ]
  },
  {
    name: "SQL",
    description: "Structured Query Language for storing, manipulating and retrieving data in databases.",
    topics: [
      {
        title: "JOINs",
        order: 1,
        content: "<h2>SQL JOINs</h2><p>A JOIN clause is used to combine rows from two or more tables, based on a related column between them.</p>",
        questions: [
          {
            text: "Which JOIN returns all records when there is a match in either left or right table?",
            options: ["INNER JOIN", "LEFT JOIN", "RIGHT JOIN", "FULL OUTER JOIN"],
            correctAnswer: "FULL OUTER JOIN",
            difficulty: "Medium",
            explanation: "FULL OUTER JOIN returns all matching records from both tables whether the other table matches or not."
          }
        ]
      }
    ]
  }
];

seedData.push(...newData);
fs.writeFileSync(dataPath, JSON.stringify(seedData, null, 2));
console.log("Appended Python and SQL to seed-data.json");
