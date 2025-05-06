import Joi from "joi";
import { t } from "i18next";

export const bookingValidationSchema = Joi.object({
  plateNumber: Joi.string()
    .pattern(/^[A-Z0-9]{1,4}[-\s]?[A-Z0-9]{1,4}[-\s]?[A-Z0-9]{0,4}$/)
    .min(2)
    .max(14)
    .required()
    .messages({
      "string.pattern.base": t("bookingValidationSchema.plateNumber.pattern"),
      "string.min": t("bookingValidationSchema.plateNumber.min"),
      "string.max": t("bookingValidationSchema.plateNumber.max"),
      "any.required": t("bookingValidationSchema.plateNumber.required"),
    }),
  isWorkDone: Joi.boolean()
    .required()
    .messages({
      "any.required": t("bookingValidationSchema.isWorkDone.required"),
    }),
  phoneNumber: Joi.string()
    .pattern(/^[+]?[(]?[0-9]{3}[)]?[-\s.]?\s?[0-9]{3}[-\s.]?\s?[0-9]{4,6}$/)
    .min(10)
    .max(20)
    .required()
    .messages({
      "string.pattern.base": t("bookingValidationSchema.phoneNumber.pattern"),
      "string.min": t("bookingValidationSchema.phoneNumber.min"),
      "string.max": t("bookingValidationSchema.phoneNumber.max"),
      "any.required": t("bookingValidationSchema.phoneNumber.required"),
    }),
  carModel: Joi.string()
    .min(2)
    .max(25)
    .required()
    .messages({
      "string.min": t("bookingValidationSchema.carModel.min"),
      "string.max": t("bookingValidationSchema.carModel.max"),
      "any.required": t("bookingValidationSchema.carModel.required"),
    }),
  eurocode: Joi.string()
    .min(2)
    .max(20)
    .required()
    .messages({
      "string.min": t("bookingValidationSchema.eurocode.min"),
      "string.max": t("bookingValidationSchema.eurocode.max"),
      "any.required": t("bookingValidationSchema.eurocode.required"),
    }),
  price: Joi.number()
    .min(0)
    .required()
    .messages({
      "number.min": t("bookingValidationSchema.price.min"),
      "any.required": t("bookingValidationSchema.price.required"),
    }),
  inStock: Joi.boolean()
    .required()
    .messages({
      "any.required": t("bookingValidationSchema.inStock.required"),
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
      "string.min": t("bookingValidationSchema.warehouseLocation.min"),
      "string.max": t("bookingValidationSchema.warehouseLocation.max"),
      "any.required": t("bookingValidationSchema.warehouseLocation.required"),
    }),
  isOrdered: Joi.boolean()
    .when("inStock", {
      is: false,
      then: Joi.required(),
    })
    .default(false)
    .messages({
      "any.required": t("bookingValidationSchema.isOrdered.required"),
      "boolean.base": t("bookingValidationSchema.isOrdered.boolean"),
    }),
  clientType: Joi.string()
    .valid("private", "company")
    .required()
    .messages({
      "any.only": t("bookingValidationSchema.clientType.only"),
      "any.required": t("bookingValidationSchema.clientType.required"),
    }),
  companyName: Joi.string()
    .min(2)
    .max(50)
    .allow("")
    .messages({
      "string.min": t("bookingValidationSchema.companyName.min"),
      "string.max": t("bookingValidationSchema.companyName.max"),
    }),
  payerType: Joi.string()
    .valid("person", "company", "insurance")
    .required()
    .messages({
      "any.only": t("bookingValidationSchema.payerType.only"),
      "any.required": t("bookingValidationSchema.payerType.required"),
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
      "any.only": t("bookingValidationSchema.insuranceCompany.only"),
      "any.required": t("bookingValidationSchema.insuranceCompany.required"),
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
      "string.min": t("bookingValidationSchema.insuranceCompanyName.min"),
      "string.max": t("bookingValidationSchema.insuranceCompanyName.max"),
      "any.required": t(
        "bookingValidationSchema.insuranceCompanyName.required"
      ),
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
      "string.min": t("bookingValidationSchema.insuranceNumber.min"),
      "string.max": t("bookingValidationSchema.insuranceNumber.max"),
      "any.required": t("bookingValidationSchema.insuranceNumber.required"),
    }),
  deductible: Joi.number()
    .min(0)
    .when("payerType", {
      is: "insurance",
      then: Joi.required(),
      otherwise: Joi.allow(""),
    })
    .messages({
      "number.min": t("bookingValidationSchema.deductible.min"),
      "any.required": t("bookingValidationSchema.deductible.required"),
    }),
  date: Joi.date()
    .required()
    .messages({
      "date.base": t("bookingValidationSchema.date.base"),
      "any.required": t("bookingValidationSchema.date.required"),
    }),
  duration: Joi.number()
    .min(0.5)
    .max(6)
    .required()
    .messages({
      "number.min": t("bookingValidationSchema.duration.min"),
      "number.max": t("bookingValidationSchema.duration.max"),
      "any.required": t("bookingValidationSchema.duration.required"),
    }),
  notes: Joi.string()
    .min(0)
    .max(500)
    .allow("")
    .messages({
      "string.max": t("bookingValidationSchema.notes.max"),
    }),
  location: Joi.string()
    .length(24)
    .hex()
    .required()
    .allow("")
    .messages({
      "string.length": t("bookingValidationSchema.location.length"),
      "any.required": t("bookingValidationSchema.location.required"),
    }),
  invoiceMade: Joi.boolean()
    .required()
    .default(false)
    .messages({
      "boolean.base": t("bookingValidationSchema.invoiceMade.boolean"),
      "any.required": t("bookingValidationSchema.invoiceMade.required"),
    }),
});
