import sequelize from "./sequelize";
import Sequelize, { Model } from "sequelize";

class User extends Model {
  userTelegramId!: number;
  isAuthenticated!: boolean;
  permanentBan!: boolean;
  
  public readonly updatedAt!: Date;

}

User.init({
  userTelegramId: {
    type: Sequelize.BIGINT
  },
  isAuthenticated: {
    type: Sequelize.BOOLEAN,
    defaultValue: false,
    field: "activated"
  },
  permanentBan: {
    type: Sequelize.BOOLEAN,
    defaultValue: false
  }
}, {
  sequelize
})

export default User;