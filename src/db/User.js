//@flow

const sequelize = require("./sequelize");
const Sequelize = require("sequelize");
const randomatic = require("randomatic");

const User = sequelize.define("user", {
  userTelegramId: {
    type: Sequelize.BIGINT
  },
  activated: {
    type: Sequelize.BOOLEAN,
    defaultValue: false
  },
  permanentBan: {
    type: Sequelize.BOOLEAN,
    defaultValue: false
  }
});

module.exports = User;