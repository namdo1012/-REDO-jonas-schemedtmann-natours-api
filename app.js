// Run with powershell: $env:NODE_ENV='production'; $env:PORT='5000'; nodemon server.js
// Run with script in package.json: "set NODE_ENV='production'&& set NAMDO='5000'&& nodemon server.js"

const express = require('express');
const morgan = require('morgan');
const tourRouter = require('./route/tourRoute');

const dotenv = require('dotenv');

const AppError = require('./utils/AppError');
const globalErrorHandler = require('./controller/errorController');

dotenv.config({ path: './config.env' });

const app = express();
console.log(process.env);

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use(express.json()); // To read req.body in POST

// Router Middleware
app.use('/api/v1/tours', tourRouter);

// Error: Not handled routes
app.all('*', (req, res, next) => {
  next(new AppError(404, 'This route have been not defined yet!'));
});

// Error handling
app.use(globalErrorHandler);

module.exports = app;
