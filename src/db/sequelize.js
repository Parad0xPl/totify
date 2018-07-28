//@flow

const Sequelize = require('sequelize');
const sequelize = new Sequelize({
  dialect: 'sqlite',
  operatorsAliases: false,
  storage: 'database.sqlite',
  logging: false
});

module.exports = sequelize;