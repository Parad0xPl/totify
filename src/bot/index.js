//@flow

const auth = require("./auth");
const telegraf = require("../telegraf");
const commandParts = require('telegraf-command-parts');

function bot() {
  // Plugins
  telegraf.bot.use(commandParts());

  // Modules
  auth();

  // Start
  telegraf.bot.startPolling();
}

module.exports = bot;