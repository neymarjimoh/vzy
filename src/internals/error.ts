const errorHandler = (error: NodeJS.ErrnoException): void => {
  if (error.syscall !== "listen") {
    throw error;
  }
  switch (error.code) {
    case "EACCES":
      console.log(`port requires elevated privileges.`);
      process.exit(1);
      break;
    case "EADDRINUSE":
      console.log(`port is already in use.`);
      process.exit(1);
      break;
    default:
      throw error;
  }
};

export default errorHandler;
