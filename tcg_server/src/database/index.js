const { Sequelize } = require('sequelize');

const databaseConfig = {
  databaseName: 'TCG',
  username: 'yangfan',
  password: 'Fyhaoshuai23333',
  host: 'localhost',
  port: '3306'
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