const { Trial } = require('../models/index');
const sequelize = require('../database/index');
const { Op } = require("sequelize");

// create one trial
const createOneTrial = async function(newTrial) {
  try {
    return await sequelize.transaction(async (transaction) => {
      const parsedNewTrial = {
        trialCompoundName: newTrial.trialCompoundName,
        trialPhase: newTrial.trialPhase,
        trialGenerationDate: newTrial.trialGenerationDate,
        trialCountryCode: newTrial.trialCountryCode,
      };
      let currentMaxUniqueSequenceCode = await Trial.max(
        'trialUniqueSequenceCode',
        {
          where: {
            trialCompoundName: {
              [Op.eq]: parsedNewTrial.trialCompoundName,
            },
          },
        },
      );
      currentMaxUniqueSequenceCode = currentMaxUniqueSequenceCode? currentMaxUniqueSequenceCode : 0;
      parsedNewTrial.trialUniqueSequenceCode = currentMaxUniqueSequenceCode + 1;
      return await Trial.create(
        parsedNewTrial,
      );
    });
  } catch (error) {
    console.error(error)
  }
};

// get specific trials
const getSpecificTrials = async function(batchQueryParams) {
  try {
    // skip 'offset' instances and fetch the 'limit' after that
    let queryFilters = {};
    for (let filterKey in batchQueryParams.filters) {
      queryFilters[filterKey] = batchQueryParams.filters[filterKey];
    }
    let queryResults = {};
    queryResults.hitTargets = await Trial.findAll({
      offset: batchQueryParams.results * (batchQueryParams.page - 1),
      limit: batchQueryParams.results,
      // order: [
      //   [batchQueryParams.sortField, batchQueryParams.sortOrder === 'descend'? 'DESC' : 'ASC'],
      // ],
      where: queryFilters,
    });
    queryResults.totalCount = await Trial.count();
    return queryResults;
  } catch (error) {
    console.error(error)
  }
};

// update one trial
const updateOneTrial = async function(updatedTrial) {
  try {
    return await sequelize.transaction(async (transaction) => {
      const targetRecord = await Trial.findOne({
        where: {
          trialUUID: updatedTrial.trialUUID,
        }
      });
      targetRecord.trialCompoundName = updatedTrial.trialCompoundName;
      targetRecord.trialPhase = updatedTrial.trialPhase;
      targetRecord.trialCountryCode = updatedTrial.trialCountryCode;
      targetRecord.trialStatus = updatedTrial.trialStatus;
      targetRecord.trialStatusDescription = updatedTrial.trialStatusDescription;
      return await targetRecord.save();
    });
  } catch (error) {
    console.error(error)
  }
};

// delete one trial
const deleteOneTrial = async function(trialUUID) {
  try {
    return await sequelize.transaction(async (transaction) => {
      const targetRecord = await Trial.findOne({
        where: {
          trialUUID: trialUUID,
        }
      });
      return await targetRecord.destroy();
    });
  } catch (error) {
    console.error(error)
  }
};

// get summary results
const getSummary = async function(summaryParams) {
  try {
    if (summaryParams.compoundNames.includes('ALL')) {
      return await Trial.findAll({
        where: {
          trialStatus: 's1',
        },
      });
    }
    return await Trial.findAll({
      where: {
        trialCompoundName: {
          [Op.in]: summaryParams.compoundNames,
        },
        trialStatus: 's1',
      },
    });
  } catch (error) {
    console.error(error)
  }
};

module.exports = { createOneTrial, getSpecificTrials, updateOneTrial, deleteOneTrial, getSummary };