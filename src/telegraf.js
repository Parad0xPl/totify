//@flow

const Telegraf = require("telegraf");
const db = require("./db");

const returned: {
  [string]: any
} = {
  async chats(): Promise<number[]> {
    let a = await db.User.findAll({
      where: {
        activated: true,
        permanentBan: false
      }
    });
    a = a.map(el => el.userTelegramId).map(el => parseInt(el));
    return a;
  },
  async send(message: string) {
    let chats = await this.chats();
    for (let id of chats) {
      await this.bot.telegram.sendMessage(id, message);
    }
  },
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