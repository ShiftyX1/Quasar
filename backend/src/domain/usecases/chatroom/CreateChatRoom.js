const ChatRoom = require("../../entities/ChatRoom");
const { nanoid } = require("nanoid");

class CreateChatRoom {
  constructor(chatRoomRepository) {
    this.chatRoomRepository = chatRoomRepository;
  }

  async execute(name, ownerId) {
    const accessCode = nanoid(8);
    const now = new Date();
    
    const chatRoom = new ChatRoom(
      null,
      name,
      accessCode,
      ownerId,
      now,
      now
    );

    return this.chatRoomRepository.create(chatRoom);
  }
}

module.exports = CreateChatRoom; 