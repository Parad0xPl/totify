//@flow

const sequelize = require("./sequelize");

const models = {
  App: require("./App.js"),
  User: require("./User.js")
};

module.exports = {
  sequelize,
  ...models
}