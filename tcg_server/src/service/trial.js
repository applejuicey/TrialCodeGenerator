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
        trialName: newTrial.trialName,
      };
      // 获取当前化合物及期型下最大编号
      let currentMaxUniqueSequenceCode = await Trial.max(
        'trialUniqueSequenceCode',
        {
          where: {
            [Op.and]: [
              { trialCompoundName: parsedNewTrial.trialCompoundName },
              { trialPhase: {
                  [Op.startsWith]: 'p' + parsedNewTrial.trialPhase.substr(1,1),
                } }
            ],
          },
        },
      );
      // 如果当前化合物及期型下最大编号不存在，说明是全新的
      currentMaxUniqueSequenceCode = currentMaxUniqueSequenceCode? currentMaxUniqueSequenceCode : 0;
      // 下一个编号为最大编号加一，如果其中包含4则跳过
      let newSeq = currentMaxUniqueSequenceCode + 1;
      let newSeqStr = newSeq.toString();
      while (newSeqStr.indexOf('4') !== -1) {
        newSeq = newSeq + 1;
        newSeqStr = newSeq.toString();
      }
      parsedNewTrial.trialUniqueSequenceCode = newSeq;
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
      order: [
        ['trialStatus', 'ASC'],
        ['trialGenerationDate', 'DESC'],
        ['trialCompoundName', 'ASC'],
        ['trialPhase', 'ASC'],
        ['trialUniqueSequenceCode', 'ASC'],
      ],
      where: queryFilters,
    });
    queryResults.totalCount = await Trial.count({
      where: queryFilters,
    });
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
      targetRecord.trialName = updatedTrial.trialName;
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
        order: [
          ['trialCompoundName', 'ASC'],
          ['trialPhase', 'ASC'],
          ['trialUniqueSequenceCode', 'ASC'],
        ],
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