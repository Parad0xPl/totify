//@flow

const sequelize = require("./sequelize");

const models = {
  App: require("./App.js")
};

module.exports = {
  sequelize,
  ...models
}