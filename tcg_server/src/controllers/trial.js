const { createOneTrial, getSpecificTrials, updateOneTrial, deleteOneTrial, getSummary } = require('../service/trial');

const trialGenerateController = async (ctx, next) => {
  let result;
  try {
    const createdTrial = await createOneTrial(ctx.request.body.newTrial);
    result = {
      statusCode: "1",
      createdTrial: createdTrial,
    };
  } catch (error) {
    console.error(error);
    result = {
      statusCode: "0",
      error: {
        message: `unknown error when create one trial: ${error}`,
        errorCode: '0_CREATE_TRIAL',
      },
    };
  } finally {
    ctx.response.body = result;
  }
};

const trialBatchQueryController = async (ctx, next) => {
  let result;
  try {
    const queryResults = await getSpecificTrials(ctx.request.body.batchQueryParams);
    result = {
      statusCode: "1",
      queryResults: queryResults,
    };
  } catch (error) {
    console.error(error);
    result = {
      statusCode: "0",
      error: {
        message: `unknown error when doing batch queries: ${error}`,
        errorCode: '0_BATCH_QUERY',
      },
    };
  } finally {
    ctx.response.body = result;
  }
};

const trialUpdateController = async (ctx, next) => {
  let result;
  try {
    const updatedTrial = await updateOneTrial(ctx.request.body.updatedTrial);
    result = {
      statusCode: "1",
      updatedTrial: updatedTrial,
    };
  } catch (error) {
    console.error(error);
    result = {
      statusCode: "0",
      error: {
        message: `unknown error when update one trial: ${error}`,
        errorCode: '0_UPDATE_TRIAL',
      },
    };
  } finally {
    ctx.response.body = result;
  }
};

const trialDeleteController =  async (ctx, next) => {
  let result;
  try {
    const deletedTrial = await deleteOneTrial(ctx.request.body.trialUUID);
    result = {
      statusCode: "1",
      deletedTrial: deletedTrial,
    };
  } catch (error) {
    console.error(error);
    result = {
      statusCode: "0",
      error: {
        message: `unknown error when delete one trial: ${error}`,
        errorCode: '0_DELETE_TRIAL',
      },
    };
  } finally {
    ctx.response.body = result;
  }
};

const trialSummaryController = async (ctx, next) => {
  let result;
  try {
    const queryResults = await getSummary(ctx.request.body.summaryParams);
    result = {
      statusCode: "1",
      queryResults: queryResults,
    };
  } catch (error) {
    console.error(error);
    result = {
      statusCode: "0",
      error: {
        message: `unknown error when doing batch queries: ${error}`,
        errorCode: '0_SUMMARY_QUERY',
      },
    };
  } finally {
    ctx.response.body = result;
  }
};

module.exports = { trialGenerateController, trialBatchQueryController, trialUpdateController, trialDeleteController, trialSummaryController };