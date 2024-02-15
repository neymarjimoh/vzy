import app from "./app";
import http from "http";
import dbConnect from "./config/db";
import envs from "./config/envs";
import {
  normalizePort,
  errorHandler,
  handleGracefulShutdown,
} from "./internals";

const startServer = (): void => {
  const server = http.createServer(app);
  const port = normalizePort(envs.port);
  app.set("port", port);
  server.on("error", errorHandler);
  server.listen(port, () => {
    console.log("Techinnover prompt-1 server listening on port", port);
  });
  // If the Node process ends, handle graceful shutdown
  const sigs = ["SIGINT", "SIGTERM", "SIGQUIT"];
  sigs.forEach((sig) => {
    process.on(sig, () => handleGracefulShutdown(server));
  });
};
dbConnect()
  .then(() => {
    return startServer();
  })
  .catch((error) => console.log(error.message));
