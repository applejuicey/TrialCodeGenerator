const { Trial } = require('../models/index');
const sequelize = require('../database/index');
const { Op } = require("sequelize");

// create one trial
const createOneTrial = async function(body) {
  try {
    return await sequelize.transaction(async (transaction) => {
      const parsedNewTrial = {
        trialCompoundName: body.newTrial.trialCompoundName,
        trialPhase: body.newTrial.trialPhase,
        trialGenerationDate: body.newTrial.trialGenerationDate,
        trialCountryCode: body.newTrial.trialCountryCode,
        trialName: body.newTrial.trialName,
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
      // 创建者及时间戳
      parsedNewTrial.trialStatusLog = `Proposed by ${ body.userInfo.username } on ${ new Date().toLocaleDateString() }. </br>`;
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
const updateOneTrial = async function(body) {
  try {
    return await sequelize.transaction(async (transaction) => {
      const targetRecord = await Trial.findOne({
        where: {
          trialUUID: body.updatedTrial.trialUUID,
        }
      });
      // targetRecord.trialCompoundName = body.updatedTrial.trialCompoundName;
      // targetRecord.trialPhase = body.updatedTrial.trialPhase;
      targetRecord.trialCountryCode = body.updatedTrial.trialCountryCode;
      targetRecord.trialName = body.updatedTrial.trialName;
      targetRecord.trialStatusDescription = body.updatedTrial.trialStatusDescription;
      // 若变更了trialStatus则在trialStatusLog中记录
      const oldTrialStatus = targetRecord.trialStatus;
      if (oldTrialStatus !== body.updatedTrial.trialStatus) {
        targetRecord.trialStatusLog = targetRecord.trialStatusLog + `Status changed by ${ body.userInfo.username } on ${ new Date().toLocaleDateString() }. </br>`;
      }
      targetRecord.trialStatus = body.updatedTrial.trialStatus;
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