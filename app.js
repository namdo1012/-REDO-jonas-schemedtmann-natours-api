// Run with powershell: $env:NODE_ENV='production'; $env:PORT='5000'; nodemon server.js
// Run with script in package.json: "set NODE_ENV='production'&& set NAMDO='5000'&& nodemon server.js"

const express = require('express');
const morgan = require('morgan');
const tourRouter = require('./route/tourRoute');

const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });

const app = express();

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use(express.json()); // To read req.body in POST

// Router Middleware
app.use('/api/v1/tours', tourRouter);

app.all('*', (req, res, next) => {
  res.status(404).json({
    status: 'fail',
    message: 'This route have been not defined yet',
  });

  next();
});

module.exports = app;
