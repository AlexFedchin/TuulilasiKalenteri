const Joi = require("joi");

const createUserValidationSchema = Joi.object({
  username: Joi.string().alphanum().min(3).max(30).required(),
  firstName: Joi.string().min(2).max(50),
  lastName: Joi.string().min(2).max(50),
  role: Joi.string().valid("regular", "admin").required(),
  email: Joi.string().email(),
  password: Joi.string().min(8).max(128).required(),
});

const validateCreateUserData = (req, res, next) => {
  const { error } = createUserValidationSchema.validate(req.body);
  if (error) {
    const errorMessage = error.details.map((error) => error.message).join(", ");
    return res.status(400).json({ errors: errorMessage });
  }

  next();
};

module.exports = validateCreateUserData;
