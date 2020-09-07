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

const handleJWTError = () => {
  return new AppError(401, 'Invalid token. Please log in again');
};

const handleJWTExpired = () => {
  return new AppError(401, 'Your token has expired! Please log in again.');
};

const sendErrorDev = (err, req, res) => {
  // API
  if (req.originalUrl.startsWith('/api')) {
    return res.status(err.statusCode).json({
      status: err.status,
      error: err,
      message: err.message,
      stack: err.stack,
    });
  }

  // RENDERED WEBSITE
  console.error('ERROR 💥', err); // THis line log wrong error???
  return res.status(err.statusCode).render('error', {
    title: 'Something went wrong!',
    msg: err.message,
  });
};

const sendErrorProd = (err, req, res) => {
  // A) API
  if (req.originalUrl.startsWith('/api')) {
    // 1.Operational, trusted error: send message to client
    if (err.isOperational) {
      return res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
      });
    }

    // 2.Programming or other unknown error: don't leak error details
    // 1) Log error
    console.error('ERROR ', err);
    // 2) Send generic message
    return res.status(500).json({
      status: 'error',
      message: 'Something went very wrong!',
    });
  }

  // B) if not API then RENDERED WEBSITE
  // 1.Operational, trusted error: send message to client
  if (err.isOperational) {
    return res.status(err.statusCode).render('error', {
      title: 'Something went wrong',
      msg: message,
    });
  }

  // 2.Programming or other unknown error: don't leak error details
  // 1) Log error
  console.error('ERROR ', err);
  // 2) Send generic message
  return res.status(500).render({
    title: 'Something went wrong',
    message: 'Something went very wrong! Try again later',
  });
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, req, res);
  } else if (process.env.NODE_ENV === 'production') {
    let error = { ...err };
    error.message = err.message;

    // Send wrong ID Error
    if (error.kind === 'ObjectId') error = handleCastErrorDB(error);
    // Dupplicate unique fields in database
    if (error.code === 11000) error = handleDuplicateFieldsDB(error);

    // Validation wrong: Ex.: 'A tour must have a name'
    // if (error.name === 'ValidationError')
    if (error._message && error._message.search('validation') !== -1) {
      error = handleValidationErrorDB(error);
    }

    if (error.name === 'JsonWebTokenError') error = handleJWTError();
    if (error.name === 'TokenExpiredError') error = handleJWTExpired();
    sendErrorProd(error, req, res);
  }
};
