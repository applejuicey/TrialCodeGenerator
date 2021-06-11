const sequelize = require('../database/index');
const xlsx = require('node-xlsx');
const { compounds } = require('./compounds.json');
const { users } = require('./users.json');

// import the models
const Trial = require('./Trial');
const User = require('./User');
const Compound = require('./Compound');

// all models(tables) should be initiated upon first-time execution
const needInitialization = true;
// const needInitialization = false;
if (needInitialization) {
  sequelize.sync({
    force: true
  }).then(async () => {
    console.log('tables have been created, proceeding to write initial records...');
    // users
    users.forEach((user) => {
      (async function() {
        await User.create(user);
      }());
    });
    // trials
    const sheets = xlsx.parse(__dirname + '\\data.xls');
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
              trialName: row[6],
            });
          }());
        }
      }
    });
    // compounds
    compounds.forEach((compound) => {
      if (compound) {
        (async function() {
          await Compound.create({
            compoundName: compound,
          });
        }());
      }
    });
    console.log('initialisation complete');
  }).catch((error) => {
    console.log('initialisation not complete, and the detailed error sees：', error);
  });
}

module.exports = { Trial, User, Compound };