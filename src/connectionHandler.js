//@flow

import type { Socket } from "net";

const countAndSlice = require("./utils/countAndSlice");

const Connections = {};

const secureOp = ["ping", "close"];

class Connection {
  id: number;
  socket: Socket;
  buffer: string;
  queue: string[];

  constructor(id: number, socket: Socket) {
    console.log("New connection", id);

    this.id = id;
    this.socket = socket;
    this.buffer = "";
    this.queue = [];

    Connections[id] = this;

    socket.on("data", data => {
      data = data.toString();
      this.buffer = this.buffer.concat(data);
      console.log("Buffer", this.buffer);
      let [arr, count] = countAndSlice(this.buffer);
      if (arr.length > count) {
        this.buffer = arr.pop();
      } else {
        this.buffer = "";
      }
      this.queue = this.queue.concat(arr);

      while (this.queue.length > 0) {
        let op = this.queue.shift();
        this.execute(op);
      }

    })

    socket.on("end", () => {
      this.end();
    });
  }

  execute(op: string) {
    if (secureOp.includes(op)) {
      this[op]();
    } else {
      this.write("Unkown operator\n\r");
    }
  }

  ping() {
    this.write("pong\n\r");
  }

  close() {
    this.write("Closing connection\n\r");
    this.socket.end();
  }

  write(input: string | Buffer) {
    this.socket.write(input);
  }

  end() {
    delete Connections[id];
    console.log("Connection closed", this.id);
  }
}

let id = 0;

function connectionHandler(socket: Socket) {
  id++;
  new Connection(id, socket);
}

module.exports = connectionHandler;