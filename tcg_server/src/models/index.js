const sequelize = require('../database/index');
const xlsx = require('node-xlsx');
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
    // users
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
    // trials
    const sheets = xlsx.parse(__dirname + '\\data.xlsx');
    sheets.forEach((sheet) => {
      for (let rowId in sheet['data']) {
        let row = sheet['data'][rowId];
        if (rowId !== '0' && row.length !== 0) {
          (async function() {
            await Trial.create({
              trialCompoundName: row[0],
              trialPhase: 'p' + row[1],
              trialGenerationDate: row[2],
              trialUniqueSequenceCode: row[5],
              trialCountryCode: row[3],
              trialStatus: 's1',
              trialStatusDescription: '',
              trialPreviousProtocolCode: row[4],
            });
          }())
        }
      }
    });
    console.log('initialisation complete');
  }).catch((error) => {
    console.log('initialisation not complete, and the detailed error sees：', error);
  });
}

module.exports = { Trial, User };