const { getOneUser } = require('../service/user');
const { signToken, verifyToken } = require('../jwt/index');

const loginController = async (ctx, next) => {
  let result;
  try {
    const user = await getOneUser(ctx.request.body.userInfo);
    if (!user) {
      throw new Error('invalid username')
    }
    if (user.password !== ctx.request.body.userInfo.password) {
      throw new Error('incorrect password')
    }
    // success
    const userInfo = {
      userStatus: user.userStatus,
      userType: user.userType,
      userUUID: user.userUUID,
      username: user.username,
    };
    userInfo.token = signToken(userInfo);
    result = {
      statusCode: "1",
      loginResult: userInfo,
    };
  } catch (error) {
    console.error(error);
    result = {
      statusCode: "0",
      error: {
        message: `error occurred when login: ${error}`,
        errorCode: '0_LOGIN',
      },
    };
  } finally {
    ctx.response.body = result;
  }
};

const verifyTokenController = async (ctx, next) => {
  let result;
  try {
    const decodedResult = verifyToken(ctx.request.body.userInfo.token)
    if (!decodedResult.valid) {
      throw new Error('invalid token')
    }
    // success
    result = {
      statusCode: "1",
      decodedResult: decodedResult,
    };
  } catch (error) {
    console.error(error);
    result = {
      statusCode: "0",
      error: {
        message: `error occurred when decode token: ${error}`,
        errorCode: '0_VERIFY_TOKEN',
      },
    };
  } finally {
    ctx.response.body = result;
  }
};

module.exports = { loginController, verifyTokenController };