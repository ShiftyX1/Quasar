const User = require('../../entities/User');

/**
 * Use Case для создания или обновления пользователя из Keycloak данных
 */
class CreateOrUpdateKeycloakUserUseCase {
  constructor(userRepository) {
    this.userRepository = userRepository;
  }

  async execute(keycloakUserData) {
    if (!keycloakUserData.sub) {
      throw new Error('Missing Keycloak user ID (sub)');
    }
    if (!keycloakUserData.email) {
      throw new Error('Missing user email');
    }
    if (!keycloakUserData.preferred_username) {
      throw new Error('Missing username');
    }

    try {
      let existingUser = await this.userRepository.findByExternalId(keycloakUserData.sub);

      if (existingUser) {
        return await this._updateExistingUser(existingUser, keycloakUserData);
      } else {
        return await this._createNewUser(keycloakUserData);
      }
    } catch (error) {
      console.error('Create/Update Keycloak user error:', error.message);
      throw error;
    }
  }

  async _updateExistingUser(existingUser, keycloakUserData) {
    const needsUpdate = 
      existingUser.username !== keycloakUserData.preferred_username ||
      existingUser.email !== keycloakUserData.email ||
      existingUser.firstName !== keycloakUserData.given_name ||
      existingUser.lastName !== keycloakUserData.family_name ||
      JSON.stringify(existingUser.metadata) !== JSON.stringify(this._extractMetadata(keycloakUserData));

    if (!needsUpdate) {
      console.log('User data unchanged, skipping update');
      return existingUser;
    }

    const emailCollision = await this.userRepository.findByEmailAndProvider(
      keycloakUserData.email, 
      'local'
    );
    
    if (emailCollision) {
      throw new Error('EMAIL_COLLISION');
    }

    const updatedUser = new User(
      existingUser.id,
      keycloakUserData.preferred_username,
      keycloakUserData.given_name || null,
      keycloakUserData.family_name || null,
      keycloakUserData.email,
      existingUser.avatarUrl,
      null,
      'keycloak',
      keycloakUserData.sub,
      this._extractMetadata(keycloakUserData),
      existingUser.createdAt,
      new Date()
    );

    const result = await this.userRepository.update(updatedUser);
    console.log('KEYCLOAK_USER_UPDATED', { 
      userId: result.id, 
      externalId: keycloakUserData.sub 
    });

    return result;
  }

  async _createNewUser(keycloakUserData) {
    const emailCollision = await this.userRepository.findByEmailAndProvider(
      keycloakUserData.email, 
      'local'
    );
    
    if (emailCollision) {
      throw new Error('EMAIL_COLLISION');
    }

    let username = keycloakUserData.preferred_username;
    const existingUsername = await this.userRepository.findByUsername(username);
    
    if (existingUsername) {
      username = `${keycloakUserData.preferred_username}_${Date.now()}`;
    }

    const metadata = this._extractMetadata(keycloakUserData);
    metadata.firstLogin = true;

    const newUser = new User(
      null, // id будет назначен базой данных
      username,
      keycloakUserData.given_name || null,
      keycloakUserData.family_name || null,
      keycloakUserData.email,
      null, // avatarUrl - новый пользователь пока без аватара
      null, // passwordHash = null для SSO пользователей
      'keycloak',
      keycloakUserData.sub,
      this._extractMetadata(keycloakUserData),
      new Date(),
      new Date()
    );

    const result = await this.userRepository.create(newUser);
    console.log('KEYCLOAK_USER_CREATED', { 
      userId: result.id, 
      username: result.username,
      email: result.email,
      authProvider: result.authProvider,
      externalId: result.externalId
    });

    return result;
  }

  _extractMetadata(keycloakUserData) {
    return {
      given_name: keycloakUserData.given_name,
      family_name: keycloakUserData.family_name,
      name: keycloakUserData.name,
      email_verified: keycloakUserData.email_verified,
      locale: keycloakUserData.locale,
      updated_at: keycloakUserData.updated_at
    };
  }
}

module.exports = CreateOrUpdateKeycloakUserUseCase; 