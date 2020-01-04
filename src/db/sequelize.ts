import {Sequelize} from 'sequelize';
import * as path from 'path';

// TODO custom database path
const filename = path.join(process.cwd(), 'database.sqlite');
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: filename,
  logging: false
});

export default sequelize;