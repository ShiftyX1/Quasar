const User = require('../../entities/User');

/**
 * Use Case для создания или обновления пользователя из Keycloak данных
 */
class CreateOrUpdateKeycloakUserUseCase {
  constructor(userRepository) {
    this.userRepository = userRepository;
  }

  async execute(keycloakUserData) {
    // 1. Валидация входных данных
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
      // 2. Поиск существующего пользователя по external_id (Keycloak sub)
      let existingUser = await this.userRepository.findByExternalId(keycloakUserData.sub);

      if (existingUser) {
        // 3. Обновление существующего пользователя
        return await this._updateExistingUser(existingUser, keycloakUserData);
      } else {
        // 4. Создание нового пользователя
        return await this._createNewUser(keycloakUserData);
      }
    } catch (error) {
      console.error('Create/Update Keycloak user error:', error.message);
      throw error;
    }
  }

  async _updateExistingUser(existingUser, keycloakUserData) {
    // Обновляем только если данные изменились
    const needsUpdate = 
      existingUser.username !== keycloakUserData.preferred_username ||
      existingUser.email !== keycloakUserData.email ||
      JSON.stringify(existingUser.metadata) !== JSON.stringify(this._extractMetadata(keycloakUserData));

    if (!needsUpdate) {
      console.log('User data unchanged, skipping update');
      return existingUser;
    }

    // Проверка на коллизию email с другими пользователями
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
      keycloakUserData.email,
      null, // passwordHash остается null для SSO пользователей
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
    // Проверка на коллизию email с локальными пользователями
    const emailCollision = await this.userRepository.findByEmailAndProvider(
      keycloakUserData.email, 
      'local'
    );
    
    if (emailCollision) {
      throw new Error('EMAIL_COLLISION');
    }

    // Проверка уникальности username
    let username = keycloakUserData.preferred_username;
    const existingUsername = await this.userRepository.findByUsername(username);
    
    if (existingUsername) {
      // Генерируем уникальное имя пользователя
      username = `${keycloakUserData.preferred_username}_${Date.now()}`;
    }

    const newUser = new User(
      null, // id будет назначен базой данных
      username,
      keycloakUserData.email,
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