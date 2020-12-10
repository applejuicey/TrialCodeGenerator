const Sequelize = require('sequelize');
const Model = Sequelize.Model;
const sequelize = require('../database/index');

class User extends Model {}
User.init({
  userUUID: {
    type: Sequelize.UUID,
    defaultValue: Sequelize.UUIDV4,
    primaryKey: true,
  },
  username: {
    type: Sequelize.STRING(100),
    allowNull: false,
    validate: {
      notNull: {
        msg: 'a username should be specified'
      },
    },
  },
  password: {
    type: Sequelize.STRING(100),
    allowNull: false,
    validate: {
      notNull: {
        msg: 'a password should be specified'
      },
    },
  },
  userType: {
    type: Sequelize.ENUM,
    values: ['t0', 't1', 't2'],
    allowNull: false,
    defaultValue: "t2",
    validate: {
      notNull: {
        msg: 'the type of the user should be specified'
      },
    },
  },
  userStatus: {
    type: Sequelize.ENUM,
    values: ['s0', 's1', 's2'],
    allowNull: false,
    defaultValue: "s0",
    validate: {
      notNull: {
        msg: 'the status of the user should be specified'
      },
    },
  },
}, {
  sequelize,
  modelName: 'user',
  tableName: 'user',
  freezeTableName: true,
  timestamps: true,
});

module.exports = User;