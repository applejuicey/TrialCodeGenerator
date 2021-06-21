const { getSpecificCompounds } = require('../service/compound');

const compoundQueryController = async (ctx, next) => {
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
        message: `unknown error when doing compound query: ${error}`,
        errorCode: '0_COMPOUND_QUERY',
      },
    };
  } finally {
    ctx.response.body = result;
  }
};

module.exports = { compoundQueryController };