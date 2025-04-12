const { DataTypes } = require("sequelize");
const { sequelize } = require("../database");
const UserModel = require("./UserModel");

const ChatRoomModel = sequelize.define("ChatRoom", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  accessCode: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  ownerId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: UserModel,
      key: "id"
    }
  }
});

ChatRoomModel.belongsTo(UserModel, { foreignKey: "ownerId", as: "owner" });

module.exports = ChatRoomModel; 