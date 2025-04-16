const Joi = require("joi");

const noteValidationSchema = Joi.object({
  title: Joi.string().min(2).max(50),
  description: Joi.string().min(2).max(100),
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
