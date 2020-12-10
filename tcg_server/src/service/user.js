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

module.exports = { getOneUser };