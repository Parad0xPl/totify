//@flow
const db = require("./db");
const bot = require("./telegraf");

async function init() {
  try {
    await db.sequelize.sync();
    await bot.init();
  } catch (e) {
    console.log(e.message);
    process.exit(-1);
  }
}
module.exports = init;