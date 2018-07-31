//@flow

const net = require("net");
const path = require("path");
const chalk = require("chalk");

const socketPathCon = require("./utils/socketPath");
const connectionHandler = require("./connectionHandler");
const init = require("./init");
const prepareBot = require("./bot");

const server = net.createServer(connectionHandler);

const socketPath = socketPathCon();

//Main

(async () => {

  await init();

  prepareBot();

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
    }
    server.close(() => {
      process.exit();
    })
  });

  process.on("SIGINT", () => {
    console.log("Closing server");
    server.close(() => {
      console.log("Server closed");
      process.exit(0);
    });
  })
})();