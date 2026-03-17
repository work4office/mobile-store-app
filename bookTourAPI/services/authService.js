import crypto from "crypto";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import User from "../models/userModel.js";
import AppError from "../utils/appError.js";
import Email from "../utils/email.js";

/**
 * Generate a signed JWT for the given user id.
 */
const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "4h",
  });

const createSendToken = (user, req, res) => {
  const token = signToken(user._id);

  res.cookie("jwt", token, {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000,
    ),
    httpOnly: true, // cookie cannot be accessed or modified in any way by the browser
    secure: req.secure || req.headers["x-forwarded-proto"] === "https",
  });

  // Remove password from output
  user.password = undefined;

  return {
    token,
    data: {
      user,
    },
  };
};

/**
 * Create a new user and return user + token.
 */
export const signup = async (body) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const [newUser] = await User.create(
      [
        {
          name: body.name,
          email: body.email,
          password: body.password,
          confirmPassword: body.confirmPassword,
        },
      ],
      { session },
    );

    const token = signToken(newUser._id);

    await session.commitTransaction();

    // Remove password from output
    newUser.password = undefined;
    newUser.confirmPassword = undefined;

    return { user: newUser, token };
  } catch (err) {
    await session.abortTransaction();
    throw err;
  } finally {
    session.endSession();
  }
};

/**
 * Authenticate a user by email/password and return user + token.
 */
export const login = async (email, password) => {
  // 1) Check email & password exist
  if (!email || !password) {
    throw new AppError("Please provide email and password", 400);
  }

  // 2) Check user exists & password is correct
  const user = await User.findOne({ email }).select("+password");

  if (!user || !(await user.isCorrectPassword(password))) {
    throw new AppError("Incorrect email or password", 401);
  }

  const token = signToken(user._id);

  // Remove password from output
  user.password = undefined;

  return { user, token };
};

export const forgotPassword = async (req) => {
  // 1) Get user based on POSTed email
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    throw new AppError("There is no user with email address.", 404);
  }

  // 2) Generate the random reset token
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  // 3) Send it to user's email
  try {
    const resetURL = `${req.protocol}://${req.get(
      "host",
    )}/api/v1/users/resetPassword/${resetToken}`;
    await new Email(user, resetURL).sendPasswordReset();
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });

    throw new AppError(
      "There was an error sending the email. Try again later!",
      500,
    );
  }
};

export const resetPassword = async (req, res) => {
  // 1) Get user based on the token
  const hashedToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  // 2) If token has not expired, and there is user, set the new password
  if (!user) {
    throw new AppError("Token is invalid or has expired", 400);
  }
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  // 3) Update passwordChangedAt property for the user
  // 4) Log the user in, send JWT
  return createSendToken(user, req, res);
};

export const updatePassword = async (req, res) => {
  // 1) Get user from collection
  const user = await User.findById(req.user.id).select("+password");

  // 2) Check if Posted current password is correct
  if (!(await user.isCorrectPassword(req.body.currentPassword, user.password))) {
    throw new AppError("Your current password is wrong.", 401);
  }

  // 3) If so, update password
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  await user.save();
  // User.findByIdAndUpdate will NOT work as intended!

  // 4) Log user in, send JWT
  return createSendToken(user, req, res);
};
