import auth from "./auth";
import app from "./app";
import telegraf from "../telegraf";
import commandParts from 'telegraf-command-parts';

function bot(): void {
  if(!telegraf.bot){
    throw new Error("Bot need to be initialized");
  }
  // Plugins
  telegraf.bot.use(commandParts());

  // Modules
  auth();
  app();

  // Start
  telegraf.bot.startPolling();
}

export default bot;