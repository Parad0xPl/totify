//@flow

const moment = require("moment");

const cmdRegistry = require("../commandRegistry");
const telegraf = require("../telegraf");
const db = require("../db");
const authCode = require("../authCode");
const ie = require("../utils/internalError")("bot/auth");

function auth() {
  if (telegraf.bot == null) {
    throw new Error("Bot uninitialized");
  }

  telegraf.bot.use(async (ctx, next) => {
    try {
      ctx.user = await db.User.findOne({
        where: {
          userTelegramId: ctx.from.id
        }
      });

      if (!!ctx.user) {
        if (ctx.user.permanentBan || ctx.user.activated === false && moment().diff(ctx.user.updatedAt) < moment.duration(1, 'days')) {
          return;
        }
      }
      next();
    } catch (e) {
      ie(1);
    }
  });

  cmdRegistry.register("auth", async (ctx, next) => {
    try {
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
      ie(2);
    }
  });

  telegraf.bot.use((ctx, next) => {
    try {
      if (ctx.user) {
        next()
      } else {
        ctx.reply("You need to be authorised");
      }
    } catch (e) {
      ie(3);
    }
  })

  cmdRegistry.register("getAuthCode", (ctx) => {
    try {
      ctx.reply(`Actual authentication code: ${authCode.get()}`);
    } catch (e) {
      ie(4);
    }
  });
}
module.exports = auth;