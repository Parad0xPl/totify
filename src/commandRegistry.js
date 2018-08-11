//@flow

const telegraf = require("./telegraf");

class CommandRegistry {

  commands: string[];

  constructor() {
    this.commands = [];
  }

  register(...argsRaw) {
    const args = [].concat(argsRaw);
    const command = args[0];
    if (typeof command == "string") {
      this.commands.push(command)
    } else if (Array.isArray(command)) {
      this.commands = this.commands.concat(command);
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

module.exports = new CommandRegistry();