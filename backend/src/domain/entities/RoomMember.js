class RoomMember {
  constructor(id, userId, roomId, joinedAt) {
    this.id = id;
    this.userId = userId;
    this.roomId = roomId;
    this.joinedAt = joinedAt;
  }
}

module.exports = RoomMember; 