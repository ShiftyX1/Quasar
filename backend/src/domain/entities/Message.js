class Message {
  constructor(id, content, userId, roomId, createdAt) {
    this.id = id;
    this.content = content;
    this.userId = userId;
    this.roomId = roomId;
    this.createdAt = createdAt;
  }
}

module.exports = Message; 