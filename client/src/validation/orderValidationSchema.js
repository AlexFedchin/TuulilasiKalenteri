import Joi from "joi";
import { t } from "i18next";

export const orderValidationSchema = Joi.object({
  products: Joi.array()
    .items(
      Joi.object({
        eurocode: Joi.string()
          .min(2)
          .max(20)
          .required()
          .messages({
            "string.base": t("orderValidationSchema.eurocode.stringBase"),
            "string.empty": t("orderValidationSchema.eurocode.required"),
            "string.min": t("orderValidationSchema.eurocode.min"),
            "string.max": t("orderValidationSchema.eurocode.max"),
            "any.required": t("orderValidationSchema.eurocode.required"),
          }),
        amount: Joi.number()
          .integer()
          .min(1)
          .required()
          .messages({
            "number.base": t("orderValidationSchema.amount.numberBase"),
            "number.integer": t("orderValidationSchema.amount.integer"),
            "number.min": t("orderValidationSchema.amount.min"),
            "any.required": t("orderValidationSchema.amount.required"),
          }),
        price: Joi.number()
          .integer()
          .min(0)
          .required()
          .messages({
            "number.base": t("orderValidationSchema.price.numberBase"),
            "number.integer": t("orderValidationSchema.price.integer"),
            "number.min": t("orderValidationSchema.price.min"),
            "any.required": t("orderValidationSchema.price.required"),
          }),
        status: Joi.string()
          .valid("inStock", "order")
          .default("inStock")
          .messages({
            "string.base": t("orderValidationSchema.status.stringBase"),
            "any.only": t("orderValidationSchema.status.valid"),
          }),
      })
    )
    .required()
    .messages({
      "array.base": t("orderValidationSchema.products.arrayBase"),
      "array.includesRequiredUnknowns": t(
        "orderValidationSchema.products.includesRequiredUnknowns"
      ),
      "any.required": t("orderValidationSchema.products.required"),
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
      "string.base": t("orderValidationSchema.client.stringBase"),
      "any.only": t("orderValidationSchema.client.valid"),
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
      "string.base": t("orderValidationSchema.clientName.stringBase"),
      "string.empty": t("orderValidationSchema.clientName.required"),
      "string.min": t("orderValidationSchema.clientName.min"),
      "string.max": t("orderValidationSchema.clientName.max"),
      "any.required": t("orderValidationSchema.clientName.required"),
    }),
  notes: Joi.string()
    .max(500)
    .allow("")
    .messages({
      "string.base": t("orderValidationSchema.notes.stringBase"),
      "string.max": t("orderValidationSchema.notes.max"),
    }),
});
