require('dotenv').config();
const { Sequelize } = require('sequelize');
const allModels = require('./allModels');
const DB_NAME = process.env.DB_NAME;
const DB_USERNAME = process.env.DB_USERNAME;
const DB_PASSWORD = process.env.DB_PASSWORD;

const sequelize = new Sequelize(DB_NAME, DB_USERNAME, DB_PASSWORD, {
  host: 'localhost',
  dialect: 'mysql',
  port: 3306,
  logging: false
});

const models = allModels(sequelize);

const dbConnection = () => {
  sequelize.authenticate().then(() => {
    sequelize.sync({ alter: false });
    console.log('DB connected and synced');
  }).catch((error) => {
    console.log('Error connecting to DB:', error);
  })
};

module.exports = {
  dbConnection,
  models
}