//@flow

const net = require("net");
const path = require("path");
const chalk = require("chalk");

const socketPathCon = require("./utils/socketPath");

let id = 0;

const server = net.createServer(socket => {
  id++;
  console.log("Connected, id:", id);
  socket.write("Test");
});

const socketPath = socketPathCon();

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
  process.exit();
});