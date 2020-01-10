import Telegraf, {ContextMessageUpdate} from "telegraf";
import db from "./db";

const telegraf: {
  [propname: string]: any,
  bot?: Telegraf<ContextMessageUpdate>
} = {
  /**
   * Return authenticated chats
   *
   * @returns {Promise<number[]>} - Array of chats` ID
   */
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
  /**
   * Send message to all authenticated chats
   *
   * @param {string} message - Message to send
   * @returns {Promise<void>}
   */
  async send(message: string): Promise<void> {
    if(!this.bot){
      throw new Error("Can't send message if telegraf is not initialized");
    }
    let chats = await this.chats();
    for (let id of chats) {
      await this.bot.telegram.sendMessage(id, message);
    }
  },
  bot: undefined,
  /**
   * Initilize Telegraf with TELEGRAM_TOKEN
   *
   * @returns {Promise<void>}
   */
  async init(): Promise<void> {
    if (typeof process.env.TELEGRAM_TOKEN === "undefined") {
      throw new Error("Telegram token not found");
    }
    const token = process.env.TELEGRAM_TOKEN;
    this.bot = new Telegraf(token);
  }
};

export default telegraf;