import express from 'express';
import * as bookingController from '../controllers/bookingController.js';
import { protect, restrictTo } from '../middlewares/auth.js';
import {
  validateCreateBooking,
  validateUpdateBooking,
} from '../validators/bookingValidator.js';

const router = express.Router({ mergeParams: true }); // mergeParams for nested routes

// All booking routes require authentication
router.use(protect);

router
  .route('/')
  .get(restrictTo('admin'), bookingController.getAllBookings)
  .post(validateCreateBooking, bookingController.createBooking);

router
  .route('/:id')
  .get(bookingController.getBooking)
  .patch(restrictTo('admin'), validateUpdateBooking, bookingController.updateBooking)
  .delete(restrictTo('admin'), bookingController.deleteBooking);

export default router;
