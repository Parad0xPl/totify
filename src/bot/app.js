//@flow

const moment = require("moment");
const debug = require("debug")("totify:bot/app");

const cmdRegistry = require("../commandRegistry");
const telegraf = require("../telegraf");
const Extra = require('telegraf/extra');
const Markup = require('telegraf/markup');
const db = require("../db");
const ie = require("../utils/internalError")("bot/app");
const parseId = require("../utils/parseId");

async function fetchPendingApps() {
  let pendingApps = await db.App.findAll({
    where: {
      activated: false
    },
    limit: 5
  });
  let apps = pendingApps.map(el => {
    return [
      Markup.callbackButton(`✔️[${el.id}] ${el.name}`, `activate ${el.id}`),
      Markup.callbackButton(`❌[${el.id}] ${el.name}`, `deactivate ${el.id}`)
    ]
  });
  return apps;
}

async function getPAppsKeyboard(apps: ?any) {
  if (!apps) {
    apps = await fetchPendingApps();
  }
  return Markup.inlineKeyboard(apps)
    .resize()
    .extra();
}

function app() {
  if (telegraf.bot == null) {
    throw new Error("Bot uninitialized");
  }

  telegraf.bot.action(/^activate (\d+)$/, async (ctx) => {
    try {
      debug("Activating app", ctx.match[1]);
      let id = ctx.match[1];
      let app = await db.App.findById(id);
      await app.update({
        activated: true
      })
      ctx.editMessageText(`[${app.name}] Activated`, await getPAppsKeyboard());
    } catch (e) {
      ie(1, e);
    }
  });

  telegraf.bot.action(/^deactivate (\d+)$/, async (ctx) => {
    try {
      debug("Deactivating app", ctx.match[1]);
      let id = ctx.match[1];
      let app = await db.App.findById(id);
      await app.destroy();
      await ctx.editMessageText(`[${app.name}] Removed`, await getPAppsKeyboard());
    } catch (e) {
      ie(2, e);
    }
  });

  cmdRegistry.register("pendingApps", async (ctx) => {
    try {
      let pendingApps = await fetchPendingApps();
      if (pendingApps <= 0) {
        ctx.reply("No application is waiting for activation");
        return;
      }
      return ctx.reply('Apps to activate', await getPAppsKeyboard(pendingApps));
    } catch (e) {
      ie(3, e);
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
      ie(4, e);
    }
  });

  cmdRegistry.register("apps", async (ctx) => {
    try {
      const page = parseId(ctx.state.command.splitArgs[0]) - 1;
      let apps = await db.App.findAndCountAll({
        limit: 5,
        offset: 5 * page
      });
      const count = apps.count;
      const maxPage = Math.floor(count / 5);
      apps = apps.rows;
      if (apps <= 0) {
        ctx.reply("No apps to show");
        return;
      }
      let msg = apps.map(el => {
        return {
          i: el.id,
          n: el.name,
          a: (el.activated ? "Activated" : "Not activated")
        }
      }).map(el => `[${el.i}](${el.n})\t${el.a}\n`).join("");
      const keyboard = [];
      if (page > 0) {
        keyboard.push(Markup.callbackButton(`<< Before`, `apps ${page - 1}`));
      }
      if (page < maxPage) {
        keyboard.push(Markup.callbackButton(`Next >>`, `apps ${page + 1}`));
      }
      return ctx.reply(msg, Markup.inlineKeyboard(keyboard).extra());
    } catch (e) {
      ie(5, e);
    }
  });

  telegraf.bot.action(/^apps (\d+)$/, async (ctx) => {
    try {
      const page = parseInt(ctx.match[1]);
      let apps = await db.App.findAndCountAll({
        limit: 5,
        offset: 5 * page
      });
      const count = apps.count;
      const maxPage = Math.floor(count / 5);
      apps = apps.rows;
      if (apps <= 0) {
        await ctx.editMessageText("No apps to show");
        return;
      }
      let msg = apps.map(el => {
        return {
          i: el.id,
          n: el.name,
          a: (el.activated ? "Activated" : "Not activated")
        }
      }).map(el => `[${el.i}](${el.n})\t${el.a}\n`).join("");
      const keyboard = [];
      if (page > 0) {
        keyboard.push(Markup.callbackButton(`<< Before`, `apps ${page - 1}`));
      }
      if (page < maxPage) {
        keyboard.push(Markup.callbackButton(`Next >>`, `apps ${page + 1}`));
      }
      await ctx.editMessageText(msg, Markup.inlineKeyboard(keyboard).extra());
    } catch (e) {
      ie(6, e);
    }
  });

}
module.exports = app;