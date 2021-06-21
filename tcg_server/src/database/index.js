const { Sequelize } = require('sequelize');
const { dbConfig } = require('./config.js');

const databaseConfig = {
  databaseName: dbConfig.databaseName,
  username: dbConfig.username,
  password: dbConfig.password,
  host: dbConfig.host,
  port: dbConfig.port
};

const sequelize = new Sequelize(databaseConfig.databaseName, databaseConfig.username, databaseConfig.password, {
  host: databaseConfig.host,
  port: databaseConfig.port,
  dialect: 'mysql',
  pool: {
    max: 5,
    min: 0,
    idle: 10000,
  },
  define: {
    charset: 'utf8',
    dialectOptions: {
      collate: 'utf8_general_ci',
    },
  },
});

async function databaseConnectionTest () {
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
}

databaseConnectionTest();

module.exports = sequelize;