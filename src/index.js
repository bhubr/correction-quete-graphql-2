const express = require('express');
const { buildSchema } = require('graphql');
const { graphqlHTTP } = require('express-graphql');

const schema = buildSchema(`
  type Course {
    id: Int
    title: String
    author: String
    description: String
    topic: String
    url: String
  }
  type Query {
    message: String
    allCourses: [Course]
    course(id: Int!): Course
    courses(topic: String): [Course]
    coursesByTitle(search: String): [Course]
  }
  type Mutation {
    createCourse(title: String, author: String, description: String, topic: String, url: String): [Course]
  }
`);

const coursesData = [
  {
      id: 1,
      title: 'The Complete Node.js Developer Course',
      author: 'Andrew Mead, Rob Percival',
      description: 'Learn Node.js by building real-world applications with Node, Express, MongoDB, Mocha, and more!',
      topic: 'Node.js',
      url: 'https://codingthesmartway.com/courses/nodejs/'
  },
  {
      id: 2,
      title: 'Node.js, Express & MongoDB Dev to Deployment',
      author: 'Brad Traversy',
      description: 'Learn by example building & deploying real-world Node.js applications from absolute scratch',
      topic: 'Node.js',
      url: 'https://codingthesmartway.com/courses/nodejs-express-mongodb/'
  },
  {
      id: 3,
      title: 'JavaScript: Understanding The Weird Parts',
      author: 'Anthony Alicea',
      description: 'An advanced JavaScript course for everyone! Scope, closures, prototypes, this, build your own framework, and more.',
      topic: 'JavaScript',
      url: 'https://codingthesmartway.com/courses/understand-javascript/'
  }
];

// Simuler un "integer auto_increment" à la MySQL
let nextId = coursesData.length + 1;

const getCourse = ({ id }) => {
  return coursesData.find(course => course.id === id);
}

const getCourses = ({ topic }) => {
  if (args.topic) {
    return coursesData.filter(course => course.topic === topic);
  }
  return coursesData;
}

const getCoursesByTitle = ({ search }) => {
  console.log(search, typeof search);
  const searchLower = search.toLowerCase();
  console.log('searchLower', searchLower);
  const courses = coursesData.filter(
    course => course.title.toLowerCase().includes(searchLower)
  );
  return courses;
}

createCourse = (payload) => {
  const newCourse = { id: nextId, ...payload };
  nextId += 1;
  coursesData.push(newCourse);
  return coursesData;
}

const resolver = {
  message: () => 'A simple message',
  allCourses: () => coursesData,
  course: getCourse,
  courses: getCourses,
  coursesByTitle: getCoursesByTitle,
  createCourse,
}

const app = express();

app.use('/graphql', graphqlHTTP({
  schema,
  rootValue: resolver,
  graphiql: true
}));

app.listen(4000, () => console.log('listening'));
