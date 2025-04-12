class User {
  constructor(id, username, email, passwordHash, createdAt, updatedAt) {
    this.id = id;
    this.username = username;
    this.email = email;
    this.passwordHash = passwordHash;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }
}

module.exports = User; 