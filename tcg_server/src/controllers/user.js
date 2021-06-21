const { getOneUser } = require('../service/user');
const { updateOneUser } = require('../service/user');

const userUpdateController = async (ctx, next) => {
  let result;
  try {
    const user = await getOneUser(ctx.request.body.userInfo);
    if (!user) {
      throw new Error('invalid username')
    }
    if (user.password !== ctx.request.body.userInfo.oldPassword) {
      throw new Error('incorrect old password')
    }
    // success
    const updatedUser = await updateOneUser(ctx.request.body.userInfo);
    result = {
      statusCode: "1",
      updatedUser: updatedUser,
    };
  } catch (error) {
    console.error(error);
    result = {
      statusCode: "0",
      error: {
        message: `error occurred when update user: ${error}`,
        errorCode: '0_USER_UPDATE',
      },
    };
  } finally {
    ctx.response.body = result;
  }
};

module.exports = { userUpdateController };