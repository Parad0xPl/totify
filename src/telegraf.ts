import Telegraf, {ContextMessageUpdate} from "telegraf";
import db from "./db";

const telegraf: {
  [propname: string]: any,
  bot?: Telegraf<ContextMessageUpdate>
} = {
  async chats(): Promise<number[]> {
    let a = await db.User.findAll({
      where: {
        activated: true,
        permanentBan: false
      }
    });
    let ids = a.map(el => el.userTelegramId);
    return ids;
  },
  async send(message: string): Promise<void> {
    if(!this.bot){
      throw new Error("Can't send when telegraf is not initialized");
    }
    let chats = await this.chats();
    for (let id of chats) {
      await this.bot.telegram.sendMessage(id, message);
    }
  },
  bot: undefined,
  async init(): Promise<void> {
    if (typeof process.env.TELEGRAM_TOKEN === "undefined") {
      throw new Error("Telegram token not found");
    }
    const token = process.env.TELEGRAM_TOKEN;
    this.bot = new Telegraf(token);
  }
};

export default telegraf;