const sequelize = require('../database/index');

// import the models
const Trial = require('./Trial');
const User = require('./User');

// all models(tables) should be initiated upon first-time execution
// const needInitialization = true;
const needInitialization = false;
if (needInitialization) {
  sequelize.sync({
    force: true
  }).then(async () => {
    console.log('tables have been created, proceeding to write initial records...');
    await User.create({
      username: 'root',
      password: '123456',
      userType: 't0',
    });
    await User.create({
      username: 'admin',
      password: '123456',
      userType: 't1',
    });
    await User.create({
      username: 'user',
      password: '123456',
      userType: 't2',
    });
    console.log('initialisation complete');
  }).catch((error) => {
    console.log('initialisation not complete, and the detailed error sees：', error);
  });
}

module.exports = { Trial, User };