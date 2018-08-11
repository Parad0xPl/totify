//@flow

const Sequelize = require('sequelize');
const path = require("path");
const filename = path.join(process.cwd(), 'database.sqlite');
const sequelize = new Sequelize({
  dialect: 'sqlite',
  operatorsAliases: false,
  storage: filename,
  logging: false
});

module.exports = sequelize;