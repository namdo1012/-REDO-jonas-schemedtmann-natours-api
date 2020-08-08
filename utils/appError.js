class AppError extends Error {
  constructor(statusCode, message) {
    super(message);

    this.statusCode = statusCode;
    this.status = this.statusCode.toString().startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;

    // Hide implementation of constructor from stacktrace (Error.stack)
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;
