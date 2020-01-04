import moment from "moment";
import _debug from "debug";
import {Markup, CallbackButton} from "telegraf";
const debug = _debug("totify:bot/app");

import cmdRegistry from "../commandRegistry";
import telegraf from "../telegraf";
import db from "../db";
import _ie from "../utils/internalError";
const ie = _ie("bot/app");
import parseId from "../utils/parseId";
import { Context } from "./auth";

async function fetchPendingApps(): Promise<CallbackButton[][]> {
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

async function getPAppsKeyboard(apps?: any): Promise<object> {
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
      if(!ctx.match){
        throw new Error("There is no match attribute");
      }
      debug("Activating app", ctx.match[1]);
      let id = ctx.match[1];
      let app = await db.App.findByPk(id);
      if(app == null){
        throw new Error(`There is no app with id equeal ${id}`);
      }
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
      if(!ctx.match){
        throw new Error("There is no match attribute");
      }
      debug("Deactivating app", ctx.match[1]);
      let id = ctx.match[1];
      let app = await db.App.findByPk(id);
      if(app == null){
        throw new Error(`There is no app with id equeal ${id}`);
      }
      await app.destroy();
      await ctx.editMessageText(`[${app.name}] Removed`, await getPAppsKeyboard());
    } catch (e) {
      ie(2, e);
    }
  });

  cmdRegistry.register("pendingApps", async (ctx) => {
    try {
      let pendingApps = await fetchPendingApps();
      if (pendingApps.length <= 0) {
        ctx.reply("No application is waiting for activation");
        return;
      }
      return ctx.reply('Apps to activate', await getPAppsKeyboard(pendingApps));
    } catch (e) {
      ie(3, e);
    }
  });

  cmdRegistry.register("registerApp", async (ctx: Context) => {
    try {
      if(!ctx.state){
        throw new Error("There is no state attribute");
      }
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

  async function printAppsList(page: number, ctx: Context): Promise<[string, object]> {
    let apps = await db.App.findAndCountAll({
      limit: 5,
      offset: 5 * page
    });
    const count = apps.count;
    const maxPage = Math.floor(count / 5);
    if (apps.rows.length <= 0) {
      ctx.reply("No apps to show");
      throw new Error("No apps to show");
    }
    let msg = apps.rows.map(el => {
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
    return [msg, Markup.inlineKeyboard(keyboard).extra()];
  }

  cmdRegistry.register("apps", async (ctx: Context) => {
    try {
      if(!ctx.state){
        throw new Error("There is no state attribute");
      }
      const page = parseId(ctx.state.command.splitArgs[0]) - 1;
      let args = await printAppsList(page, ctx);
      return ctx.reply.apply(ctx, args);
    } catch (e) {
      ie(5, e);
    }
  });

  telegraf.bot.action(/^apps (\d+)$/, async (ctx) => {
    try {
      if(!ctx.match){
        throw new Error("There is no match attribute");
      }
      const page = parseInt(ctx.match[1]);
      let args = await printAppsList(page, ctx);
      if(args == undefined){
        throw new Error("There is no app on list");
      }
      return ctx.editMessageText.apply(ctx, args);
    } catch (e) {
      ie(6, e);
    }
  });

}


export default app;