const Joi = require("joi");

const orderValidationSchema = Joi.object({
  eurocode: Joi.string().min(2).max(20).required().messages({
    "string.base": "Eurocode must be a string.",
    "string.empty": "Eurocode is required.",
    "string.min": "Eurocode must be at least 2 characters long.",
    "string.max": "Eurocode must be at most 20 characters long.",
    "any.required": "Eurocode is required.",
  }),
  client: Joi.string()
    .required()
    .valid(
      "pauli",
      "vip",
      "maalarium",
      "tammerwheels",
      "colormaster",
      "rantaperkionkatu",
      "other"
    )
    .messages({
      "string.base": "Client must be a string.",
      "any.only": "Client must be one of the predefined values.",
    }),
  clientName: Joi.string()
    .min(2)
    .max(50)
    .when("client", {
      is: "other",
      then: Joi.required(),
    })
    .messages({
      "string.base": "Client name must be a string.",
      "string.empty": "Client name is required when client is 'other'.",
      "string.min": "Client name must be at least 2 characters long.",
      "string.max": "Client name must be at most 50 characters long.",
      "any.required": "Client name is required when client is 'other'.",
    }),
  notes: Joi.string().max(500).allow("").messages({
    "string.base": "Notes must be a string.",
    "string.max": "Notes must be at most 500 characters long.",
  }),
});

const validateOrderData = (req, res, next) => {
  const { error } = orderValidationSchema.validate(req.body);
  if (error) {
    const errorMessage = error.details.map((error) => error.message).join(", ");
    return res.status(400).json({ error: errorMessage });
  }

  next();
};

module.exports = validateOrderData;
