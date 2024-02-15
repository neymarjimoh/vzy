import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import morgan from "morgan";
import { errorResponse } from "./utils/response.util";
import { isCelebrateError } from "celebrate";
import appRoutes from "./http";

const app = express();

app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// middleware that logs request info to console
app.use((req: Request, res: Response, next: NextFunction) => {
  console.log(`REQUEST QUERY: ${JSON.stringify(req.query)}`);
  console.log(`REQUEST PARAMS: ${JSON.stringify(req.params)}`);
  next();
});

app.get("/", (req, res) => {
  return res.status(200).json({
    message: "Welcome to Vzy Backend API",
  });
});

appRoutes(app);

app.use("*", (err: any, req: Request, res: Response) => {
  console.log(
    `${err.status || 500} - ${req.method} - ${err.message}  - ${
      req.originalUrl
    } - ${req.ip}`
  );
  errorResponse(
    res,
    "Please use /<specific resource> to acess the API or check the docs for list of available endpoints",
    404
  );
});

app.use((error: any, _req: Request, res: Response, next: NextFunction) => {
  if (isCelebrateError(error)) {
    const errorMessage =
      error.details.get("body") ||
      error.details.get("query") ||
      error.details.get("params");
    const message = errorMessage!.message.replace(/"/g, "");
    return errorResponse(res, message);
  }
  next();
});

export default app;
