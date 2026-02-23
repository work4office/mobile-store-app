const Joi = require('joi');
const AppError = require('../utils/appError');

/**
 * Joi schema for creating a tour.
 */
const createTourSchema = Joi.object({
  name: Joi.string().trim().max(100).required(),
  duration: Joi.number().positive().required(),
  maxGroupSize: Joi.number().integer().positive().required(),
  difficulty: Joi.string().valid('easy', 'medium', 'difficult').required(),
  ratingsAverage: Joi.number().min(1).max(5).precision(1),
  ratingsQuantity: Joi.number().integer().min(0),
  price: Joi.number().positive().required(),
  priceDiscount: Joi.number().positive(),
  summary: Joi.string().trim().required(),
  description: Joi.string().trim(),
  imageCover: Joi.string().required(),
  images: Joi.array().items(Joi.string()),
  startDates: Joi.array().items(Joi.date()),
});

/**
 * Joi schema for updating a tour (all fields optional).
 */
const updateTourSchema = createTourSchema.fork(
  ['name', 'duration', 'maxGroupSize', 'difficulty', 'price', 'summary', 'imageCover'],
  (schema) => schema.optional()
);

/**
 * Middleware factory – validates req.body against the given Joi schema.
 * Supports both a single object and an array of objects.
 * @param {Joi.ObjectSchema} schema
 */
const validateBody = (schema) => (req, res, next) => {
  const items = Array.isArray(req.body) ? req.body : [req.body];

  for (let i = 0; i < items.length; i++) {
    const { error } = schema.validate(items[i], { abortEarly: false });
    if (error) {
      const messages = error.details.map((d) => d.message).join('. ');
      const prefix = Array.isArray(req.body) ? `Item ${i + 1}: ` : '';
      return next(new AppError(`${prefix}${messages}`, 400));
    }
  }
  next();
};

module.exports = {
  validateCreateTour: validateBody(createTourSchema),
  validateUpdateTour: validateBody(updateTourSchema),
};
