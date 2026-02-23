/**
 * Wraps an async route handler / middleware so that any rejected
 * promise is automatically forwarded to Express's error-handling
 * middleware via next(err).
 *
 * Usage:
 *   router.get('/tours', asyncHandler(async (req, res, next) => { ... }));
 */
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = asyncHandler;
