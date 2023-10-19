import { Sequelize } from 'sequelize';
import { DB_HOST,DB_NAME,DB_PASSWORD,DB_PORT,DB_USER } from '../config.js';

export const sequelize = new Sequelize(
  DB_NAME, DB_USER, DB_PASSWORD, {
  dialect: "mysql",
  host: DB_HOST,
  port: DB_PORT
});
