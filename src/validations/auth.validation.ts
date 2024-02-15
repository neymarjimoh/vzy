import { celebrate } from "celebrate";
import Joi from "joi";

class AuthValidation {
  public signUpValidation() {
    return celebrate({
      body: Joi.object({
        first_name: Joi.string().required().trim(true),
        last_name: Joi.string().required().trim(true),
        email: Joi.string().email().required().trim(true),
        password: Joi.string().min(8).required(),
      }),
    });
  }

  public signInValidation() {
    return celebrate({
      body: Joi.object({
        email: Joi.string().email().required().trim(true),
        password: Joi.string().required().trim(true),
      }),
    });
  }
}

export const authValidation = new AuthValidation();
