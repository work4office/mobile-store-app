const express = require('express');
const bookingController = require('../controllers/bookingController');
const { protect, restrictTo } = require('../middlewares/auth');

const router = express.Router({ mergeParams: true }); // mergeParams for nested routes

// All booking routes require authentication
router.use(protect);

router
  .route('/')
  .get(bookingController.getAllBookings)
  .post(bookingController.createBooking);

router
  .route('/:id')
  .get(bookingController.getBooking)
  .patch(restrictTo('admin'), bookingController.updateBooking)
  .delete(restrictTo('admin'), bookingController.deleteBooking);

module.exports = router;
