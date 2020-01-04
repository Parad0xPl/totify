import cmdRegistry from "../commandRegistry";
import telegraf from "../telegraf";
import db from "../db";
import authCode from "../authCode";
import _ie from "../utils/internalError";
const ie = _ie("bot/auth");

import {ContextMessageUpdate} from "telegraf";
import User from "../db/User";

export interface Context extends ContextMessageUpdate{
    user?: User | null
    state?: {
      command: ParsedCommand
    }
}

function auth(): void {
  if (telegraf.bot == null) {
    throw new Error("Bot uninitialized");
  }

  telegraf.bot.use(async (ctx: Context, next) => {
    try {
      if (!ctx.from) {
        throw new Error("Can't handle anonymous message");
      }
      if (!next) {
        throw new Error("No callback");
      }
      ctx.user = await db.User.findOne({
        where: {
          userTelegramId: ctx.from.id
        }
      });

      if (!!ctx.user) {
        // Czemu tu było jakieś sprawdzenie kiedy ostatnio był aktualizowany profil :shrug:
        if (ctx.user.permanentBan || ctx.user.activated === false) {
          return;
        }
      }
      next();
    } catch (e) {
      ie(1, e);
    }
  });

  cmdRegistry.register("auth", async (ctx: Context, next) => {
    try {
      if (!ctx.from || !ctx.state) {
        throw new Error("There is no from attribute");
      }
      if (ctx.user && ctx.user.activated == true) {
        ctx.reply("Already authorised");
        return
      }
      const args = ctx.state.command.args;
      let actualAuthCode = authCode.get();
      if (args === actualAuthCode) {
        if (ctx.user) {
          await ctx.user.update({
            activated: true
          });
        } else {
          let user = await db.User.findOrCreate({
            where: {
              userTelegramId: ctx.from.id
            }, defaults: {
              activated: true
            }
          });
        }
        authCode.generate();
        ctx.reply("User authenticated");
      } else {
        let user = await db.User.create({
          userTelegramId: ctx.from.id,
          activated: false
        });
        ctx.reply("Wrong authentication code. Will be banned for 24H")
      }
    } catch (e) {
      ie(2, e);
    }
  });

  telegraf.bot.use((ctx: Context, next) => {
    try {
      if (ctx.user && next) {
        next()
      } else {
        ctx.reply("You need to be authorised");
      }
    } catch (e) {
      ie(3, e);
    }
  })

  cmdRegistry.register("getAuthCode", (ctx) => {
    try {
      ctx.reply(`Actual authentication code: ${authCode.get()}`);
    } catch (e) {
      ie(4, e);
    }
  });
}
export default auth;