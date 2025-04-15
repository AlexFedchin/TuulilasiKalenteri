const Joi = require("joi");

const updateUserValidationSchema = Joi.object({
  firstName: Joi.string().min(2).max(50),
  lastName: Joi.string().min(2).max(50),
  role: Joi.string().valid("regular", "admin"),
  email: Joi.string().email(),
  password: Joi.string().min(8).max(128),
  location: Joi.string().length(24).hex(),
});

const validateUpdateUserData = (req, res, next) => {
  const { error } = updateUserValidationSchema.validate(req.body);
  if (error) {
    const errorMessage = error.details.map((error) => error.message).join(", ");
    return res.status(400).json({ error: errorMessage });
  }

  next();
};

module.exports = validateUpdateUserData;
