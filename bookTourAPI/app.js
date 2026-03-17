import express from 'express';
import requestLogger from './utils/logger.js';
import AppError from './utils/appError.js';
import globalErrorHandler from './controllers/errorController.js';

// Route imports
import tourRoutes from './routes/tourRoutes.js';
import userRoutes from './routes/userRoutes.js';
import bookingRoutes from './routes/bookingRoutes.js';

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
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/bookings', bookingRoutes);

// ─── Handle Undefined Routes ─────────────────────────────
app.all('{*path}', (req, res, next) => {
  next(new AppError(`Cannot find ${req.originalUrl} on this server!`, 404));
});

// ─── Global Error Handler ────────────────────────────────
app.use(globalErrorHandler);

export default app;