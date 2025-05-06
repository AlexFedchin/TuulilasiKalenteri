import Joi from "joi";

export const orderValidationSchema = Joi.object({
  products: Joi.array()
    .items(
      Joi.object({
        eurocode: Joi.string().min(2).max(20).required().messages({
          "string.base": "Eurocode must be a string.",
          "string.empty": "Eurocode is required.",
          "string.min": "Eurocode must be at least 2 characters long.",
          "string.max": "Eurocode must not exceed 20 characters.",
          "any.required": "Eurocode is required.",
        }),
        amount: Joi.number().integer().min(1).required().messages({
          "number.base": "Amount must be a number.",
          "number.integer": "Amount must be an integer.",
          "number.min": "Amount must be at least 1.",
          "any.required": "Amount is required.",
        }),
        price: Joi.number().integer().min(0).required().messages({
          "number.base": "Price must be a number.",
          "number.integer": "Price must be an integer.",
          "number.min": "Price must be at least 0.",
          "any.required": "Price is required.",
        }),
        status: Joi.string()
          .valid("inStock", "order")
          .default("inStock")
          .messages({
            "string.base": "Status must be a string.",
            "any.only": "Status must be either 'In Stock' or 'Order'.",
          }),
      })
    )
    .required()
    .messages({
      "array.base": "Products must be an array.",
      "array.includesRequiredUnknowns":
        "Each product must have eurocode, amount, and price.",
      "any.required": "Products are required.",
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
      otherwise: Joi.allow(""),
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
