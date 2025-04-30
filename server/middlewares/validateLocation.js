const Joi = require("joi");

const locationValidationSchema = Joi.object({
  title: Joi.string().min(2).max(50).required().messages({
    "string.base": "Title must be a string.",
    "string.empty": "Title is required and cannot be empty.",
    "string.min": "Title must be at least 2 characters long.",
    "string.max": "Title cannot exceed 50 characters.",
    "any.required": "Title is a required field.",
  }),
  users: Joi.array()
    .items(
      Joi.string().length(24).hex().messages({
        "string.base": "Each user ID must be a string.",
        "string.length": "Each user ID must be exactly 24 characters long.",
        "string.hex": "Each user ID must be a valid hexadecimal string.",
      })
    )
    .messages({
      "array.base": "Users must be an array of user IDs.",
    }),
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
