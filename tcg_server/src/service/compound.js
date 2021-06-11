const { Compound } = require('../models/index');
const sequelize = require('../database/index');
const { Op } = require("sequelize");

// get specific compounds
const getSpecificCompounds = async function(batchQueryParams) {
  try {
    let queryResults = {};
    queryResults.hitTargets = await Compound.findAll({
      attributes: [
        'compoundName'
      ],
      order: [
        ['compoundName', 'ASC'],
      ],
    });
    queryResults.totalCount = await Compound.count({

    });
    return queryResults;
  } catch (error) {
    console.error(error)
  }
};

module.exports = { getSpecificCompounds };