const Message = require("../../entities/Message");

class SendMessage {
  constructor(messageRepository, roomMemberRepository) {
    this.messageRepository = messageRepository;
    this.roomMemberRepository = roomMemberRepository;
  }

  async execute(content, userId, roomId) {
    const membership = await this.roomMemberRepository.findByUserAndRoom(userId, roomId);
    if (!membership) {
      throw new Error("User is not a member of this room");
    }

    const message = new Message(
      null,
      content,
      userId,
      roomId,
      new Date()
    );

    return this.messageRepository.create(message);
  }
}

module.exports = SendMessage; 