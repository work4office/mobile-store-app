const Booking = require('../models/bookingModel');
const asyncHandler = require('../middlewares/asyncHandler');
const AppError = require('../utils/appError');
const APIFeatures = require('../utils/queryBuilder');

// ─── Get All Bookings ────────────────────────────────────
exports.getAllBookings = asyncHandler(async (req, res, next) => {
  // Allow nested route: GET /tours/:tourId/bookings
  let filter = {};
  if (req.params.tourId) filter = { tour: req.params.tourId };

  const features = new APIFeatures(Booking.find(filter), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();

  const bookings = await features.query;

  res.status(200).json({
    status: 'success',
    results: bookings.length,
    data: { bookings },
  });
});

// ─── Get Booking By ID ──────────────────────────────────
exports.getBooking = asyncHandler(async (req, res, next) => {
  const booking = await Booking.findById(req.params.id);

  if (!booking) {
    return next(new AppError('No booking found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: { booking },
  });
});

// ─── Create Booking ─────────────────────────────────────
exports.createBooking = asyncHandler(async (req, res, next) => {
  // Attach logged-in user if not explicitly set
  if (!req.body.user) req.body.user = req.user.id;
  if (!req.body.tour && req.params.tourId) req.body.tour = req.params.tourId;

  const newBooking = await Booking.create(req.body);

  res.status(201).json({
    status: 'success',
    data: { booking: newBooking },
  });
});

// ─── Update Booking ─────────────────────────────────────
exports.updateBooking = asyncHandler(async (req, res, next) => {
  const booking = await Booking.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!booking) {
    return next(new AppError('No booking found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: { booking },
  });
});

// ─── Delete Booking ─────────────────────────────────────
exports.deleteBooking = asyncHandler(async (req, res, next) => {
  const booking = await Booking.findByIdAndDelete(req.params.id);

  if (!booking) {
    return next(new AppError('No booking found with that ID', 404));
  }

  res.status(204).json({
    status: 'success',
    data: null,
  });
});
