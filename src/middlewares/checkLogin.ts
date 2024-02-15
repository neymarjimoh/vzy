import { NextFunction, Request, Response } from "express";
import { errorResponse } from "../utils/response.util";
import { AuthModule } from "../utils/auth.util";
import { userService } from "../services/user.service";
import User from "../models/user.model";

class VerificationMiddleware {
  public validateToken = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const authHeader = req.headers.authorization;
    let token: string;
    if (!authHeader)
      return errorResponse(res, "Unauthorized. Missing credentials", 401);

    const separateBearer = authHeader.split(" ");
    if (separateBearer.includes("Bearer")) {
      token = separateBearer[1];
    } else {
      token = authHeader;
    }

    try {
      const grantAccess = AuthModule.verifyToken(token);
      const { verified, details, message } = grantAccess;
      if (!verified) {
        return errorResponse(res, "Unauthorized", 401);
      }

      const auth_user = await User.findOne({ email: details.email }).select(
        "-password -__v"
      );
      if (!auth_user) {
        return errorResponse(res, "Invalid token", 403);
      }

      (req as any).user = auth_user;

      return next();
    } catch (err) {
      if (err?.name === "TokenExpiredError") {
        return errorResponse(res, "Unauthorized. Token expired", 401);
      }
      if (err?.name === "JsonWebTokenError") {
        return errorResponse(res, "Unauthorized. Invalid token format.", 401);
      }
      return errorResponse(
        res,
        "Something went wrong, please try again later.",
        500
      );
    }
  };
}

export const verificationMiddleware = new VerificationMiddleware();
