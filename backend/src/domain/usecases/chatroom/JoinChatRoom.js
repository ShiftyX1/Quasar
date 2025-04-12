const RoomMember = require("../../entities/RoomMember");

class JoinChatRoom {
  constructor(chatRoomRepository, roomMemberRepository) {
    this.chatRoomRepository = chatRoomRepository;
    this.roomMemberRepository = roomMemberRepository;
  }

  async execute(accessCode, userId) {
    const room = await this.chatRoomRepository.findByAccessCode(accessCode);
    if (!room) {
      throw new Error("Invalid access code");
    }

    const existingMembership = await this.roomMemberRepository.findByUserAndRoom(userId, room.id);
    if (existingMembership) {
      return existingMembership;
    }

    const roomMember = new RoomMember(
      null,
      userId,
      room.id,
      new Date()
    );

    return this.roomMemberRepository.create(roomMember);
  }
}

module.exports = JoinChatRoom; 