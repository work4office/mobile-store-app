const User = require('../models/userModel');
const asyncHandler = require('../middlewares/asyncHandler');
const AppError = require('../utils/appError');
const APIFeatures = require('../utils/queryBuilder');

// ─── Get All Users ────────────────────────────────────────
exports.getAllUsers = asyncHandler(async (req, res, next) => {
  const features = new APIFeatures(User.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();

  const users = await features.query;

  res.status(200).json({
    status: 'success',
    results: users.length,
    data: { users },
  });
});

// ─── Get User By ID ──────────────────────────────────────
exports.getUser = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(new AppError('No user found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: { user },
  });
});

// ─── Update User (admin) ────────────────────────────────
exports.updateUser = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!user) {
    return next(new AppError('No user found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: { user },
  });
});

// ─── Delete User ─────────────────────────────────────────
exports.deleteUser = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndDelete(req.params.id);

  if (!user) {
    return next(new AppError('No user found with that ID', 404));
  }

  res.status(204).json({
    status: 'success',
    data: null,
  });
});

// ─── Get Currently Logged-In User Profile ────────────────
exports.getMe = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id);

  res.status(200).json({
    status: 'success',
    data: { user },
  });
});

// ─── Update My Profile (logged-in user) ──────────────────
exports.updateMe = asyncHandler(async (req, res, next) => {
  // Prevent password update through this route
  if (req.body.password) {
    return next(
      new AppError(
        'This route is not for password updates. Please use /update-password.',
        400
      )
    );
  }

  // Filter allowed fields
  const filteredBody = {};
  const allowedFields = ['name', 'email'];
  Object.keys(req.body).forEach((key) => {
    if (allowedFields.includes(key)) filteredBody[key] = req.body[key];
  });

  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: 'success',
    data: { user: updatedUser },
  });
});

// ─── Deactivate My Account ──────────────────────────────
exports.deleteMe = asyncHandler(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false });

  res.status(204).json({
    status: 'success',
    data: null,
  });
});
