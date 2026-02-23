const express = require('express');
const tourController = require('../controllers/tourController');
const bookingRouter = require('./bookingRoutes');
const { protect, restrictTo } = require('../middlewares/auth');
const { validateCreateTour, validateUpdateTour } = require('../validators/tourValidator');

const router = express.Router();

// ─── Nested route: /tours/:tourId/bookings ───────────────
// router.use('/:tourId/bookings', bookingRouter);

// ─── Public routes ───────────────────────────────────────
router
  .route('/')
  .get(tourController.getAllTours)
  .post(validateCreateTour, tourController.createTour);
    //protect, restrictTo('admin'), 

// router
//   .route('/:id')
//   .get(tourController.getTour)
//   .patch(protect, restrictTo('admin'), validateUpdateTour, tourController.updateTour)
//   .delete(protect, restrictTo('admin'), tourController.deleteTour);

module.exports = router;
