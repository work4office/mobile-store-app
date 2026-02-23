const asyncHandler = require('../middlewares/asyncHandler');
const tourService = require('../services/tourService');

// ─── Get All Tours ───────────────────────────────────────
exports.getAllTours = asyncHandler(async (req, res, next) => {
  const tours = await tourService.findAll(req.query);

  res.status(200).json({
    status: 'success',
    results: tours.length,
    data: { tours },
  });
});

// ─── Get Tour By ID ──────────────────────────────────────
exports.getTour = asyncHandler(async (req, res, next) => {
  const tour = await tourService.findById(req.params.id);

  res.status(200).json({
    status: 'success',
    data: { tour },
  });
});

// ─── Create Tour ─────────────────────────────────────────
exports.createTour = asyncHandler(async (req, res, next) => {
  const { tours, count } = await tourService.create(req.body, req.user?.id);

  res.status(201).json({
    status: 'success',
    results: count,
    data: { tours },
  });
});

// ─── Update Tour ─────────────────────────────────────────
exports.updateTour = asyncHandler(async (req, res, next) => {
  const tour = await tourService.update(req.params.id, req.body);

  res.status(200).json({
    status: 'success',
    data: { tour },
  });
});

// ─── Delete Tour ─────────────────────────────────────────
exports.deleteTour = asyncHandler(async (req, res, next) => {
  await tourService.delete(req.params.id);

  res.status(204).json({
    status: 'success',
    data: null,
  });
});