const net = require("net");

let socketPath = require("./dst/utils/socketPath").default;

socketPath = socketPath();

let con = net.createConnection(socketPath);

con.write("register;close;");
let buff = "";
con.on("data", d => {
  buff += d.toString();
  // console.log(d.toString());
  con.end();
});

con.on("close", ()=>{
  console.log(buff);
})