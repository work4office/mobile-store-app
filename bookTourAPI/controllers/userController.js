import asyncHandler from '../middlewares/asyncHandler.js';
import * as userService from '../services/userService.js';

// ─── Get All Users ──────────────────────────────────────
export const getAllUsers = asyncHandler(async (req, res, next) => {
  const users = await userService.findAll(req.query);

  res.status(200).json({
    status: 'success',
    results: users.length,
    data: { users },
  });
});

// ─── Get User By ID ──────────────────────────────────────
export const getUser = asyncHandler(async (req, res, next) => {
  const user = await userService.findById(req.params.id);

  res.status(200).json({
    status: 'success',
    data: { user },
  });
});

// ─── Update User (admin) ────────────────────────────────
export const updateUser = asyncHandler(async (req, res, next) => {
  const user = await userService.update(req.params.id, req.body);

  res.status(200).json({
    status: 'success',
    data: { user },
  });
});

// ─── Delete User ─────────────────────────────────────────
export const deleteUser = asyncHandler(async (req, res, next) => {
  await userService.deleteUser(req.params.id);

  res.status(204).json({
    status: 'success',
    data: null,
  });
});

// ─── Get Currently Logged-In User Profile ────────────────
export const getMe = asyncHandler(async (req, res, next) => {
  const user = await userService.findById(req.user.id);

  res.status(200).json({
    status: 'success',
    data: { user },
  });
});

// ─── Update My Profile (logged-in user) ──────────────────
export const updateMe = asyncHandler(async (req, res, next) => {
  const updatedUser = await userService.updateMe(req.user.id, req.body);

  res.status(200).json({
    status: 'success',
    data: { user: updatedUser },
  });
});

// ─── Deactivate My Account ──────────────────────────────
export const deleteMe = asyncHandler(async (req, res, next) => {
  await userService.deactivate(req.user.id);

  res.status(204).json({
    status: 'success',
    data: null,
  });
});
