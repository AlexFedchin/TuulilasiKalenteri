const Joi = require("joi");

const bookingValidationSchema = Joi.object({
  title: Joi.string().min(2).max(50).required(),
  date: Joi.date().required(),
  location: Joi.string().min(2).max(50).required(),
});

const validateBookingData = (req, res, next) => {
  const { error } = bookingValidationSchema.validate(req.body);
  if (error) {
    const errorMessage = error.details.map((error) => error.message).join(", ");
    return res.status(400).json({ errors: errorMessage });
  }

  next();
};

module.exports = validateBookingData;
