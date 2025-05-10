const Joi = require("joi");

const passwordValidationSchema = Joi.object({
  password: Joi.string()
    .required()
    .trim()
    .pattern(/^[a-zA-Z0-9_.-]+$/)
    .min(8)
    .max(128)
    .messages({
      "string.pattern.base":
        "Password can only contain letters, numbers, underscores, dots, and hyphens.",
      "string.min": "Password must be at least 8 characters long.",
      "string.max": "Password must not exceed 128 characters.",
      "any.required": "Password is required.",
      "string.empty": "Password cannot be empty.",
    }),
});

const validatePassword = () => (req, res, next) => {
  console.log("Validating password...");
  const { error } = passwordValidationSchema.validate(req.body);

  if (error) {
    console.error("Password validation error:", error.details);
    const errorMessage = error.details.map((error) => error.message).join(", ");
    return res.status(400).json({ error: errorMessage });
  }

  next();
};

module.exports = validatePassword;
