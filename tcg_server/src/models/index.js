const sequelize = require('../database/index');
const xlsx = require('node-xlsx');
const { compounds } = require('./compounds.json');
const { users } = require('./users.json');
const { readXlsxAndCount } = require('../utils/xlsxProcessor');

// import the models
const Trial = require('./Trial');
const User = require('./User');
const Compound = require('./Compound');

// all models(tables) should be initiated upon first-time execution
// const needInitialization = true;
const needInitialization = false;
if (needInitialization) {
  sequelize.sync({
    force: true
  }).then(async () => {
    // try to write data into database
    try {
      console.log('tables have been created, proceeding to write initial records...');
      // users
      await Promise.all(users.map(async (user) => {
        await User.create(user);
      }));
      // trials
      let trials = readXlsxAndCount(__dirname + '\\trials.xlsx');
      await Promise.all(trials.map(async (trial) => {
        await Trial.create({
          trialCompoundName: trial[1],
          trialPhase: trial[2],
          trialGenerationDate: trial[3],
          trialUniqueSequenceCode: trial[4],
          trialCountryCode: trial[5],
          trialStatus: trial[6],
          trialStatusDescription: trial[7],
          trialProtocolCode: trial[8],
          trialName: trial[9],
          trialStatusLog: trial[12],
          trialCounterNumber: trial[13],
        });
      }));
      // compounds
      await Promise.all(compounds.map(async (compoundName) => {
        await Compound.create({
          compoundName: compoundName,
        });
      }));
      console.log('initialisation succeeded');
    } catch (error) {
      console.error(`initialisation error: ${ error }`);
    } finally {
      console.log('initialisation complete');
    }
  }).catch((error) => {
    console.log('initialisation not complete, and the detailed error sees：', error);
  });
}

module.exports = { Trial, User, Compound };