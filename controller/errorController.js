const AppError = require('./../utils/appError.js');

const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

const sendErrorProd = (err, res) => {
  // Can trusted error, operational error
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });

    // App Error --> just send a generic message
  } else {
    // Log the error to console
    console.error('ERROR!!!', err);
    // Send mess to clients
    res.status(500).json({
      status: 'error',
      message: 'Something went very wrong!',
    });
  }
};

module.exports = globalErrorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  // If development enviroment: Send all infos about error to developers
  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, res);

    // If production enviroment: Just send message to clients
  } else if (process.env.NODE_ENV === 'production') {
    sendErrorProd(err, res);
  }
};
