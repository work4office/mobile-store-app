const AppError = require('../utils/appError');

/**
 * Generic request-body validation middleware factory.
 * Pass in the required field names and it ensures they exist on req.body.
 *
 * Usage:
 *   router.post('/tours', validate('name', 'price', 'duration'), createTour);
 */
const validate = (...requiredFields) => {
  return (req, res, next) => {
    const missing = requiredFields.filter((field) => !req.body[field]);

    if (missing.length > 0) {
      return next(
        new AppError(
          `Missing required fields: ${missing.join(', ')}`,
          400
        )
      );
    }
    next();
  };
};

module.exports = validate;
