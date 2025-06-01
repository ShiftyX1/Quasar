const ChatRoom = require("../../entities/ChatRoom");
const RoomMember = require("../../entities/RoomMember");
const { nanoid } = require("nanoid");

class CreateChatRoom {
  constructor(chatRoomRepository, roomMemberRepository) {
    this.chatRoomRepository = chatRoomRepository;
    this.roomMemberRepository = roomMemberRepository;
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

    const createdRoom = await this.chatRoomRepository.create(chatRoom);
    console.log(createdRoom);

    const roomMember = new RoomMember(
      null,
      ownerId,
      createdRoom.id,
      now
    );
    console.log(roomMember);

    await this.roomMemberRepository.create(roomMember);

    return createdRoom;
  }
}

module.exports = CreateChatRoom; 