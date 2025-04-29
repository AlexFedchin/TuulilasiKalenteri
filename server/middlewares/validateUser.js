const Joi = require("joi");

const userValidationSchema = Joi.object({
  username: Joi.string()
    .pattern(/^[a-zA-Z0-9_.-]+$/)
    .min(3)
    .max(30)
    .when(Joi.ref("$isEdit"), {
      is: true,
      then: Joi.allow(""),
      otherwise: Joi.required().messages({
        "any.required": "Username is required.",
        "string.empty": "Username cannot be empty.",
      }),
    })
    .messages({
      "string.pattern.base":
        "Username can only contain letters, numbers, underscores, dots, and hyphens.",
      "string.min": "Username must be at least 3 characters long.",
      "string.max": "Username must not exceed 30 characters.",
    }),
  firstName: Joi.string()
    .min(2)
    .max(50)
    .when(Joi.ref("$isEdit"), {
      is: true,
      then: Joi.allow(""),
      otherwise: Joi.required().messages({
        "any.required": "First name is required.",
        "string.empty": "First name cannot be empty.",
      }),
    })
    .messages({
      "string.min": "First name must be at least 2 characters long.",
      "string.max": "First name must not exceed 50 characters.",
    }),
  lastName: Joi.string()
    .min(2)
    .max(50)
    .when(Joi.ref("$isEdit"), {
      is: true,
      then: Joi.allow(""),
      otherwise: Joi.required().messages({
        "any.required": "Last name is required.",
        "string.empty": "Last name cannot be empty.",
      }),
    })
    .messages({
      "string.min": "Last name must be at least 2 characters long.",
      "string.max": "Last name must not exceed 50 characters.",
    }),
  role: Joi.string()
    .valid("regular", "admin")
    .when(Joi.ref("$isEdit"), {
      is: true,
      then: Joi.allow(""),
      otherwise: Joi.required().messages({
        "any.required": "Role is required.",
        "string.empty": "Role cannot be empty.",
      }),
    })
    .messages({
      "any.only": "Role must be either 'regular' or 'admin'.",
    }),
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .when(Joi.ref("$isEdit"), {
      is: true,
      then: Joi.allow(""),
      otherwise: Joi.required().messages({
        "any.required": "Email is required.",
        "string.empty": "Email cannot be empty.",
      }),
    })
    .messages({
      "string.email": "Please provide a valid email address.",
    }),
  password: Joi.string()
    .pattern(/^[a-zA-Z0-9_.-]+$/)
    .min(8)
    .max(128)
    .when(Joi.ref("$isEdit"), {
      is: true,
      then: Joi.string().allow(""),
      otherwise: Joi.string().required().messages({
        "any.required": "Password is required.",
        "string.empty": "Password cannot be empty.",
      }),
    })
    .messages({
      "string.pattern.base":
        "Password can only contain letters, numbers, underscores, dots, and hyphens.",
      "string.min": "Password must be at least 8 characters long.",
      "string.max": "Password must not exceed 128 characters.",
    }),
  location: Joi.string()
    .length(24)
    .hex()
    .when(Joi.ref("$isEdit"), {
      is: true,
      then: Joi.string().allow(""),
      otherwise: Joi.string().required().messages({
        "any.required": "Location is required.",
        "string.empty": "Location cannot be empty.",
      }),
    })
    .messages({
      "string.length": "Location ID must be exactly 24 characters long.",
      "string.hex": "Location ID must be a valid hexadecimal string.",
    }),
});

const validateUserData = (isEdit) => (req, res, next) => {
  const { error } = userValidationSchema.validate(req.body, {
    context: { isEdit },
  });

  if (error) {
    const errorMessage = error.details.map((error) => error.message).join(", ");
    return res.status(400).json({ error: errorMessage });
  }

  next();
};

module.exports = validateUserData;
