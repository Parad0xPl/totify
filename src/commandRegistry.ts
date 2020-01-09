import telegraf from "./telegraf";
import { Middleware, ContextMessageUpdate } from "telegraf";

type middlewareFun =  Middleware<ContextMessageUpdate>;
type commandArgs = [string|Array<string>, middlewareFun, ...middlewareFun[]]
/**
 * Command Register.
 * Stores information what commands has been registred in Telegraf
 *
 * @class CommandRegister
 */
class CommandRegister {

  commands: string[];

  constructor() {
    this.commands = [];
  }

  /**
   * Telegraf.command wrapper
   *
   * @param {(string|Array<string>)} commands - Command(s) name
   * @param {middlewareFun} middleware - First middleware to handle
   * @param {...middlewareFun[]} middlewares - Optional middlewares
   * 
   * @memberof CommandRegister
   */
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

  /**
   * Sort commands array
   *
   * @memberof CommandRegister
   */
  sort() {
    this.commands = this.commands.sort();
  }

  /**
   * Check is command name is already used
   *
   * @param {string} cmd - Command name
   * @returns {boolean} - Is name already used
   * @memberof CommandRegister
   */
  isReserved(cmd: string): boolean {
    return this.commands.includes(cmd);
  }
}

export default new CommandRegister();