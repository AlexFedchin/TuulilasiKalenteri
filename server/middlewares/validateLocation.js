const Joi = require("joi");

const locationValidationSchema = Joi.object({
  title: Joi.string().min(2).max(50).required(),
  users: Joi.array().items(Joi.string().length(24).hex()),
  bookings: Joi.array().items(Joi.string().length(24).hex()),
});

const validateLocationData = (req, res, next) => {
  const { error } = locationValidationSchema.validate(req.body);
  if (error) {
    const errorMessage = error.details.map((error) => error.message).join(", ");
    return res.status(400).json({ error: errorMessage });
  }

  next();
};

module.exports = validateLocationData;
