const Tour = require("../models/tourModel");
const AppError = require("../utils/appError");
const QueryBuilder = require("../utils/queryBuilder");

exports.findAll = async (queryString) => {
  const features = new QueryBuilder(Tour.find(), queryString)
    .filter()
    .sort()
    .limitFields()
    .paginate();

  return await features.query;
};

exports.findById = async (id) => {
  const tour = await Tour.findById(id).populate("bookings");
  if (!tour) throw new AppError("No tour found with that ID", 404);
  return tour;
};

exports.create = async (body, userId) => {
  const isArray = Array.isArray(body);
  const items = isArray ? body : [body];

  if (userId) {
    items.forEach((item) => (item.createdBy = userId));
  }

  const newTours = await Tour.create(items);
  return { tours: isArray ? newTours : newTours[0], count: newTours.length };
};

exports.update = async (id, body) => {
  const tour = await Tour.findByIdAndUpdate(id, body, {
    new: true,
    runValidators: true,
  });
  if (!tour) throw new AppError("No tour found with that ID", 404);
  return tour;
};

exports.delete = async (id) => {
  const tour = await Tour.findByIdAndDelete(id);
  if (!tour) throw new AppError("No tour found with that ID", 404);
  return tour;
};
