const RoomMemberRepository = require("../../domain/interfaces/RoomMemberRepository");
const RoomMember = require("../../domain/entities/RoomMember");
const { RoomMemberModel, UserModel, ChatRoomModel } = require("../datasources/models");

class RoomMemberRepositoryImpl extends RoomMemberRepository {
  async create(roomMember) {
    const roomMemberModel = await RoomMemberModel.create({
      userId: roomMember.userId,
      roomId: roomMember.roomId,
      joinedAt: roomMember.joinedAt
    });

    return this._mapToEntity(roomMemberModel);
  }

  async findById(id) {
    const roomMemberModel = await RoomMemberModel.findByPk(id);
    if (!roomMemberModel) return null;
    return this._mapToEntity(roomMemberModel);
  }

  async findByUserAndRoom(userId, roomId) {
    const roomMemberModel = await RoomMemberModel.findOne({
      where: { userId, roomId }
    });
    if (!roomMemberModel) return null;
    return this._mapToEntity(roomMemberModel);
  }

  async findByRoomId(roomId) {
    const roomMemberModels = await RoomMemberModel.findAll({
      where: { roomId },
      include: [
        {
          model: UserModel,
          as: "user",
          attributes: ["id", "username", "email"]
        }
      ]
    });

    return roomMemberModels.map(model => ({
      ...this._mapToEntity(model),
      user: model.user ? {
        id: model.user.id,
        username: model.user.username,
        email: model.user.email
      } : null
    }));
  }

  async findByUserId(userId) {
    const roomMemberModels = await RoomMemberModel.findAll({
      where: { userId },
      include: [
        {
          model: ChatRoomModel,
          as: "room",
          attributes: ["id", "name", "accessCode"]
        }
      ]
    });
    
    return roomMemberModels.map(model => {
      const roomMember = this._mapToEntity(model);
      
      if (model.room) {
        return {
          ...roomMember,
          name: model.room.name,
          accessCode: model.room.accessCode
        };
      }
      
      return roomMember;
    });
  }

  async delete(id) {
    const deleted = await RoomMemberModel.destroy({ where: { id } });
    return !!deleted;
  }

  async deleteByUserAndRoom(userId, roomId) {
    const deleted = await RoomMemberModel.destroy({ where: { userId, roomId } });
    return !!deleted;
  }

  _mapToEntity(roomMemberModel) {
    return new RoomMember(
      roomMemberModel.id,
      roomMemberModel.userId,
      roomMemberModel.roomId,
      roomMemberModel.joinedAt
    );
  }
}

module.exports = RoomMemberRepositoryImpl; 