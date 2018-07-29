//@flow

const auth = require("./auth");
const app = require("./app");
const telegraf = require("../telegraf");
const commandParts = require('telegraf-command-parts');

function bot() {
  // Plugins
  telegraf.bot.use(commandParts());

  // Modules
  auth();
  app();

  // Start
  telegraf.bot.startPolling();
}

module.exports = bot;