class ChatRoomController {
  constructor(createChatRoomUseCase, chatRoomRepository) {
    this.createChatRoomUseCase = createChatRoomUseCase;
    this.chatRoomRepository = chatRoomRepository;
  }

  async create(req, res, next) {
    try {
      const { name } = req.body;
      const ownerId = req.user.id;

      if (!name) {
        return res.status(400).json({ error: "Room name is required" });
      }

      const chatRoom = await this.createChatRoomUseCase.execute(name, ownerId);

      res.status(201).json({
        id: chatRoom.id,
        name: chatRoom.name,
        accessCode: chatRoom.accessCode,
        ownerId: chatRoom.ownerId,
        createdAt: chatRoom.createdAt
      });
    } catch (error) {
      next(error);
    }
  }

  async getOwnedRooms(req, res, next) {
    try {
      const ownerId = req.user.id;
      const rooms = await this.chatRoomRepository.findByOwnerId(ownerId);

      res.status(200).json(rooms.map(room => ({
        id: room.id,
        name: room.name,
        accessCode: room.accessCode,
        createdAt: room.createdAt
      })));
    } catch (error) {
      next(error);
    }
  }

  async getRoom(req, res, next) {
    try {
      const { id } = req.params;
      const room = await this.chatRoomRepository.findById(id);

      if (!room) {
        return res.status(404).json({ error: "Room not found" });
      }

      res.status(200).json({
        id: room.id,
        name: room.name,
        accessCode: room.accessCode,
        ownerId: room.ownerId,
        createdAt: room.createdAt
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = ChatRoomController; 