//@flow

const sequelize = require("./sequelize");
const Sequelize = require("sequelize");
const randomatic = require("randomatic");

const App = sequelize.define("app", {
  name: {
    type: Sequelize.STRING
  },
  auth: {
    type: Sequelize.STRING,
    defaultValue: "",
    unique: true
  },
  activated: {
    type: Sequelize.BOOLEAN,
    defaultValue: false
  }
}, {
    hooks: {
      afterCreate: (app, options, fn) => {
        let authCode = [
          app.id,
          randomatic("A", 5),
          randomatic("0", 3),
          randomatic("Aa0", 20)
        ].join("-");
        return app.updateAttributes({
          auth: authCode
        });
      }
    }
  });

module.exports = App;