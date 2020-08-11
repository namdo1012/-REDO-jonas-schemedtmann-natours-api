const AppError = require('./../utils/appError');

const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}.`;
  return new AppError(400, message);
};

const handleDuplicateFieldsDB = (err) => {
  // const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];
  const value = Object.keys(err.keyPattern)[0];

  const message = `Duplicate field value: ${value}. Please use another value!`;
  return new AppError(400, message);
};
const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);

  const message = `Invalid input data. ${errors.join('. ')}`;
  return new AppError(400, message);
};

const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

const sendErrorProd = (err, res) => {
  // Operational, trusted error: send message to client
  // console.log(err);
  if (err.isOperational) {
    // res.status(err.statusCode).json({
    //   status: err.status,
    //   message: err.message,
    // });
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });

    // Programming or other unknown error: don't leak error details
  } else {
    // 1) Log error
    // console.error('ERROR ', err);

    // 2) Send generic message
    res.status(500).json({
      status: 'error',
      message: 'Something went very wrong!',
    });
  }
};

module.exports = (err, req, res, next) => {
  // console.log(err.stack);

  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === 'production') {
    let error = { ...err };
    // Send wrong ID Error
    if (error.kind === 'ObjectId') error = handleCastErrorDB(error);
    // Dupplicate unique fields in database
    if (error.code === 11000) error = handleDuplicateFieldsDB(error);
    // if (error.name === 'ValidationError')
    if (error._message.search('validation') !== -1) {
      // console.log(error._message.search('validations'));
      error = handleValidationErrorDB(error);
    }

    sendErrorProd(error, res);
  }
};
