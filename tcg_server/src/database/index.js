const { Sequelize } = require('sequelize');

const databaseConfig = {
  databaseName: 'TCG',
  username: 'yang.fan',
  password: '666666',
  host: '10.10.8.21',
  port: '26104'
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