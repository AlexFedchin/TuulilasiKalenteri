const Joi = require("joi");

const bookingValidationSchema = Joi.object({
  plateNumber: Joi.string()
    .pattern(/^[A-Z0-9]{1,4}[-\s]?[A-Z0-9]{1,4}[-\s]?[A-Z0-9]{0,4}$/)
    .min(2)
    .max(10)
    .required()
    .messages({
      "string.pattern.base": "Plate number must follow the specified format.",
      "string.min": "Plate number must be at least 2 characters long.",
      "string.max": "Plate number must not exceed 10 characters.",
      "any.required": "Plate number is required.",
    }),
  isWorkDone: Joi.boolean().required().messages({
    "any.required": "Work done status is required.",
    "boolean.base": "Work done status must be a boolean.",
  }),
  phoneNumber: Joi.string()
    .pattern(/^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/)
    .min(10)
    .max(20)
    .required()
    .messages({
      "string.pattern.base": "Phone number must follow the specified format.",
      "string.min": "Phone number must be at least 10 characters long.",
      "string.max": "Phone number must not exceed 20 characters.",
      "any.required": "Phone number is required.",
    }),
  carModel: Joi.string().min(2).max(25).required().messages({
    "string.min": "Car model must be at least 2 characters long.",
    "string.max": "Car model must not exceed 25 characters.",
    "any.required": "Car model is required.",
  }),
  eurocode: Joi.string().min(2).max(20).required().messages({
    "string.min": "Eurocode must be at least 2 characters long.",
    "string.max": "Eurocode must not exceed 20 characters.",
    "any.required": "Eurocode is required.",
  }),
  price: Joi.number().min(0).required().messages({
    "number.min": "Price must be at least 0.",
    "any.required": "Price is required.",
  }),
  inStock: Joi.boolean().required().messages({
    "any.required": "In-stock status is required.",
    "boolean.base": "In-stock status must be a boolean.",
  }),
  warehouseLocation: Joi.string()
    .min(2)
    .max(50)
    .when("inStock", {
      is: true,
      then: Joi.required(),
      otherwise: Joi.allow(""),
    })
    .messages({
      "string.min": "Warehouse location must be at least 2 characters long.",
      "string.max": "Warehouse location must not exceed 50 characters.",
      "any.required": "Warehouse location is required when in stock.",
    }),
  clientType: Joi.string().valid("private", "company").required().messages({
    "any.only": "Client type must be either 'private' or 'company'.",
    "any.required": "Client type is required.",
  }),
  payerType: Joi.string()
    .valid("person", "company", "insurance")
    .required()
    .messages({
      "any.only": "Payer type must be 'person', 'company', or 'insurance'.",
      "any.required": "Payer type is required.",
    }),
  insuranceCompany: Joi.string()
    .valid(
      "pohjolaVakuutus",
      "lahiTapiola",
      "ifVakuutus",
      "fennia",
      "turva",
      "pohjantahti",
      "alandia",
      "other"
    )
    .when("payerType", {
      is: "insurance",
      then: Joi.required(),
      otherwise: Joi.allow(""),
    })
    .messages({
      "any.only": "Insurance company must be one of the predefined values.",
      "any.required":
        "Insurance company is required when payer type is 'insurance'.",
    }),
  insuranceCompanyName: Joi.string()
    .min(2)
    .max(50)
    .when("payerType", {
      is: "insurance",
      then: Joi.when("insuranceCompany", {
        is: "other",
        then: Joi.required(),
        otherwise: Joi.allow(""),
      }),
      otherwise: Joi.allow(""),
    })
    .messages({
      "string.min":
        "Insurance company name must be at least 2 characters long.",
      "string.max": "Insurance company name must not exceed 50 characters.",
      "any.required":
        "Insurance company name is required when insurance company is 'other'.",
    }),
  insuranceNumber: Joi.string()
    .min(5)
    .max(50)
    .when("payerType", {
      is: "insurance",
      then: Joi.required(),
      otherwise: Joi.allow(""),
    })
    .messages({
      "string.min": "Insurance number must be at least 5 characters long.",
      "string.max": "Insurance number must not exceed 50 characters.",
      "any.required":
        "Insurance number is required when payer type is 'insurance'.",
    }),
  date: Joi.date().required().messages({
    "date.base": "Date must be a valid date.",
    "any.required": "Date is required.",
  }),
  duration: Joi.number().min(0.5).max(6).required().messages({
    "number.min": "Duration must be at least 0.5 hours.",
    "number.max": "Duration must not exceed 6 hours.",
    "any.required": "Duration is required.",
  }),
  notes: Joi.string().min(0).max(500).allow("").messages({
    "string.max": "Notes must not exceed 500 characters.",
  }),
  location: Joi.string().length(24).hex().required().allow("").messages({
    "string.length": "Location must be exactly 24 characters long.",
    "string.hex": "Location must be a valid hexadecimal string.",
    "any.required": "Location is required.",
  }),
  invoiceMade: Joi.boolean().required().default(false).messages({
    "any.required": "Invoice made status is required.",
    "boolean.base": "Invoice made status must be a boolean.",
  }),
});

const validateBookingData = (req, res, next) => {
  const { error } = bookingValidationSchema.validate(req.body);
  if (error) {
    const errorMessage = error.details.map((error) => error.message).join(", ");
    return res.status(400).json({ error: errorMessage });
  }

  next();
};

module.exports = validateBookingData;
