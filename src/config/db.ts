import { connect } from "mongoose";
import envs from "./envs";

const dbConnect = async (): Promise<void> => {
  try {
    await connect(envs.db.uri, {});
    console.log("Database connected successfully.");
  } catch (err) {
    console.log(`Mongoose connection was not succesful due to: ${err}`);
  }
};

export default dbConnect;
