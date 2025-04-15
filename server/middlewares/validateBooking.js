const Joi = require("joi");

const bookingValidationSchema = Joi.object({
  carMake: Joi.string().min(2).max(50).required(),
  carModel: Joi.string().min(2).max(50).required(),
  plateNumber: Joi.string().min(2).max(20).required(),
  insuranceNumber: Joi.string().min(5).max(50).required(),
  date: Joi.date().required(),
  duration: Joi.number().min(1).required(),
  location: Joi.string().length(24).hex(),
});

const validateBookingData = (req, res, next) => {
  const { error } = bookingValidationSchema.validate(req.body);
  if (error) {
    const errorMessage = error.details.map((error) => error.message).join(", ");
    return res.status(400).json({ error: errorMessage });
  }

  next();
};

module.exports = validateBookingData;
