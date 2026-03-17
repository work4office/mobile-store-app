import AppError from '../utils/appError.js';

/**
 * Send detailed error in development
 */
export const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

/**
 * Send clean error in production
 */
export const sendErrorProd = (err, res) => {
  if (err.isOperational) {
    // Trusted, expected error – send to client
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    // Programming / unknown error – don't leak details
    console.error("ERROR 💥", err);
    res.status(500).json({
      status: "error",
      message: "Something went wrong!",
    });
  }
};

/**
 * Handle specific Mongoose / JWT errors and convert to AppError
 */
export const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}`;
  return new AppError(message, 400);
};

export const handleDuplicateFieldsDB = (err) => {
  const value = err.errmsg.match(/(["'])(\\?.)*?\1/)?.[0];
  const message = `Duplicate field value: ${value}. Please use another value.`;
  return new AppError(message, 400);
};

export const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);
  const message = `Invalid input data. ${errors.join(". ")}`;
  return new AppError(message, 400);
};

export const handleJWTError = () =>
  new AppError("Invalid token. Please log in again.", 401);

export const handleJWTExpiredError = () =>
  new AppError("Your token has expired. Please log in again.", 401);
