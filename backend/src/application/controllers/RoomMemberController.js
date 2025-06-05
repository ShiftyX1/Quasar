class RoomMemberController {
  constructor(joinChatRoomUseCase, roomMemberRepository) {
    this.joinChatRoomUseCase = joinChatRoomUseCase;
    this.roomMemberRepository = roomMemberRepository;
  }

  async join(req, res, next) {
    try {
      const { accessCode } = req.body;
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({ error: "User not authenticated" });
      }

      if (!accessCode) {
        return res.status(400).json({ error: "Access code is required" });
      }

      const roomMember = await this.joinChatRoomUseCase.execute(accessCode, userId);

      res.status(200).json({
        id: roomMember.id,
        userId: roomMember.userId,
        roomId: roomMember.roomId,
        joinedAt: roomMember.joinedAt
      });
    } catch (error) {
      next(error);
    }
  }

  async leave(req, res, next) {
    try {
      const { roomId } = req.params;
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({ error: "User not authenticated" });
      }

      const result = await this.roomMemberRepository.deleteByUserAndRoom(userId, roomId);
      
      if (!result) {
        return res.status(404).json({ error: "Membership not found" });
      }

      res.status(200).json({ message: "Successfully left the room" });
    } catch (error) {
      next(error);
    }
  }

  async getJoinedRooms(req, res, next) {
    try {
      const userId = req.user?.id;
      
      if (!userId) {
        return res.status(401).json({ error: "User not authenticated" });
      }
      
      const joinedRooms = await this.roomMemberRepository.findJoinedRoomsByUserId(userId);

      res.status(200).json(joinedRooms);
    } catch (error) {
      next(error);
    }
  }

  async getRoomMembers(req, res, next) {
    try {
      const { roomId } = req.params;
      const members = await this.roomMemberRepository.findByRoomId(roomId);

      res.status(200).json(members);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = RoomMemberController; 