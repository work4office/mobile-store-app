import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema(
  {
    tourId: {
      type: mongoose.Schema.ObjectId,
      ref: 'Tour',
      required: [true, 'Booking must belong to a tourId'],
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'Booking must belong to a user'],
    },
    price: {
      type: Number,
      required: [true, 'Booking must have a price'],
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'cancelled'],
      default: 'pending',
    },
    paid: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Prevent duplicate bookings
bookingSchema.index({ tourId: 1, user: 1 }, { unique: true });

// Auto-populate tour and user on find
// bookingSchema.pre(/^find/, function (next) {
//   this.populate({ path: 'user', select: 'name email' }).populate({
//     path: 'tour',
//     select: 'name',
//   });
//   next();
// });

const Booking = mongoose.model('Booking', bookingSchema);

export default Booking;
