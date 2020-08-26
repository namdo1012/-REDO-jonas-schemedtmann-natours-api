// Run with powershell: $env:NODE_ENV='production'; $env:PORT='5000'; nodemon server.js
// Run with script in package.json: "set NODE_ENV='production'&& set NAMDO='5000'&& nodemon server.js"

const express = require('express');
const tourRouter = require('./route/tourRoute');
const userRouter = require('./route/userRoute');
const reviewRouter = require('./route/reviewRoute');

const dotenv = require('dotenv');
const rateLimiter = require('express-rate-limit');
const morgan = require('morgan');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');

const path = require('path');

const AppError = require('./utils/AppError');
const globalErrorHandler = require('./controller/errorController');

dotenv.config({ path: './config.env' });

const app = express();

// Setting up view engine
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'view'));

app.route('/').get((req, res, next) => {
  res.render('base');
});

// GLOBAL MIDDLEWARE
// SECURE: HTTP Headers
app.use(helmet());

// SECURE: Limit amount of requests from 1 IP -> avoid brute force
const limiter = rateLimiter({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP, please try again in an hour!',
});
app.use('/api', limiter);

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Data sanitization against XSS
app.use(xss());

// Prevent parameter pollution
app.use(
  hpp({
    whitelist: [
      'duration',
      'ratingsQuantity',
      'ratingsAverage',
      'maxGroupSize',
      'difficulty',
      'price',
    ],
  })
);

console.log(`You currently in ${process.env.NODE_ENV} mode!`);

app.use(express.json({ limit: '10kb' })); // To read req.body in POST

// Check token in request's header middleware
// To send jwt through req's header, set Header Key = 'Authorization', Header Value = 'Bearer jwt'
// app.use((req, res, next) => {
//   console.log(req.headers);
//   next();
// });

// Router Middleware
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);

// Error: Not handled routes
app.all('*', (req, res, next) => {
  next(new AppError(404, 'This route have been not defined yet!'));
});

// Error handling
app.use(globalErrorHandler);

module.exports = app;
