class User {
  constructor(id, username, firstName, lastName, email, avatarUrl = null, passwordHash = null, authProvider = 'local', 
              externalId = null, metadata = null, createdAt, updatedAt) {
    this.id = id;
    this.username = username;
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
    this.avatarUrl = avatarUrl;
    this.passwordHash = passwordHash; // nullable для SSO пользователей
    this.authProvider = authProvider; // enum: 'local', 'keycloak'
    this.externalId = externalId; // ID в внешней системе (Keycloak)
    this.metadata = metadata; // дополнительные данные из SSO
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  isLocal() {
    return this.authProvider === 'local';
  }

  isKeycloak() {
    return this.authProvider === 'keycloak';
  }

  canLoginLocally() {
    return this.isLocal() && this.passwordHash !== null;
  }
}

module.exports = User; 