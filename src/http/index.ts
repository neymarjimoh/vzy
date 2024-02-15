import { Application } from "express";
// import { authRouter, userRouter } from "./users";
import { authRouter } from "./users";

const routes = [
  {
    prefix: "auth",
    name: authRouter,
  },
];

export default (app: Application) => {
  routes.forEach((element) => {
    app.use(`/${element.prefix}`, element.name);
  });
  return app;
};
