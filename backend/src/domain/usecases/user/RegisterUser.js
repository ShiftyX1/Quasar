const User = require("../../entities/User");

class RegisterUser {
  constructor(userRepository, passwordHasher, settings) {
    this.userRepository = userRepository;
    this.passwordHasher = passwordHasher;
    this.settings = settings;
  }

  async execute(username, email, password) {
    if (!this.settings.isLocalRegistrationAllowed) {
      throw new Error("Local registration is disabled in SSO-only mode");
    }

    const existingUserByEmail = await this.userRepository.findByEmailAndProvider(email, 'local');
    if (existingUserByEmail) {
      throw new Error("Email already in use");
    }

    if (this.settings.isKeycloakEnabled) {
      const existingKeycloakUser = await this.userRepository.findByEmailAndProvider(email, 'keycloak');
      if (existingKeycloakUser) {
        throw new Error("Email already registered with SSO. Please use SSO login.");
      }
    }

    const existingUserByUsername = await this.userRepository.findByUsername(username);
    if (existingUserByUsername) {
      throw new Error("Username already taken");
    }

    const passwordHash = await this.passwordHasher.hash(password);
    const now = new Date();

    const metadata = {
      firstLogin: true,
    }
    
    const user = new User(
      null,
      username,
      null, // firstName
      null, // lastName
      email,
      null, // avatarUrl
      passwordHash,
      'local', // authProvider
      null, // externalId
      metadata, // metadata
      now,
      now
    );

    return this.userRepository.create(user);
  }
}

module.exports = RegisterUser; 