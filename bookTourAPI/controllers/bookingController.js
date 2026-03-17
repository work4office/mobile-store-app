import asyncHandler from "../middlewares/asyncHandler.js";
import * as bookingService from "../services/bookingService.js";

// ─── Get All Bookings ────────────────────────────────────────
export const getAllBookings = asyncHandler(async (req, res, next) => {
  const bookings = await bookingService.findAll(req);

  res.status(200).json({
    status: "success",
    results: bookings.length,
    data: { bookings },
  });
});

// ─── Get Booking By ID ──────────────────────────────────
export const getBooking = asyncHandler(async (req, res, next) => {
  const booking = await bookingService.findById(req.params.id, req.user);

  res.status(200).json({
    status: "success",
    data: { booking },
  });
});

// ─── Create Booking ─────────────────────────────────────
export const createBooking = asyncHandler(async (req, res, next) => {
  const newBooking = await bookingService.create(req.body);

  res.status(201).json({
    status: "success",
    data: { booking: newBooking },
  });
});

// ─── Update Booking ─────────────────────────────────────
export const updateBooking = asyncHandler(async (req, res, next) => {
  const booking = await bookingService.update(req.params.id, req.body);

  res.status(200).json({
    status: "success",
    data: { booking },
  });
});

// ─── Delete Booking ─────────────────────────────────────
export const deleteBooking = asyncHandler(async (req, res, next) => {
  await bookingService.deleteBooking(req.params.id);

  res.status(204).json({
    status: "success",
    data: null,
  });
});
