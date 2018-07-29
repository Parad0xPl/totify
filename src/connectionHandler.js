//@flow

import type { Socket } from "net";

const countAndSlice = require("./utils/countAndSlice");
const Queue = require("./utils/Queue");
const db = require("./db");

// All connections stored by id
const Connections = {};

// List of operations should be executed
const secureOp = [
  "register",
  "login",
  "ping",
  "close"];

class Connection {
  id: number;
  socket: Socket;
  buffer: string;
  queue: Queue<string>;
  session: any;

  constructor(id: number, socket: Socket) {
    console.log("New connection", id);

    this.id = id;
    this.socket = socket;
    this.buffer = "";
    this.queue = new Queue();

    Connections[id] = this;

    socket.on("data", async data => {
      data = data.toString();
      this.buffer = this.buffer.concat(data);
      console.log("Buffer", this.buffer);
      let [arr, count] = countAndSlice(this.buffer);
      if (arr.length > count) {
        this.buffer = arr.pop();
      } else {
        this.buffer = "";
      }
      this.queue.concat(arr);

      while (this.queue.length > 0) {
        let op = this.queue.removeSync();
        await this.execute(op);
      }
    })

    socket.on("end", () => {
      this.end();
    });
  }

  async execute(op: string) {
    if (secureOp.includes(op)) {
      // $FlowFixMe
      await this[op]();
    } else {
      this.write("Unkown operator\n\r");
    }
  }

  // Session`s Operations

  async register() {
    const name = await this.queue.remove();
    let instance = await db.App.create({
      name
    });
    this.write(`${instance.id}&${instance.auth};`);
  }

  async login() {
    if (typeof this.session !== "undefined") {
      this.write("error:session is logged;");
      return;
    }
    const auth = await this.queue.remove();
    const user = await db.App.findOne({
      where: {
        auth,
        activated: true
      }
    });
    if (!user) {
      this.write("error:auth unmatched or not activated;");
      return;
    }
    this.session = {
      user
    };
    this.write("info:loggedin;");
  }

  ping() {
    this.write("pong;");
  }

  close() {
    this.write("Closing connection;");
    this.socket.end();
  }

  // Connection methods

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