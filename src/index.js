//@flow

const path = require("path");

require("dotenv").config({
  path: path.join(process.cwd(), ".env")
});

const net = require("net");
const chalk = require("chalk");
const debug = require("debug")("totify:main");

const socketPathCon = require("./utils/socketPath");
const connectionHandler = require("./connectionHandler");
const init = require("./init");
const prepareBot = require("./bot");

const server = net.createServer(connectionHandler);

const socketPath = socketPathCon();

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

  server.on("error", err => {
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