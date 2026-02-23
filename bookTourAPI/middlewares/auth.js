const jwt = require('jsonwebtoken');
const asyncHandler = require('./asyncHandler');
const AppError = require('../utils/appError');
const User = require('../models/userModel');

/**
 * Protect routes – verifies the JWT token and attaches the user to req.
 */
const protect = asyncHandler(async (req, res, next) => {
  // 1) Get token from Authorization header
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(
      new AppError('You are not logged in. Please log in to get access.', 401)
    );
  }

  // 2) Verify token
  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  // 3) Check if user still exists
  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return next(
      new AppError('The user belonging to this token no longer exists.', 401)
    );
  }

  // 4) Attach user to request
  req.user = currentUser;
  next();
});

/**
 * Restrict access to specific roles.
 * @param  {...string} roles - Allowed roles, e.g. 'admin', 'user'
 */
const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError('You do not have permission to perform this action.', 403)
      );
    }
    next();
  };
};

module.exports = { protect, restrictTo };
