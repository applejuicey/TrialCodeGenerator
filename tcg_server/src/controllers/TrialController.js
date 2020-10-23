const { Trial } = require('../models/index');

// create one trial
const createOneTrial = async function(newTrial) {
  return Trial.create(
    newTrial,
  );
};

module.exports = { createOneTrial };