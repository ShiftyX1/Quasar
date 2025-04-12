const ChatRoomRepository = require("../../domain/interfaces/ChatRoomRepository");
const ChatRoom = require("../../domain/entities/ChatRoom");
const { ChatRoomModel } = require("../datasources/models");

class ChatRoomRepositoryImpl extends ChatRoomRepository {
  async create(chatRoom) {
    const chatRoomModel = await ChatRoomModel.create({
      name: chatRoom.name,
      accessCode: chatRoom.accessCode,
      ownerId: chatRoom.ownerId
    });

    return this._mapToEntity(chatRoomModel);
  }

  async findById(id) {
    const chatRoomModel = await ChatRoomModel.findByPk(id);
    if (!chatRoomModel) return null;
    return this._mapToEntity(chatRoomModel);
  }

  async findByAccessCode(accessCode) {
    const chatRoomModel = await ChatRoomModel.findOne({ where: { accessCode } });
    if (!chatRoomModel) return null;
    return this._mapToEntity(chatRoomModel);
  }

  async findByOwnerId(ownerId) {
    const chatRoomModels = await ChatRoomModel.findAll({ where: { ownerId } });
    return chatRoomModels.map(model => this._mapToEntity(model));
  }

  async update(id, chatRoomData) {
    const [updated] = await ChatRoomModel.update(chatRoomData, { where: { id } });
    if (!updated) return null;

    const chatRoomModel = await ChatRoomModel.findByPk(id);
    return this._mapToEntity(chatRoomModel);
  }

  async delete(id) {
    const deleted = await ChatRoomModel.destroy({ where: { id } });
    return !!deleted;
  }

  _mapToEntity(chatRoomModel) {
    return new ChatRoom(
      chatRoomModel.id,
      chatRoomModel.name,
      chatRoomModel.accessCode,
      chatRoomModel.ownerId,
      chatRoomModel.createdAt,
      chatRoomModel.updatedAt
    );
  }
}

module.exports = ChatRoomRepositoryImpl; 