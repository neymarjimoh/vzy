import { FilterQuery, UpdateQuery, QueryOptions } from "mongoose";
import { BaseService } from "../services/base.service";
import User, { IUser } from "../models/user.model";

class UserService extends BaseService {
  super: any;

  public async findUserWithEmail(email: string): Promise<any> {
    return await this.findOne(User, { email });
  }

  public async findUserWithUniqueFields(
    email: string
  ): Promise<IUser & { _id: any }> {
    return await User.findOne({ $or: [{ email: email }] });
  }

  public async getAllUsers(): Promise<IUser[]> {
    const users = await User.find({});

    return users;
  }

  public async getUser(userDTO: { id: string }) {
    const { id } = userDTO;

    const user = await User.findOne({ _id: id });

    if (!user) {
      return this.internalResponse(false, {}, 400, "user not found");
    }

    return user;
  }

  public async newUser(
    email: string,
    password: string,
    last_name: string,
    first_name: string
  ) {
    const new_user = new User();
    new_user.email = email;
    new_user.password = password;
    new_user.first_name = first_name;
    new_user.last_name = last_name;

    return new_user;
  }

  public async saveUser(user: IUser, opts = {}): Promise<IUser> {
    return await this.save(user, opts);
  }

  public async deleteUser(params: { email: string }): Promise<any> {
    return await this.deleteOne(User, params);
  }

  public async updateUser(
    query: FilterQuery<IUser>,
    update: UpdateQuery<IUser>
  ) {
    return await User.updateOne(query, update, { new: true });
  }

  public async updateProfile(authUser, userDTO) {
    const { _id: user_id } = authUser;

    const { last_name, first_name } = userDTO;

    if (Object.keys(userDTO).length <= 0) {
      return this.internalResponse(false, {}, 400, "No data to update");
    }
    let updated_user: IUser;
    updated_user = await User.findByIdAndUpdate(
      user_id,
      {
        $set: {
          last_name,
          first_name,
        },
      },
      { new: true }
    );
    if (!updated_user)
      return this.internalResponse(
        false,
        {},
        400,
        "Unable to update profile. Try again"
      );

    return this.internalResponse(true, updated_user, 200, "Profile updated");
  }
}

export const userService = new UserService();
