const Sequelize = require('sequelize');
const Model = Sequelize.Model;
const sequelize = require('../database/index');

class Compound extends Model {}
Compound.init({
  compoundUUID: {
    type: Sequelize.UUID,
    defaultValue: Sequelize.UUIDV4,
    primaryKey: true,
  },
  compoundName: {
    type: Sequelize.STRING(100),
    allowNull: false,
    validate: {
      notNull: {
        msg: 'a compound name should be specified'
      },
    },
  },
}, {
  sequelize,
  modelName: 'compound',
  tableName: 'compound',
  freezeTableName: true,
  timestamps: true,
});

module.exports = Compound;