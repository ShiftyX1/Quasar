class GetRoomMessages {
  constructor(messageRepository, roomMemberRepository) {
    this.messageRepository = messageRepository;
    this.roomMemberRepository = roomMemberRepository;
  }

  async execute(roomId, userId, limit = 50, offset = 0) {
    const membership = await this.roomMemberRepository.findByUserAndRoom(userId, roomId);
    if (!membership) {
      throw new Error("User is not a member of this room");
    }

    return this.messageRepository.findByRoomId(roomId, limit, offset);
  }
}

module.exports = GetRoomMessages; 