import express from 'express';
import * as tourController from '../controllers/tourController.js';
import bookingRouter from './bookingRoutes.js';
import { protect, restrictTo } from '../middlewares/auth.js';
import {
  validateCreateTour,
  validateUpdateTour,
} from '../validators/tourValidator.js';

const router = express.Router();

// ─── Nested route: /tours/:tourId/bookings ───────────────
router.use('/:tourId/bookings', bookingRouter);

// ─── Public routes ───────────────────────────────────────
router
  .route("/")
  .get(protect, tourController.getAllTours)
  .post(
    protect,
    restrictTo("admin"),
    validateCreateTour,
    tourController.createTour,
  );

router.route("/tour-statistics").get(tourController.getTourStatistics);
router.route("/tours-per-months/:year").get(tourController.getToursPerMonths);

router
  .route("/:id")
  .get(tourController.getTour)
  .patch(
    protect,
    restrictTo("admin"),
    validateUpdateTour,
    tourController.updateTour,
  )
  .delete(protect, restrictTo("admin"), tourController.deleteTour);

export default router;
