import dotenv from 'dotenv';

// Load env vars BEFORE anything else
dotenv.config({ path: './config.env' });

// ─── Handle Uncaught Exceptions ──────────────────────────
process.on('uncaughtException', (err) => {
  console.error('UNCAUGHT EXCEPTION 💥 Shutting down...');
  console.error(err.name, err.message);
  process.exit(1);
});

import app from './app.js';
import connectDB from './config/db.js';

// ─── Connect to Database ────────────────────────────────
connectDB();

const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, () => {
  console.log(`Book Tour API running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});

// ─── Handle Unhandled Promise Rejections ─────────────────
process.on('unhandledRejection', (err) => {
  console.error('UNHANDLED REJECTION 💥 Shutting down...');
  console.error(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});