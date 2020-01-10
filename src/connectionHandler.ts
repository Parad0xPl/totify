import { Socket } from "net";

import countAndSlice from "./utils/countAndSlice" ;
import Queue from "./utils/Queue" ;
import db from "./db" ;
import telegraf from "./telegraf" ;
import _ie from "./utils/internalError";
const ie = _ie("connHand");

// All connections stored by id
const Connections:{
  [id: number]: Connection
}= {};

// List of operations should be executed

type secureOp = "register" | "login" |
  "notify" | "ping" |
  "close";

const secureOp = [
  "register",
  "login",
  "notify",
  "ping",
  "close"];

/**
 *Class representing connection with client
 *
 * @class Connection
 */
class Connection {
  id: number;
  socket: Socket;
  buffer: string;
  queue: Queue<string>;
  session: any;
  ended: boolean;
  /**
   * Creates an instance of Connection.
   * @param {number} id - Conection's id
   * @param {Socket} socket - Connection's socket
   * @memberof Connection
   */
  constructor(id: number, socket: Socket) {
    console.log("New connection", id);

    this.id = id;
    this.socket = socket;
    this.buffer = "";
    this.queue = new Queue();
    this.ended = false;

    Connections[id] = this;

    socket.on("data", async (data: Buffer | string) => {
      try {
        data = data.toString();
        this.buffer = this.buffer.concat(data);
        console.log("Buffer", this.buffer);
        let [arr, count] = countAndSlice(this.buffer);
        if (arr.length > count) {
          this.buffer = arr.pop() as string;
        } else {
          this.buffer = "";
        }
        this.queue.concat(arr);

        while (this.queue.length > 0) {
          let op = this.queue.removeSync() as string;
          op = op.trim();
          if (op.length > 0) {
            try {
              await this.execute(op);
            } catch (e) {
              console.log(`Error while executing op: ${op}`);
              console.log(`ConID: ${this.id}`);
              console.log(e);
            }
          }
        }
      } catch (e) {
        ie(1, e);
      }
    })

    socket.on("error", (err: SocketError) => {
      if (err.code === 'EPIPE') {
        console.log("Socket used after being closed. (Probably by client)");
        socket.end();
        this.end();
        return;
      }
      console.log("Connection error");
      console.log(`ConID: ${this.id}`);
      console.log(err);
    });


    socket.once("end", () => {
      this.ended = true;
      this.end();
    });
  }

  
  /**
   * Execute operation by running corresponding method of Connection
   *
   * @param {string} op - operation
   * @memberof Connection
   */
  async execute(op: string) {
    if (secureOp.includes(op)) {
      await this[<secureOp>op]();
    } else {
      this.write("Unkown operation\n\r");
    }

  }

  // Session`s Operations

  /**
   * register new App with name from queue then reply with id and authcode
   * 
   * Should only be used by protocol
   *
   * @memberof Connection
   */
  async register() {
    const name = await this.queue.remove();
    let instance = await db.App.create({
      name
    });
    this.write(`${instance.id}&${instance.auth};`);
  }

  /**
   * login App with authcode from queue. 
   * Reply "OK" on success or "ERR" and message on error;
   * 
   * Should only be used by protocol
   *
   * @memberof Connection
   */
  async login() {
    const auth = await this.queue.remove();
    if (typeof this.session !== "undefined") {
      this.write("ERR;session is logged;");
      return;
    }
    const user = await db.App.findOne({
      where: {
        auth,
        activated: true
      }
    });
    if (!user) {
      this.write("ERR;auth unmatched or not activated;");
      return;
    }
    this.session = {
      user
    };
    this.write("OK;");
  }

  /**
   * send message from queue to telegraf bot.
   * Reply "OK" on success or "ERR" and message on error;
   * 
   * Should only be used by protocol
   *
   * @memberof Connection
   */
  async notify() {
    const message = await this.queue.remove();
    if (typeof this.session === "undefined") {
      this.write("ERR;need to be logged;");
      return;
    }
    let messageFormatted = `[${this.session.user.name}] - ${message}`;
    telegraf.send(messageFormatted);
    this.write("OK;")
  }

  /**
   * Reply with "pong".
   * 
   * Should only be used by protocol
   *
   * @memberof Connection
   */
  ping() {
    this.write("pong;");
  }

  /**
   * Close connection
   * 
   * Should only be used by protocol
   *
   * @memberof Connection
   */
  close() {
    this.write("Closing connection;");
    this.socket.end();
  }

  // Connection methods

  /**
   * Write message to connection's Socket
   *
   * @param {(string | Buffer)} input - Message
   * @memberof Connection
   */
  write(input: string | Buffer) {
    if (!this.socket.destroyed && !this.ended) {
      this.socket.write(input);
    }
  }

  /**
   * Clear connection from map
   *
   * @memberof Connection
   */
  end() {
    delete Connections[id];
    console.log("Connection closed", this.id);
  }
}

let id = 0;

/**
 * Handle new connection with new Connection
 *
 * @param {Socket} socket
 */
function connectionHandler(socket: Socket): void {
  id++;
  new Connection(id, socket);
}

export default connectionHandler;