import path from "path";

require("dotenv").config({
  path: path.join(process.cwd(), ".env")
});

import net from "net";
import chalk from "chalk";
import _debug from "debug";
const debug = _debug("totify:main");

import socketPathCon from "./utils/socketPath";
import connectionHandler from "./connectionHandler";
import init from "./init";
import prepareBot from "./bot";

const server = net.createServer(connectionHandler);

const socketPath = socketPathCon(process.env.TOTIFY_INSTANCENAME);

//Main

(async () => {

  debug("Starting awaited init");
  await init();
  debug("Initializing done")

  debug("Preparing bot");
  prepareBot();

  debug("Starting server")
  server.listen(path.resolve(socketPath), () => {
    console.log(`Server is listening on ${socketPath}`);
  });

  server.on("error", (err: SocketError)=> {
    if (err.code == "EADDRINUSE") {
      console.log(chalk.red(
        `Totify stream address is already in use. ` +
        `If you want run more instances, you should` +
        ` give instance name in config of new instances`
      ));
    } else {
      console.log("Unexpected error, code:", err.code);
      debug(err);
    }
    server.close(() => {
      process.exit();
    })
  });

  const sigHandler = () => {
    console.log("Closing server");
    server.close(() => {
      console.log("Server closed");
      process.exit(0);
    });
  };

  process.on("SIGINT", sigHandler);
  process.on("SIGTERM", sigHandler);
})().catch(err => {
  console.log("Main thread error:");
  debug(err);
});