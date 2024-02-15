import { Router, Request, Response } from "express";
import { errorResponse, successRes } from "../../utils/response.util";
import { verificationMiddleware } from "../../middlewares/checkLogin";
import { userValidation } from "../../validations/index.validation";
import { userService } from "../../services/user.service";

const userRouter = Router();

userRouter.patch(
  "/update-profile",
  verificationMiddleware.validateToken,
  userValidation.updateProfileValidation(),
  async (req: Request, res: Response) => {
    try {
      const authUser = (req as any).user;

      const response = await userService.updateProfile(authUser, req.body);

      if (!response.status) {
        return errorResponse(res, response.message, 400);
      }

      return successRes(res, response.data, response.message);
    } catch (error) {
      console.log(error);
      if (error?.email_failed) {
        return errorResponse(
          res,
          "Error in sending email. Contact support for help",
          400
        );
      }
      return errorResponse(res, "an error occured, contact support", 500);
    }
  }
);

export default userRouter;
