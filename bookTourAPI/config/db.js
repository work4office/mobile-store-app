const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const connectionString = process.env.DATABASE_CONNECTION_STRING.replace(
      '<PASSWORD>',
      process.env.DATABASE_PASSWORD
    );

    const conn = await mongoose.connect(connectionString);

    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (err) {
    console.error(`Database connection error: ${err.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;