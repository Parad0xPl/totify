import db from "./db";
import bot from "./telegraf";

/**
 * Initialization step
 *
 * @returns {Promise<void>}
 */
async function init(): Promise<void> {
  try {
    await db.sequelize.sync();
    await bot.init();
  } catch (e) {
    console.log("Error while initialiazing:");
    console.log(e.message);
    process.exit(-1);
  }
}
export default init;