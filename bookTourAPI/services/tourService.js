import Tour from '../models/tourModel.js';
import AppError from '../utils/appError.js';
import QueryBuilder from '../utils/queryBuilder.js';

export const findAll = async (queryString) => {
  const features = new QueryBuilder(Tour.find(), queryString)
    .filter()
    .sort()
    .limitFields()
    .paginate();

  const tours = await features.query;
  if (!tours || tours.length === 0) throw new AppError("No tours found", 404);
  return tours;
};

export const findById = async (id) => {
  const tour = await Tour.findById(id);
  //.populate("bookings");
  if (!tour) throw new AppError("No tour found with that ID", 404);
  return tour;
};

export const create = async (body, userId) => {
  const isArray = Array.isArray(body);
  const items = isArray ? body : [body];

  if (userId) {
    items.forEach((item) => (item.createdBy = userId));
  }

  const newTours = await Tour.create(items);
  if (!newTours) throw new AppError("Failed to create tour(s)", 400);
  return { tours: isArray ? newTours : newTours[0], count: newTours.length };
};

export const update = async (id, body) => {
  const tour = await Tour.findByIdAndUpdate(id, body, {
    new: true,
    runValidators: true,
  });
  if (!tour) throw new AppError("No tour found with that ID", 404);
  return tour;
};

export const deleteTour = async (id) => {
  const tour = await Tour.findByIdAndDelete(id);
  if (!tour) throw new AppError("No tour found with that ID", 404);
  return tour;
};

export const tourStatistics = async () => {
  const pipeline = [
    {
      $match: { ratingsAverage: { $gte: 4.5 } },
    },
    {
      $group: {
        _id: { $toUpper: "$difficulty" },
        numTours: { $sum: 1 },
        numRatings: { $sum: "$ratingsQuantity" },
        avgRating: { $avg: "$ratingsAverage" },
        avgPrice: { $avg: "$price" },
        minPrice: { $min: "$price" },
        maxPrice: { $max: "$price" },
      },
    },
    {
      $sort: { avgPrice: 1 },
    },
  ];
  const aggregation = await Tour.aggregate(pipeline);
  if (!aggregation || aggregation.length === 0)
    throw new AppError("No statistics found", 404);
  return aggregation;
};

export const toursPerMonths = async (year) => {
  const pipeline = [
    {
      $unwind: "$startDates",
    },
    {
      $match: {
        startDates: {
          $gte: new Date(`${year}-01-01`),
          $lte: new Date(`${year}-12-31`),
        },
      },
    },
    {
      $group: {
        _id: { $month: "$startDates" },
        numTours: { $sum: 1 },
        name: { $push: "$name" },
      },
    },
    {
      $addFields: { month: "$_id" },
    },
    {
      $project: {
        _id: 0,
      },
    },
    {
      $sort: { month: 1 },
    },
  ];
  const aggregation = await Tour.aggregate(pipeline);
  if (!aggregation || aggregation.length === 0)
    throw new AppError("No tours found", 404);
  return aggregation;
};
