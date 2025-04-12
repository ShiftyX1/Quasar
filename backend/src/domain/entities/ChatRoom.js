class ChatRoom {
  constructor(id, name, accessCode, ownerId, createdAt, updatedAt) {
    this.id = id;
    this.name = name;
    this.accessCode = accessCode;
    this.ownerId = ownerId;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }
}

module.exports = ChatRoom; 