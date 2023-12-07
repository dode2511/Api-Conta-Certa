import { Sequelize } from 'sequelize';
//import { DB_HOST,DB_NAME,DB_PASSWORD,DB_PORT,DB_USER } from '../config.js';


import { MYSQLHOST,MYSQLPASSWORD,MYSQLUSER,MYSQLPORT,MYSQL_DATABASE } from '../config.js';


export const sequelize = new Sequelize(
  MYSQL_DATABASE, MYSQLUSER, MYSQLPASSWORD, {
  dialect: "mysql",
  host: MYSQLHOST,
  port: MYSQLPORT
});





// export const sequelize = new Sequelize(
//   "teste", "root", "dode2511", {
//   dialect: "mysql",
//   host: "localhost",
//   port: 3306
// });
