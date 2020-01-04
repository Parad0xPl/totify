import telegraf from "./telegraf";
import { Middleware, ContextMessageUpdate } from "telegraf";

type middlewareFun =  Middleware<ContextMessageUpdate>;
type commandArgs = [string|Array<string>, middlewareFun, ...middlewareFun[]]
class CommandRegistry {

  commands: string[];

  constructor() {
    this.commands = [];
  }

  register(commands: string|Array<string>, middleware: middlewareFun, ...middlewares:middlewareFun[] ) {
    if(!telegraf.bot){
      throw new Error("Can't register if telegraf is not intialized");
    }
    const args: commandArgs = [commands, middleware, ...middlewares];
    if (typeof commands == "string") {
      this.commands.push(commands)
    } else if (Array.isArray(commands)) {
      this.commands = this.commands.concat(commands);
    }
    return telegraf.bot.command.apply(telegraf.bot, args);
  }

  sort() {
    this.commands = this.commands.sort();
  }

  isReserved(cmd: string): boolean {
    return this.commands.includes(cmd);
  }
}

export default new CommandRegistry();