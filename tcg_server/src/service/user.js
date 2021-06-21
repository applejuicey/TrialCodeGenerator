const { User } = require('../models/index');
const sequelize = require('../database/index');
const { Op } = require("sequelize");

// get one user
const getOneUser = async function(userInfo) {
  try {
    return await sequelize.transaction(async () => {
      return await User.findOne({
        where: {
          username: userInfo.username,
        }
      });
    });
  } catch (error) {
    console.error(error)
  }
};

// update one user
const updateOneUser = async function(userInfo) {
  try {
    console.log(userInfo)
    return await sequelize.transaction(async (transaction) => {
      const targetRecord = await User.findOne({
        where: {
          username: userInfo.username,
        }
      });
      targetRecord.password = userInfo.newPassword;
      return await targetRecord.save();
    });
  } catch (error) {
    console.error(error)
  }
};

module.exports = { getOneUser, updateOneUser };