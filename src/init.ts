import db from "./db";
import bot from "./telegraf";

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