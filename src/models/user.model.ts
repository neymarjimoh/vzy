import { Schema, model, Document } from "mongoose";
import { RootModel, Status } from "../utils/enum.util";

const stringRequired = {
  type: String,
  required: true,
};

export interface IUser extends RootModel, Document {
  email: string;
  password: string;
  last_name: string;
  first_name: string;
  status: Status;
  last_login: Date;
}

const userSchema = new Schema(
  {
    email: { ...stringRequired, unique: true },
    password: stringRequired,
    status: {
      type: String,
      enum: Object.values(Status),
      default: Status.Pending,
    },
    last_login: Date,
    first_name: String,
    last_name: String,
  },
  {
    timestamps: true,
  }
);

export default model<IUser>("User", userSchema);
