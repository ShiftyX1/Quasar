/**
 * Use Case для обновления профиля пользователя
 */
class UpdateUserProfileUseCase {
  constructor(userRepository) {
    this.userRepository = userRepository;
  }

  async execute(userId, profileData) {
    if (!userId) {
      throw new Error('User ID is required');
    }

    if (!profileData.firstName || !profileData.lastName) {
      throw new Error('First name and last name are required');
    }

    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    user.firstName = profileData.firstName.trim();
    user.lastName = profileData.lastName.trim();
    
    console.log('profileData.avatarUrl', profileData.avatarUrl);
    if (profileData.avatarUrl) {
      user.avatarUrl = profileData.avatarUrl;
    }
    
    const updatedMetadata = { ...user.metadata };
    
    if (updatedMetadata.firstLogin) {
      delete updatedMetadata.firstLogin;
    }
    
    user.metadata = updatedMetadata;

    const updatedUser = await this.userRepository.update(user);

    // Возвращаем обновленного пользователя без passwordHash
    return {
      id: updatedUser.id,
      username: updatedUser.username,
      firstName: updatedUser.firstName,
      lastName: updatedUser.lastName,
      email: updatedUser.email,
      avatarUrl: updatedUser.avatarUrl,
      authProvider: updatedUser.authProvider,
      externalId: updatedUser.externalId,
      metadata: updatedUser.metadata,
      createdAt: updatedUser.createdAt,
      updatedAt: updatedUser.updatedAt
    };
  }
}

module.exports = UpdateUserProfileUseCase; 