import { Router, Request, Response } from "express";
import { errorResponse, successRes } from "../../utils/response.util";
import { authService } from "../../services/index.service";
import { authValidation } from "../../validations/index.validation";

const authRouter = Router();

authRouter.post(
  "/register",
  authValidation.signUpValidation(),
  async (req: Request, res: Response) => {
    try {
      const userDTO = req.body;
      const response = await authService.signup(userDTO);

      if (!response.status) {
        return errorResponse(res, response.message, response.data, 400);
      }

      return successRes(res, response.data, response.message);
    } catch (error: any) {
      console.log(error);
      return errorResponse(
        res,
        "an error occured, contact support for help",
        500
      );
    }
  }
);

authRouter.post(
  "/login",
  authValidation.signInValidation(),
  async (req: Request, res: Response) => {
    try {
      const userDTO = req.body;
      const response = await authService.signin(userDTO);

      if (!response.status) {
        return errorResponse(res, response.message, response.data, 400);
      }

      return successRes(res, response.data, response.message);
    } catch (error: any) {
      console.log(error);
      return errorResponse(
        res,
        "an error occured, contact support for help",
        500
      );
    }
  }
);

export default authRouter;
