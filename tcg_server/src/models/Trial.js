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
  trialGenerationDate: {
    type: Sequelize.STRING(100),
    allowNull: false,
    validate: {
      notNull: {
        msg: 'the generation time of the trial code should be specified'
      },
    },
  },
  trialUniqueSequenceCode: {
    type: Sequelize.INTEGER(),
    allowNull: false,
    defaultValue: 1,
    validate: {
      notNull: {
        msg: 'a unique trial sequence code should be specified'
      },
    },
  },
  trialCountryCode: {
    type: Sequelize.STRING(100),
    allowNull: true,
  },
  trialStatus: {
    type: Sequelize.ENUM,
    values: ['s0', 's1', 's2'],
    allowNull: false,
    defaultValue: "s0",
  },
  trialStatusDescription: {
    type: Sequelize.STRING(255),
    allowNull: true,
  },
}, {
  sequelize,
  modelName: 'trial',
  tableName: 'trial',
  freezeTableName: true,
  timestamps: true,
});

module.exports = Trial;