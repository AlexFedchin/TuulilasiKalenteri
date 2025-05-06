import Joi from "joi";

export const userValidationSchema = Joi.object({
  username: Joi.string()
    .pattern(/^[a-zA-Z0-9_.-]+$/)
    .min(3)
    .max(30)
    .required()
    .messages({
      "string.pattern.base":
        "Username can only contain letters, numbers, underscores, dots, and hyphens.",
      "string.min": "Username must be at least 3 characters long.",
      "string.max": "Username must not exceed 30 characters.",
      "any.required": "Username is required.",
      "string.empty": "Username cannot be empty.",
    }),
  firstName: Joi.string().min(2).max(50).required().messages({
    "string.min": "First name must be at least 2 characters long.",
    "string.max": "First name must not exceed 50 characters.",
    "any.required": "First name is required.",
    "string.empty": "Email cannot be empty.",
  }),
  lastName: Joi.string().min(2).max(50).required().messages({
    "string.min": "Last name must be at least 2 characters long.",
    "string.max": "Last name must not exceed 50 characters.",
    "any.required": "Last name is required.",
    "string.empty": "Email cannot be empty.",
  }),
  role: Joi.string().valid("regular", "admin").required().messages({
    "any.only": "Role must be either 'regular' or 'admin'.",
    "any.required": "Role is required.",
  }),
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .required()
    .messages({
      "string.email": "Please provide a valid email address.",
      "any.required": "Email is required.",
      "string.empty": "Email cannot be empty.",
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
