const { getSpecificCompounds } = require('../service/compound');

const getCompoundsController = async (ctx, next) => {
  let result;
  try {
    const queryResults = await getSpecificCompounds(ctx.request.body.batchQueryParams);
    result = {
      statusCode: "1",
      queryResults: queryResults,
    };
  } catch (error) {
    console.error(error);
    result = {
      statusCode: "0",
      error: {
        message: `unknown error when doing compounds batch queries: ${error}`,
        errorCode: '0_C_BATCH_QUERY',
      },
    };
  } finally {
    ctx.response.body = result;
  }
};

module.exports = { getCompoundsController };