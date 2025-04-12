const { DataTypes } = require("sequelize");
const { sequelize } = require("../database");
const UserModel = require("./UserModel");
const ChatRoomModel = require("./ChatRoomModel");

const MessageModel = sequelize.define("Message", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: UserModel,
      key: "id"
    }
  },
  roomId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: ChatRoomModel,
      key: "id"
    }
  }
});

MessageModel.belongsTo(UserModel, { foreignKey: "userId", as: "user" });
MessageModel.belongsTo(ChatRoomModel, { foreignKey: "roomId", as: "room" });

module.exports = MessageModel; 