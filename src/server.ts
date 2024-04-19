import { Server } from "http";
import app from "./app";
const port = 3000;



async function main() {
  const server: Server = app.listen(port, () => {
    console.log("app running on port : ", port);
  });

  const exitHandler = () => {
    // close server
    if (server) {
      server.close(() => {
        console.info("server closed");
      });
    }
    process.exit(1);
  };

  // uncaught exception
  process.on("uncaughtException", (err) => {
    console.log("uncaughtException", err);

    exitHandler();
  });

  // unhandled rejection
  process.on("unhandledRejection", (err) => {
    console.log("unhandledRejection", err);

    exitHandler();
  });
}

main();
