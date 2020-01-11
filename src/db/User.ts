import sequelize from "./sequelize";
import Sequelize, { Model } from "sequelize";

class User extends Model {
  userTelegramId!: number;
  isAuthenticated!: boolean;
  isPermanentlyBanned!: boolean;
  
  public readonly updatedAt!: Date;

}

User.init({
  userTelegramId: {
    type: Sequelize.BIGINT
  },
  isAuthenticated: {
    type: Sequelize.BOOLEAN,
    field: "activated",
    defaultValue: false
  },
  isPermanentlyBanned: {
    type: Sequelize.BOOLEAN,
    field: "permanentBan",
    defaultValue: false
  }
}, {
  sequelize
})

export default User;