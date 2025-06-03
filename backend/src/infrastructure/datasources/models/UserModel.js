const { DataTypes } = require("sequelize");
const { sequelize } = require("../database");

const UserModel = sequelize.define("User", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false
  },
  passwordHash: {
    type: DataTypes.STRING,
    allowNull: true // Nullable для SSO пользователей
  },
  authProvider: {
    type: DataTypes.STRING(20),
    allowNull: false,
    defaultValue: 'local',
    validate: {
      isIn: [['local', 'keycloak']]
    }
  },
  externalId: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  metadata: {
    type: DataTypes.JSON,
    allowNull: true
  }
}, {
  indexes: [
    {
      fields: ['externalId'],
      name: 'idx_users_external_id'
    },
    {
      fields: ['authProvider'],
      name: 'idx_users_auth_provider'
    },
    {
      fields: ['email', 'authProvider'],
      name: 'idx_users_email_auth_provider',
      unique: true
    }
  ]
});

module.exports = UserModel;