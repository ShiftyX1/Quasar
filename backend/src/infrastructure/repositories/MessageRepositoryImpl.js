const MessageRepository = require("../../domain/interfaces/MessageRepository");
const Message = require("../../domain/entities/Message");
const { MessageModel, UserModel } = require("../datasources/models");

class MessageRepositoryImpl extends MessageRepository {
  async create(message) {
    const messageModel = await MessageModel.create({
      content: message.content,
      userId: message.userId,
      roomId: message.roomId
    });

    return this._mapToEntity(messageModel);
  }

  async findById(id) {
    const messageModel = await MessageModel.findByPk(id);
    if (!messageModel) return null;
    return this._mapToEntity(messageModel);
  }

  async findByRoomId(roomId, limit = 50, offset = 0) {
    const messageModels = await MessageModel.findAll({
      where: { roomId },
      limit,
      offset,
      order: [["createdAt", "DESC"]],
      include: [
        {
          model: UserModel,
          as: "user",
          attributes: ["id", "username", "email"]
        }
      ]
    });

    return messageModels.map(model => ({
      ...this._mapToEntity(model),
      user: model.user ? {
        id: model.user.id,
        username: model.user.username,
        email: model.user.email
      } : null
    }));
  }

  async delete(id) {
    const deleted = await MessageModel.destroy({ where: { id } });
    return !!deleted;
  }

  _mapToEntity(messageModel) {
    return new Message(
      messageModel.id,
      messageModel.content,
      messageModel.userId,
      messageModel.roomId,
      messageModel.createdAt
    );
  }
}

module.exports = MessageRepositoryImpl; 