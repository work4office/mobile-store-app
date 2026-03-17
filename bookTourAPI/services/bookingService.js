import Booking from "../models/bookingModel.js";
import AppError from "../utils/appError.js";
import QueryBuilder from "../utils/queryBuilder.js";

export const findAll = async (req) => {
  // Allow nested route: GET /tours/:tourId/bookings
  let filter = {};
  if (req.params.tourId) filter = { tour: req.params.tourId };
  const features = new QueryBuilder(Booking.find(filter), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();

  const bookings = await features.query;
  if (!bookings || bookings.length === 0)
    throw new AppError("No bookings found", 404);
  return bookings;
};

export const findById = async (id, user) => {
  const booking = await Booking.findOne({ _id: id, user: user.id });
  if (!booking) throw new AppError("No booking found with that ID", 404);
  return booking;
};

export const create = async (body) => {
  const newBooking = await Booking.create(body);
  if (!newBooking) throw new AppError("Failed to create booking", 400);
  return newBooking;
};

export const update = async (id, body) => {
  const booking = await Booking.findByIdAndUpdate(id, body, {
    new: true,
    runValidators: true,
  });
  if (!booking) throw new AppError("No booking found with that ID", 404);
  return booking;
};

export const deleteBooking = async (id) => {
  const booking = await Booking.findByIdAndDelete(id);
  if (!booking) throw new AppError("No booking found with that ID", 404);
  return booking;
};
