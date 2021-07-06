const express = require('express');
const helmet = require('helmet');
const morgan = require('morgan');
const userRouter = require('./users/userRouter.js');
const postRouter = require('./posts/postRouter.js');
const server = express();

server.use(express.json());
server.use(helmet());
server.use(logger);

server.use('/api/users', userRouter);
server.use('/api/posts',postRouter);

server.get('/', (req, res) => {
  res.send(`<h2>go to /api/users</h2>`);
});

//custom middleware

function logger(req, res, next) {
  console.log(`${req.method} Request to ${req.url} at [${new Date().toISOString()}]  `)
  next();
}
function errorHandler(error, req, res, next) {
  console.log('error:', error.message);
  const code = error.status || error.statusCode || 400;
  res.status(code).json(error);
}
server.use(errorHandler);

module.exports = server;
