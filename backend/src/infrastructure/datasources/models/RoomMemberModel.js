const { DataTypes } = require("sequelize");
const { sequelize } = require("../database");
const UserModel = require("./UserModel");
const ChatRoomModel = require("./ChatRoomModel");

const RoomMemberModel = sequelize.define("RoomMember", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
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
  },
  joinedAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  }
});

RoomMemberModel.belongsTo(UserModel, { foreignKey: "userId", as: "user" });
RoomMemberModel.belongsTo(ChatRoomModel, { foreignKey: "roomId", as: "room" });

module.exports = RoomMemberModel; 