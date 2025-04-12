const User = require("../../entities/User");

class RegisterUser {
  constructor(userRepository, passwordHasher) {
    this.userRepository = userRepository;
    this.passwordHasher = passwordHasher;
  }

  async execute(username, email, password) {
    const existingUserByEmail = await this.userRepository.findByEmail(email);
    if (existingUserByEmail) {
      throw new Error("Email already in use");
    }

    const existingUserByUsername = await this.userRepository.findByUsername(username);
    if (existingUserByUsername) {
      throw new Error("Username already taken");
    }

    const passwordHash = await this.passwordHasher.hash(password);
    const now = new Date();
    
    const user = new User(
      null,
      username,
      email,
      passwordHash,
      now,
      now
    );

    return this.userRepository.create(user);
  }
}

module.exports = RegisterUser; 