import express from "express";
import * as authController from "../controllers/authController.js";
import * as userController from "../controllers/userController.js";
import { protect, restrictTo } from "../middlewares/auth.js";
import {
  validateSignup,
  validateLogin,
  validateForgotPassword,
  validateResetPassword,
  validateUpdateMe,
  validateUpdateUser,
  validateUpdatePassword,
} from "../validators/userValidator.js";

const router = express.Router();

// ─── Public routes ───────────────────────────────────────
router.post("/signup", validateSignup, authController.signup);
router.post("/login", validateLogin, authController.login);

router.post(
  "/forgotPassword",
  validateForgotPassword,
  authController.forgotPassword,
);
router.patch(
  "/resetPassword/:token",
  validateResetPassword,
  authController.resetPassword,
);

// ─── Protected routes (must be logged in) ────────────────
router.use(protect); // all routes below require auth

router.get("/me", userController.getMe);
router.patch("/update-me", validateUpdateMe, userController.updateMe);
router.delete("/delete-me", userController.deleteMe);
router.patch(
  "/updatePassword",
  validateUpdatePassword,
  authController.updatePassword,
);

// ─── Admin-only routes ──────────────────────────────────
router.use(restrictTo("admin"));

router.route("/").get(userController.getAllUsers);

router
  .route("/:id")
  .get(userController.getUser)
  .patch(validateUpdateUser, userController.updateUser)
  .delete(userController.deleteUser);

export default router;
