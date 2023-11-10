import Joi from "joi";

const userRegistrationSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string()
    .required()
    .email()
    .regex(/@/),
  password: Joi.string()
    .min(6)
    .regex(/^(?=.*[A-Za-z])(?=.*\d)/)
    .required(),
  money_balance: Joi.required()
});

export { userRegistrationSchema };
