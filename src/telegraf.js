//@flow

const Telegraf = require("telegraf");

const returned: {
  [string]: any
} = {
  bot: undefined,
  async init() {
    if (typeof process.env.TELEGRAM_TOKEN === "undefined") {
      throw new Error("Telegram token not found");
    }
    const token = process.env.TELEGRAM_TOKEN;
    this.bot = new Telegraf(token);
  }
};

module.exports = returned;