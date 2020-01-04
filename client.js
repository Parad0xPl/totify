const net = require("net");

let socketPath = require("./src/utils/socketPath");

socketPath = socketPath();

let con = net.createConnection(socketPath);

con.on("data", d => {
  console.log(d.toString());
  con.write("Response");
  con.end();
});