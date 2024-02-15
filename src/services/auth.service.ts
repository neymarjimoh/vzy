import { AuthModule } from "../utils/auth.util";
import { BaseService } from "../services/base.service";
import { userService } from "../services/user.service";
import User, { IUser } from "../models/user.model";

class AuthService extends BaseService {
  super: any;

  public async signup(authDTO: {
    email: string;
    password: string;
    last_name: string;
    first_name: string;
  }) {
    let { last_name, email, password, first_name } = authDTO;
    email = email.toLowerCase();

    const userExists = await userService.findUserWithEmail(email);
    if (userExists) {
      return this.internalResponse(
        false,
        {},
        409,
        "A user is already registered with the email"
      );
    }

    const hashedPassword = AuthModule.hashPassWord(password);
    let newUser: IUser;

    newUser = await userService.newUser(
      email,
      hashedPassword,
      first_name,
      last_name
    );

    const savedUser = await userService.saveUser(newUser);
    if (!savedUser) {
      return this.internalResponse(
        false,
        {},
        400,
        "error in saving user's details. Try again"
      );
    }

    return this.internalResponse(
      true,
      {
        _id: newUser._id,
        email: newUser.email,
        last_name: newUser.last_name,
        first_name: newUser.first_name,
      },
      201,
      "Account created successfully"
    );
  }

  public async signin(authDTO: { email: string; password: string }) {
    let { email, password } = authDTO;
    email = email.toLowerCase();
    const userExists = await userService.findUserWithEmail(email);
    if (!userExists) {
      return this.internalResponse(
        false,
        {},
        400,
        "Invalid login details entered"
      );
    }

    const isPasswordValid = AuthModule.compareHash(
      password,
      userExists.password
    );
    if (!isPasswordValid) {
      return this.internalResponse(
        false,
        {},
        400,
        "Invalid login details entered"
      );
    }

    const updatedUser = await User.findOneAndUpdate(
      { _id: userExists._id },
      { $set: { last_login: Date.now() } },
      { new: true }
    ).select("-password");

    const token = AuthModule.generateToken(
      {
        userId: userExists._id,
        email: userExists.email,
      },
      "1m" // Set the expiration time to 1 minute
    );

    return this.internalResponse(
      true,
      { user_details: updatedUser, accessToken: token },
      200,
      "login successful"
    );
  }
}

export const authService = new AuthService();
