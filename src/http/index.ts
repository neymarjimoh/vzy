import { Application } from "express";
import { authRouter, userRouter } from "./users";
import webhookRouter from "./webhooks/webhook.controller";

const routes = [
  {
    prefix: "auth",
    name: authRouter,
  },
  {
    prefix: "users",
    name: userRouter,
  },
  {
    prefix: "webhook",
    name: webhookRouter,
  },
];

export default (app: Application) => {
  routes.forEach((element) => {
    app.use(`/${element.prefix}`, element.name);
  });
  return app;
};
