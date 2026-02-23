const express = require('express');
const authController = require('../controllers/authController');
const userController = require('../controllers/userController');
const { protect, restrictTo } = require('../middlewares/auth');

const router = express.Router();

// ─── Public routes ───────────────────────────────────────
router.post('/signup', authController.signup);
router.post('/login', authController.login);

// ─── Protected routes (must be logged in) ────────────────
router.use(protect); // all routes below require auth

router.get('/me', userController.getMe);
router.patch('/update-me', userController.updateMe);
router.delete('/delete-me', userController.deleteMe);

// ─── Admin-only routes ──────────────────────────────────
router.use(restrictTo('admin'));

router
  .route('/')
  .get(userController.getAllUsers);

router
  .route('/:id')
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

module.exports = router;
