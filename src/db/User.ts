import sequelize from "./sequelize";
import Sequelize, { Model } from "sequelize";

class User extends Model {
  userTelegramId!: number;
  activated!: boolean;
  permanentBan!: boolean;
  
  public readonly updatedAt!: Date;

}

User.init({
  userTelegramId: {
    type: Sequelize.BIGINT
  },
  activated: {
    type: Sequelize.BOOLEAN,
    defaultValue: false
  },
  permanentBan: {
    type: Sequelize.BOOLEAN,
    defaultValue: false
  }
}, {
  sequelize
})

export default User;