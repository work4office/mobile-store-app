import Joi from 'joi';
import AppError from '../utils/appError.js';

/**
 * Joi schema for creating a booking.
 */
const createBookingSchema = Joi.object({
  tourId: Joi.string().hex().length(24),
  user: Joi.string().hex().length(24),
  price: Joi.number().positive().required(),
  status: Joi.string().valid('pending', 'confirmed', 'cancelled'),
  paid: Joi.boolean(),
});

/**
 * Joi schema for updating a booking (all fields optional).
 */
const updateBookingSchema = Joi.object({
  tourId: Joi.string().hex().length(24),
  user: Joi.string().hex().length(24),
  price: Joi.number().positive(),
  status: Joi.string().valid('pending', 'confirmed', 'cancelled'),
  paid: Joi.boolean(),
}).min(1);

/**
 * Middleware factory – validates req.body against the given Joi schema.
 * @param {Joi.ObjectSchema} schema
 */
const validateBody = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body, { abortEarly: false });
  if (error) {
    const messages = error.details.map((d) => d.message).join('. ');
    return next(new AppError(messages, 400));
  }
  next();
};

export const validateCreateBooking = validateBody(createBookingSchema);
export const validateUpdateBooking = validateBody(updateBookingSchema);
