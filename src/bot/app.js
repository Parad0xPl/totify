//@flow

const moment = require("moment");

const telegraf = require("../telegraf");
const Extra = require('telegraf/extra');
const Markup = require('telegraf/markup');
const db = require("../db");

function app() {
  if (telegraf.bot == null) {
    throw new Error("Bot uninitialized");
  }

  telegraf.bot.hears(/✔️\[(\d+)\] [\w ]+/, async (ctx) => {
    let id = ctx.match[1];
    let app = await db.App.findById(id);
    await app.update({
      activated: true
    })
    ctx.reply(`${app.name} accepted`);
  });

  telegraf.bot.hears(/❌\[(\d+)\] [\w ]+/, async (ctx) => {
    let id = ctx.match[1];
    let app = await db.App.findById(id);
    await app.destroy();
    ctx.reply(`${app.name} deleted`);
  });

  telegraf.bot.command("pendingApps", async (ctx) => {
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
  });
}
module.exports = app;