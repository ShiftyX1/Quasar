class LoginUser {
  constructor(userRepository, passwordHasher, tokenGenerator) {
    this.userRepository = userRepository;
    this.passwordHasher = passwordHasher;
    this.tokenGenerator = tokenGenerator;
  }

  async execute(email, password) {
    const user = await this.userRepository.findByEmailAndProvider(email, 'local');
    if (!user) {
      const keycloakUser = await this.userRepository.findByEmailAndProvider(email, 'keycloak');
      if (keycloakUser) {
        throw new Error("This email is registered with SSO. Please use SSO login.");
      }
      throw new Error("Неправильное имя пользователя или пароль");
    }

    if (!user.canLoginLocally()) {
      throw new Error("Local login not allowed for this user");
    }

    const isPasswordValid = await this.passwordHasher.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      throw new Error("Неправильное имя пользователя или пароль");
    }

    const token = this.tokenGenerator.generate({
      id: user.id,
      username: user.username,
      email: user.email,
      authProvider: user.authProvider
    });

    return {
      user: {
        id: user.id,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        avatarUrl: user.avatarUrl,
        authProvider: user.authProvider,
        externalId: user.externalId,
        metadata: user.metadata,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      },
      token
    };
  }
}

module.exports = LoginUser; 