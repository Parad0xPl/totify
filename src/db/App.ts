import sequelize from "./sequelize";
import Sequelize, { Model } from "sequelize";
import randomatic from "randomatic";

class App extends Model {
  id!: number;
  name!: string;
  auth!: string;
  activated!: boolean;
}

App.init({
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
  sequelize,
  hooks: {
    beforeCreate: (app, options) => {
      let authCode = [
        randomatic("A", 5),
        randomatic("0", 3),
        randomatic("Aa0", 20)
      ].join("-");
      app.auth = authCode;
    }
  }
});

export default App;