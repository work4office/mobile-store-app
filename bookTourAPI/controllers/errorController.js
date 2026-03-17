import * as errorService from '../services/errorService.js';

/**
 * Global error-handling middleware
 */
const globalErrorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  if (process.env.NODE_ENV === "development") {
    errorService.sendErrorDev(err, res);
  } else {
    let error = { ...err, message: err.message };

    if (err.name === "CastError") error = errorService.handleCastErrorDB(error);
    if (err.code === 11000) error = errorService.handleDuplicateFieldsDB(error);
    if (err.name === "ValidationError")
      error = errorService.handleValidationErrorDB(error);
    if (err.name === "JsonWebTokenError") error = errorService.handleJWTError();
    if (err.name === "TokenExpiredError")
      error = errorService.handleJWTExpiredError();

    errorService.sendErrorProd(error, res);
  }
};

export default globalErrorHandler;
