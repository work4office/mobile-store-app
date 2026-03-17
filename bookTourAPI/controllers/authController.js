import asyncHandler from "../middlewares/asyncHandler.js";
import * as authService from "../services/authService.js";

// ─── Sign Up ──────────────────────────────────────────────
export const signup = asyncHandler(async (req, res, next) => {
  const { user, token } = await authService.signup(req.body);

  res.status(201).json({
    status: "success",
    token,
    data: { user },
  });
});

// ─── Log In ───────────────────────────────────────────────
export const login = asyncHandler(async (req, res, next) => {
  const { user, token } = await authService.login(
    req.body.email,
    req.body.password,
  );

  res.status(200).json({
    status: "success",
    token,
    data: { user },
  });
});

export const forgotPassword = asyncHandler(async (req, res, next) => {
  await authService.forgotPassword(req);

  res.status(200).json({
    status: "success",
    message: "Token sent to email!",
  });
});

export const resetPassword = asyncHandler(async (req, res, next) => {
  const { user, token } = await authService.resetPassword(req, res);

  res.status(200).json({
    status: "success",
    token,
    data: { user },
  });
});

export const updatePassword = asyncHandler(async (req, res, next) => {
  const { user, token } = await authService.updatePassword(req, res);

  res.status(200).json({
    status: "success",
    token,
    data: { user },
  });
});
