const sequelize = require('../database/index');

// import the models
const Trial = require('./Trial');

// all models(tables) should be initiated upon first-time execution
// const needInitialization = true;
const needInitialization = false;
if (needInitialization) {
  sequelize.sync({
    force: true
  }).then(async () => {
    console.log('tables have been created, proceeding to write initial records...');

    console.log('initialisation complete');
  }).catch((error) => {
    console.log('initialisation not complete, and the detailed error sees：', error);
  });
}

module.exports = { Trial };