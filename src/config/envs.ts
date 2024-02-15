import * as dotenv from "dotenv";

dotenv.config();

export default {
  port: process.env.PORT || 8080,
  db: {
    uri: process.env.DB_URI || "mongodb://localhost:27017/vzy",
  },
  host: process.env.HOST,
  secrets: {
    jwt: process.env.JWT_SECRET,
  },
};
