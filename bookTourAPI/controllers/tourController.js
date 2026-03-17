import asyncHandler from '../middlewares/asyncHandler.js';
import * as tourService from '../services/tourService.js';

// ─── Get All Tours ───────────────────────────────────────
export const getAllTours = asyncHandler(async (req, res, next) => {
  const tours = await tourService.findAll(req.query);

  res.status(200).json({
    status: 'success',
    results: tours.length,
    data: { tours },
  });
});

// ─── Get Tour By ID ──────────────────────────────────────
export const getTour = asyncHandler(async (req, res, next) => {
  const tour = await tourService.findById(req.params.id);

  res.status(200).json({
    status: 'success',
    data: { tour },
  });
});

// ─── Create Tour ─────────────────────────────────────────
export const createTour = asyncHandler(async (req, res, next) => {
  const { tours, count } = await tourService.create(req.body, req.user?.id);

  res.status(201).json({
    status: 'success',
    results: count,
    data: { tours },
  });
});

// ─── Update Tour ─────────────────────────────────────────
export const updateTour = asyncHandler(async (req, res, next) => {
  const tour = await tourService.update(req.params.id, req.body);

  res.status(200).json({
    status: 'success',
    data: { tour },
  });
});

// ─── Delete Tour ─────────────────────────────────────────
export const deleteTour = asyncHandler(async (req, res, next) => {
  await tourService.deleteTour(req.params.id);

  res.status(204).json({
    status: 'success',
    data: null,
  });
});

// ─── Aggregate Tour ───────────────────────────────────────
export const getTourStatistics = asyncHandler(async (req, res, next) => {
  const aggregation = await tourService.tourStatistics();

  res.status(200).json({
    status: 'success',
    data: { aggregation },
  });
});

// ─── Aggregate Tour ───────────────────────────────────
export const getToursPerMonths = asyncHandler(async (req, res, next) => {
  const aggregation = await tourService.toursPerMonths(req.params.year);

  res.status(200).json({
    status: 'success',
    data: { aggregation },
  });
});