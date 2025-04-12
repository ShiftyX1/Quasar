class MessageController {
  constructor(sendMessageUseCase, getRoomMessagesUseCase) {
    this.sendMessageUseCase = sendMessageUseCase;
    this.getRoomMessagesUseCase = getRoomMessagesUseCase;
  }

  async sendMessage(req, res, next) {
    try {
      const { content, roomId } = req.body;
      const userId = req.user.id;

      if (!content || !roomId) {
        return res.status(400).json({ error: "Content and roomId are required" });
      }

      const message = await this.sendMessageUseCase.execute(content, userId, roomId);

      res.status(201).json({
        id: message.id,
        content: message.content,
        userId: message.userId,
        roomId: message.roomId,
        createdAt: message.createdAt
      });
    } catch (error) {
      next(error);
    }
  }

  async getRoomMessages(req, res, next) {
    try {
      const { roomId } = req.params;
      const userId = req.user.id;
      const { limit, offset } = req.query;

      const messages = await this.getRoomMessagesUseCase.execute(
        roomId,
        userId,
        limit ? parseInt(limit) : undefined,
        offset ? parseInt(offset) : undefined
      );

      res.status(200).json(messages);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = MessageController; 