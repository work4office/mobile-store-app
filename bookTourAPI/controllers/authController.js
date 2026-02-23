const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const asyncHandler = require('../middlewares/asyncHandler');
const AppError = require('../utils/appError');

/**
 * Generate a signed JWT for the given user id.
 */
const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '90d',
  });

/**
 * Create token and send it in the response.
 */
const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);

  // Remove password from output
  user.password = undefined;

  res.status(statusCode).json({
    status: 'success',
    token,
    data: { user },
  });
};

// ─── Sign Up ──────────────────────────────────────────────
exports.signup = asyncHandler(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    role: req.body.role,
  });

  createSendToken(newUser, 201, res);
});

// ─── Log In ───────────────────────────────────────────────
exports.login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  // 1) Check email & password exist
  if (!email || !password) {
    return next(new AppError('Please provide email and password', 400));
  }

  // 2) Check user exists & password is correct
  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await user.isCorrectPassword(password))) {
    return next(new AppError('Incorrect email or password', 401));
  }

  // 3) Send token
  createSendToken(user, 200, res);
});
