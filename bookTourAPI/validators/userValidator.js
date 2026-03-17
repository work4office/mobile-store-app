import Joi from 'joi';
import AppError from '../utils/appError.js';

/**
 * Joi schema for signing up a new user.
 */
const signupSchema = Joi.object({
  name: Joi.string().trim().max(50).required(),
  email: Joi.string().email().lowercase().trim().required(),
  password: Joi.string().min(8).required(),
  confirmPassword: Joi.string().valid(Joi.ref("password")).required().messages({
    "any.only": "Confirm password must match password",
  }),
  role: Joi.string().valid("user", "admin"),
  active: Joi.boolean()
});

/**
 * Joi schema for logging in.
 */
const loginSchema = Joi.object({
  email: Joi.string().email().lowercase().trim().required(),
  password: Joi.string().required(),
});

/**
 * Joi schema for forgotPassword.
 */
const forgotPasswordSchema = Joi.object({
  email: Joi.string().email().lowercase().trim().required(),
});

/**
 * Joi schema for resetPassword.
 */
const resetPasswordSchema = Joi.object({
  password: Joi.string().min(8).required(),
  confirmPassword: Joi.string().valid(Joi.ref("password")).required().messages({
    "any.only": "Confirm password must match password",
  }),
});

/**
 * Joi schema for a logged-in user updating their own profile.
 */
const updateMeSchema = Joi.object({
  name: Joi.string().trim().max(50),
  email: Joi.string().email().lowercase().trim(),
}).min(1);

/**
 * Joi schema for a logged-in user updating their password.
 */
const updatePasswordSchema = Joi.object({
  currentPassword: Joi.string().required(),
  password: Joi.string().min(8).required(),
  confirmPassword: Joi.string().valid(Joi.ref("password")).required().messages({
    "any.only": "Confirm password must match password",
  }),
});

/**
 * Joi schema for an admin updating any user.
 */
const updateUserSchema = Joi.object({
  name: Joi.string().trim().max(50),
  email: Joi.string().email().lowercase().trim(),
  role: Joi.string().valid("user", "admin"),
  active: Joi.boolean()
}).min(1);

/**
 * Middleware factory – validates req.body against the given Joi schema.
 * @param {Joi.ObjectSchema} schema
 */
const validateBody = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body, { abortEarly: false });
  if (error) {
    const messages = error.details.map((d) => d.message).join(". ");
    return next(new AppError(messages, 400));
  }
  next();
};

export const validateSignup = validateBody(signupSchema);
export const validateLogin = validateBody(loginSchema);
export const validateForgotPassword = validateBody(forgotPasswordSchema);
export const validateResetPassword = validateBody(resetPasswordSchema);
export const validateUpdatePassword = validateBody(updatePasswordSchema);
export const validateUpdateMe = validateBody(updateMeSchema);
export const validateUpdateUser = validateBody(updateUserSchema);
