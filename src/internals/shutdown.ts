import http from "http";
import mongoose from "mongoose";

const handleGracefulShutdown = (server: http.Server): void => {
    console.log("Closing http server...");
    // Stops the server from accepting new connections and finish existing connections.
    server.close(function (err) {
        console.log("Http server closed!");
        if (err) {
            console.error(err);
            process.exit(1);
        }
        mongoose.connection.close(true); 
        console.log("Mongoose connection closed!");
        process.exit(0);
    });
};
export default handleGracefulShutdown;
