const Joi = require("joi");

const noteValidationSchema = Joi.object({
  title: Joi.string().min(0).max(50).messages({
    "string.base": "Title must be a string.",
    "string.min": "Title cannot be empty.",
    "string.max": "Title cannot exceed 50 characters.",
  }),
  description: Joi.string().min(0).max(200).messages({
    "string.base": "Description must be a string.",
    "string.min": "Description cannot be empty.",
    "string.max": "Description cannot exceed 200 characters.",
  }),
});

const validateNoteData = (req, res, next) => {
  const { error } = noteValidationSchema.validate(req.body);
  if (error) {
    const errorMessage = error.details.map((error) => error.message).join(", ");
    return res.status(400).json({ error: errorMessage });
  }

  next();
};

module.exports = validateNoteData;
