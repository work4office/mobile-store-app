/**
 * Custom application error class.
 * Extends the built-in Error with an HTTP statusCode and operational flag.
 */
class AppError extends Error {
  /**
   * @param {string} message - Human-readable error message
   * @param {number} statusCode - HTTP status code (e.g. 400, 404, 500)
   */
  constructor(message, statusCode) {
    super(message);

    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true; // trusted, expected errors

    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;
