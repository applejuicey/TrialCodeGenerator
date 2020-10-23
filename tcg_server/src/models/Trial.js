const Sequelize = require('sequelize');
const Model = Sequelize.Model;
const sequelize = require('../database/index');

class Trial extends Model {}
Trial.init({
  trialUUID: {
    type: Sequelize.UUID,
    defaultValue: Sequelize.UUIDV4,
    primaryKey: true,
  },
  trialCompoundName: {
    type: Sequelize.STRING(100),
    allowNull: false,
    validate: {
      notNull: {
        msg: 'the name of the compound should be specified'
      },
    },
  },
  trialPhase: {
    type: Sequelize.ENUM,
    values: ['p1', 'p2', 'p3', 'p4'],
    allowNull: false,
    validate: {
      notNull: {
        msg: 'the phase of the trial should be specified'
      },
    },
  },
  trialGenerationYearMonth: {
    type: Sequelize.STRING(100),
    allowNull: false,
    validate: {
      notNull: {
        msg: 'the generation time of the trial code should be specified'
      },
    },
  },
  countryCode: {
    type: Sequelize.STRING(100),
    allowNull: true,
  },
  trialConfirmationStatus: {
    type: Sequelize.ENUM,
    values: ['c0', 'c1'],
    allowNull: false,
    validate: {
      notNull: {
        msg: 'the confirmation status of the trial should be specified'
      },
    },
  },
}, {
  sequelize,
  modelName: 'trial',
  tableName: 'trial',
  freezeTableName: true,
  timestamps: true,
});

module.exports = Trial;