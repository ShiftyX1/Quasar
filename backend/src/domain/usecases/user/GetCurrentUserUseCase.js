/**
 * Use Case для получения полной информации о текущем пользователе
 */
class GetCurrentUserUseCase {
  constructor(userRepository) {
    this.userRepository = userRepository;
  }

  async execute(userId) {
    if (!userId) {
      throw new Error('User ID is required');
    }

    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    // Возвращаем все поля кроме passwordHash
    return {
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
    };
  }
}

module.exports = GetCurrentUserUseCase; 