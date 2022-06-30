const { Trial } = require('../models/index');
const sequelize = require('../database/index');
const { Op } = require("sequelize");

// create one trial
const createOneTrial = async function(body) {
  try {
    return await sequelize.transaction(async (transaction) => {

      // 从request中解析数据
      const parsedNewTrial = {
        trialCompoundName: body.newTrial.trialCompoundName,
        trialPhase: body.newTrial.trialPhase,
        trialGenerationDate: body.newTrial.trialGenerationDate,
        trialCountryCode: body.newTrial.trialCountryCode,
        trialName: body.newTrial.trialName,
        trialProtocolCode: body.newTrial.trialProtocolCode,
      };

      // 获取当前化合物及期型下最大trialUniqueSequenceCode
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
      // 如果当前化合物及期型下最大trialUniqueSequenceCode不存在，说明是全新的
      currentMaxUniqueSequenceCode = currentMaxUniqueSequenceCode? currentMaxUniqueSequenceCode : 0;
      // 下一个编号为最大trialUniqueSequenceCode加1，如果其中包含4则跳过（仅个位数为4跳过）
      let newSeq = currentMaxUniqueSequenceCode + 1;
      let newSeqStr = newSeq.toString();
      while (newSeqStr.charAt(newSeqStr.length - 1) === '4') {
        newSeq = newSeq + 1;
        newSeqStr = newSeq.toString();
      }
      parsedNewTrial.trialUniqueSequenceCode = newSeq;

      console.log('jjj',parsedNewTrial.trialProtocolCode)
      // 检测用户是否提供trialProtocolCode
      if (!parsedNewTrial.trialProtocolCode || parsedNewTrial.trialProtocolCode === '') {
        // 若未提供，则生成trialProtocolCode（最大数加一）
        let uniqueSequenceCodeStr = parsedNewTrial.trialUniqueSequenceCode.toString();
        uniqueSequenceCodeStr = uniqueSequenceCodeStr.length === 1? '0' + uniqueSequenceCodeStr : uniqueSequenceCodeStr;
        parsedNewTrial.trialProtocolCode = parsedNewTrial.trialCompoundName + '-' + parsedNewTrial.trialPhase.substr(1, 1)
          + uniqueSequenceCodeStr;
      } else {
        // 若提供，则直接使用trialProtocolCode，但是要使用用户提供的trialUniqueSequenceCode，而非上面自动生成的
        console.log('ok',body.newTrial.trialUniqueSequenceCode)
        parsedNewTrial.trialUniqueSequenceCode = body.newTrial.trialUniqueSequenceCode;
      }

      // 创建者及时间戳
      parsedNewTrial.trialStatusLog = `Proposed by ${ body.userInfo.username } on ${ new Date().toLocaleDateString() }. </br>`;

      // 获取当前化合物及期型下最大trialCounterNumber
      let currentMaxCounterNumber = await Trial.max(
        'trialCounterNumber',
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
      // 如果当前化合物及期型下最大trialCounterNumber不存在，说明是全新的
      currentMaxCounterNumber = currentMaxCounterNumber? currentMaxCounterNumber : 0;
      // 下一个编号为最大trialCounterNumber加1
      parsedNewTrial.trialCounterNumber = currentMaxCounterNumber + 1;

      // 创建新项目
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
    // 服务端每次都按照filters和sorter获取所有结果，然后根据pagination截取结果并返回客户端
    console.log('pagination', batchQueryParams.pagination)
    // 整理客户端发送的filters
    let queryFilters = {};
    for (let filterKey in batchQueryParams.filters) {
      queryFilters[filterKey] = batchQueryParams.filters[filterKey];
    }
    console.log('queryFilters', queryFilters)
    // 整理客户端发送的sorters
    // TODO: 为什么每次都能按照我希望的顺序出现？？？而且为什么在转化为数组的时候会自动消除那些值为undefined的KV？？？
    let querySorters = [];
    for (let sorterKey in batchQueryParams.sorters) {
      querySorters.push([
        sorterKey, batchQueryParams.sorters[sorterKey]
      ]);
    }
    console.log('querySorters', querySorters)
    let queryResults = {};
    queryResults.hitTargets = await Trial.findAll({
      // skip 'offset' instances and fetch the 'limit' after that
      offset: batchQueryParams.pagination?.offset,
      limit: batchQueryParams.pagination?.limit,
      order: querySorters,
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
          ['trialCounterNumber', 'ASC'],
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