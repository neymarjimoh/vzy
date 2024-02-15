import crypto from "bcryptjs";
import jwt from "jsonwebtoken";
import envs from "../config/envs";

class AuthUtils {
  public hashPassWord(password: string): string {
    return crypto.hashSync(password, process.env.SALT_ROUNDS || 10);
  }

  public compareHash(password: string, hash: string): boolean {
    return crypto.compareSync(password, hash);
  }

  public generateToken(
    payload: string | object | Buffer,
    expIn: string
  ): string {
    return jwt.sign(payload, envs.secrets.jwt, { expiresIn: expIn });
  }

  public verifyToken(token: string): {
    verified: boolean;
    details?: any;
    message?: string;
  } {
    try {
      const tokenVerified: any = jwt.verify(token, envs.secrets.jwt);
      delete tokenVerified.exp;
      delete tokenVerified.iat;
      return { verified: true, details: tokenVerified };
    } catch (e) {
      switch (e.name) {
        case "JsonWebTokenError":
          return { verified: false, message: "Invalid token" };
        case "TokenExpiredError":
          return { verified: false, message: "Expired token" };
        default:
          return { verified: false, message: e.name };
      }
    }
  }
}

export const AuthModule = new AuthUtils();
