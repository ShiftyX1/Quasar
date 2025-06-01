import { DataTypes } from "sequelize";
import { sequelize } from "../database";
const ChatRoomModel = require("./ChatRoomModel");

const ChatRoomInfoModel = sequelize.define("ChatRoomInfo", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  chatRoomId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: ChatRoomModel,
      key: "id"
    }
  },
  pictureUrl: {
    type: DataTypes.STRING,
    allowNull: true
  },
  description: {
    type: DataTypes.STRING,
    allowNull: true
  },
  
});