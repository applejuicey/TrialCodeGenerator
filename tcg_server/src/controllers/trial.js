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
        errorCode: '0_TRIAL_CREATE',
      },
    };
  } finally {
    ctx.response.body = result;
  }
};

const trialQueryController = async (ctx, next) => {
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
        message: `unknown error when doing trial query: ${error}`,
        errorCode: '0_TRIAL_QUERY',
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
        errorCode: '0_TRIAL_UPDATE',
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
        errorCode: '0_TRIAL_DELETE',
      },
    };
  } finally {
    ctx.response.body = result;
  }
};

const trialSummariseController = async (ctx, next) => {
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
        message: `unknown error when doing summary: ${error}`,
        errorCode: '0_TRIAL_SUMMARIZE',
      },
    };
  } finally {
    ctx.response.body = result;
  }
};

module.exports = { trialGenerateController, trialQueryController, trialUpdateController, trialDeleteController, trialSummariseController };