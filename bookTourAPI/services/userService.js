import User from '../models/userModel.js';
import AppError from '../utils/appError.js';
import QueryBuilder from '../utils/queryBuilder.js';

export const findAll = async (queryString) => {
  const features = new QueryBuilder(User.find(), queryString)
    .filter()
    .sort()
    .limitFields()
    .paginate();

  const users = await features.query;
  if (!users || users.length === 0) throw new AppError("No users found", 404);
  return users;
};

export const findById = async (id) => {
  const user = await User.findById(id);
  if (!user) throw new AppError("No user found with that ID", 404);
  return user;
};

export const update = async (id, body) => {
  const user = await User.findByIdAndUpdate(id, body, {
    new: true,
    runValidators: true,
  });
  if (!user) throw new AppError("No user found with that ID", 404);
  return user;
};

export const deleteUser = async (id) => {
  const user = await User.findByIdAndDelete(id);
  if (!user) throw new AppError("No user found with that ID", 404);
  return user;
};

export const updateMe = async (userId, body) => {
  if (body.password) {
    throw new AppError(
      "This route is not for password updates. Please use /update-password.",
      400,
    );
  }

  // Filter allowed fields
  const filteredBody = {};
  const allowedFields = ["name", "email"];
  Object.keys(body).forEach((key) => {
    if (allowedFields.includes(key)) filteredBody[key] = body[key];
  });

  const updatedUser = await User.findByIdAndUpdate(userId, filteredBody, {
    new: true,
    runValidators: true,
  });
  if (!updatedUser) throw new AppError("No user found with that ID", 404);
  return updatedUser;
};

export const deactivate = async (userId) => {
  const user = await User.findByIdAndUpdate(userId, { active: false });
  if (!user) throw new AppError("No user found with that ID", 404);
};
