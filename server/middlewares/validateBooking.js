const Joi = require("joi");

const bookingValidationSchema = Joi.object({
  plateNumber: Joi.string()
    .pattern(/^[A-Za-z]{1,3}-[0-9]{1,3}$/)
    .min(2)
    .max(10)
    .required(),
  isWorkDone: Joi.boolean().required(),
  phoneNumber: Joi.string()
    .pattern(
      /^((04[0-9]{1})(\s?|-?)|050(\s?|-?)|0457(\s?|-?)|[+]?358(\s?|-?)50|0358(\s?|-?)50|00358(\s?|-?)50|[+]?358(\s?|-?)4[0-9]{1}|0358(\s?|-?)4[0-9]{1}|00358(\s?|-?)4[0-9]{1})(\s?|-?)(([0-9]{3,4})(\s|-)?[0-9]{1,4})$/
    )
    .min(10)
    .max(20)
    .required(),
  isWorkDone: Joi.boolean().required(),
  carModel: Joi.string().min(2).max(25).required(),
  eurocode: Joi.string().min(2).max(20).required(),
  inStock: Joi.boolean().required(),
  warehouseLocation: Joi.string()
    .min(2)
    .max(50)
    .when("inStock", {
      is: true,
      then: Joi.required(),
      otherwise: Joi.allow(""),
    }),
  clientType: Joi.string().valid("private", "company").required(),
  payerType: Joi.string().valid("person", "company", "insurance").required(),
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
    }),
  insuranceNumber: Joi.string()
    .min(5)
    .max(50)
    .when("payerType", {
      is: "insurance",
      then: Joi.required(),
      otherwise: Joi.allow(""),
    }),
  date: Joi.date().required(),
  duration: Joi.number().min(0.5).max(6).required(),
  notes: Joi.string().min(0).max(500).allow(""),
  location: Joi.string().length(24).hex().required().allow(""),
  invoiceMade: Joi.boolean().required().default(false),
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
