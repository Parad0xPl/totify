import sequelize from "./sequelize";
import Sequelize, { Model } from "sequelize";
import randomatic from "randomatic";

class App extends Model {
  id!: number;
  name!: string;
  authCode!: string;
  isActivated!: boolean;
}

App.init({
  name: {
    type: Sequelize.STRING,
    field: "name"
  },
  authCode: {
    type: Sequelize.STRING,
    field: "auth",
    defaultValue: "",
    unique: true
  },
  isActivated: {
    type: Sequelize.BOOLEAN,
    field: "activated",
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
      app.authCode = authCode;
    }
  }
});

export default App;