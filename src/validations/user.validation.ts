import { celebrate } from "celebrate";
import Joi from "joi";

class UserValidation {
  public updateProfileValidation() {
    return celebrate({
      body: {
        last_name: Joi.string().optional(),
        first_name: Joi.string().optional(),
      },
    });
  }
}

export const userValidation = new UserValidation();
