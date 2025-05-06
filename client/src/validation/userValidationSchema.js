import Joi from "joi";
import { t } from "i18next";

export const userValidationSchema = Joi.object({
  username: Joi.string()
    .pattern(/^[a-zA-Z0-9_.-]+$/)
    .min(3)
    .max(30)
    .required()
    .messages({
      "string.pattern.base": t("userValidationSchema.username.pattern"),
      "string.min": t("userValidationSchema.username.min"),
      "string.max": t("userValidationSchema.username.max"),
      "any.required": t("userValidationSchema.username.required"),
      "string.empty": t("userValidationSchema.username.empty"),
    }),
  firstName: Joi.string()
    .min(2)
    .max(50)
    .required()
    .messages({
      "string.min": t("userValidationSchema.firstName.min"),
      "string.max": t("userValidationSchema.firstName.max"),
      "any.required": t("userValidationSchema.firstName.required"),
      "string.empty": t("userValidationSchema.firstName.empty"),
    }),
  lastName: Joi.string()
    .min(2)
    .max(50)
    .required()
    .messages({
      "string.min": t("userValidationSchema.lastName.min"),
      "string.max": t("userValidationSchema.lastName.max"),
      "any.required": t("userValidationSchema.lastName.required"),
      "string.empty": t("userValidationSchema.lastName.empty"),
    }),
  role: Joi.string()
    .valid("regular", "admin")
    .required()
    .messages({
      "any.only": t("userValidationSchema.role.only"),
      "any.required": t("userValidationSchema.role.required"),
    }),
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .required()
    .messages({
      "string.email": t("userValidationSchema.email.email"),
      "any.required": t("userValidationSchema.email.required"),
      "string.empty": t("userValidationSchema.email.empty"),
    }),
  password: Joi.string()
    .pattern(/^[a-zA-Z0-9_.-]+$/)
    .min(8)
    .max(128)
    .when(Joi.ref("$isEdit"), {
      is: true,
      then: Joi.string().allow(""),
      otherwise: Joi.string()
        .required()
        .messages({
          "any.required": t("userValidationSchema.password.required"),
          "string.empty": t("userValidationSchema.password.empty"),
        }),
    })
    .messages({
      "string.pattern.base": t("userValidationSchema.password.pattern"),
      "string.min": t("userValidationSchema.password.min"),
      "string.max": t("userValidationSchema.password.max"),
    }),
  location: Joi.string()
    .length(24)
    .hex()
    .when(Joi.ref("$isEdit"), {
      is: true,
      then: Joi.string().allow(""),
      otherwise: Joi.string()
        .required()
        .messages({
          "any.required": t("userValidationSchema.location.required"),
          "string.empty": t("userValidationSchema.location.empty"),
        }),
    })
    .messages({
      "string.length": t("userValidationSchema.location.length"),
      "string.hex": t("userValidationSchema.location.hex"),
    }),
});
