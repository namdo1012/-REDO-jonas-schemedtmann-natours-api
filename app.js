// start:prod: "$env:NODE_ENV="ok"; $env:PORT="5000"; nodemon server.js"
const express = require('express');
const tourRouter = require('./route/tourRoute');

const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });

const app = express();

app.use(express.json()); // To read req.body in POST

// Router Middleware
app.use('/api/v1/tours', tourRouter);

module.exports = app;
