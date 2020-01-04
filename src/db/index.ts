import sequelize from "./sequelize";

import User from "./User";
import App from "./App";

const models = {
  App,
  User
};

export default {
  sequelize,
  ...models
}