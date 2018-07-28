//@flow

const sequelize = require("./sequelize");
const Sequelize = require("sequelize");

const App = sequelize.define("app", {
  name: {
    type: Sequelize.STRING
  },
  activated: {
    type: Sequelize.BOOLEAN,
    default: false
  }
});

module.exports = App;