const express = require('express');
const requestLogger = require('./utils/logger');
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');

// Route imports
const tourRoutes = require('./routes/tourRoutes');
const userRoutes = require('./routes/userRoutes');
const bookingRoutes = require('./routes/bookingRoutes');

const app = express();

// ─── Global Middleware ───────────────────────────────────

// HTTP request logging
app.use(requestLogger());

// Body parser – reads JSON bodies into req.body
app.use(express.json({ limit: '1mb' }));

// URL-encoded form parser
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// ─── API Routes ──────────────────────────────────────────
app.use('/api/v1/tours', tourRoutes);
// app.use('/api/v1/users', userRoutes);
// app.use('/api/v1/bookings', bookingRoutes);

// ─── Handle Undefined Routes ─────────────────────────────
app.all('{*path}', (req, res, next) => {
  next(new AppError(`Cannot find ${req.originalUrl} on this server!`, 404));
});

// ─── Global Error Handler ────────────────────────────────
app.use(globalErrorHandler);

module.exports = app;