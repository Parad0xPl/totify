//@flow

const moment = require("moment");

const cmdRegistry = require("../commandRegistry");
const telegraf = require("../telegraf");
const Extra = require('telegraf/extra');
const Markup = require('telegraf/markup');
const db = require("../db");
const ie = require("../utils/internalError")("bot/app");

function app() {
  if (telegraf.bot == null) {
    throw new Error("Bot uninitialized");
  }

  telegraf.bot.hears(/✔️\[(\d+)\] [\w ]+/, async (ctx) => {
    try {
      let id = ctx.match[1];
      let app = await db.App.findById(id);
      await app.update({
        activated: true
      })
      ctx.reply(`${app.name} accepted`);
    } catch (e) {
      ie(1);
    }
  });

  telegraf.bot.hears(/❌\[(\d+)\] [\w ]+/, async (ctx) => {
    try {
      let id = ctx.match[1];
      let app = await db.App.findById(id);
      await app.destroy();
      ctx.reply(`${app.name} deleted`);
    } catch (e) {
      ie(2);
    }
  });

  cmdRegistry.register("pendingApps", async (ctx) => {
    try {
      let pendingApps = await db.App.findAll({
        where: {
          activated: false
        },
        limit: 5
      });
      if (pendingApps <= 0) {
        ctx.reply("No application is waiting for activation");
        return;
      }
      let apps = pendingApps.map(el => {
        return [
          `✔️[${el.id}] ${el.name}`,
          `❌[${el.id}] ${el.name}`
        ]
      });
      console.log(apps);
      return ctx.reply('Activate app', Markup
        .keyboard(apps)
        .oneTime()
        .resize()
        .extra());
    } catch (e) {
      ie(3);
    }
  });

  cmdRegistry.register("registerApp", async (ctx) => {
    try {
      const args: string = await ctx.state.command.args;
      if (args.length > 25) {
        ctx.reply("Name to long!");
        return;
      }
      const appName = args;
      const instance = await db.App.create({
        name: appName,
        activated: true
      });
      ctx.reply(`App registered\n` +
        `Name: ${instance.name}\n` +
        `Auth: ${instance.auth}`);
      return;
    } catch (e) {
      ie(4);
    }
  });
}
module.exports = app;