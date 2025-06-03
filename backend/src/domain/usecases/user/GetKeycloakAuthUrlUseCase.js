const crypto = require('crypto');

/**
 * Use Case для генерации URL авторизации Keycloak
 */
class GetKeycloakAuthUrlUseCase {
  constructor(keycloakService, stateStorageService, settings) {
    this.keycloakService = keycloakService;
    this.stateStorageService = stateStorageService;
    this.settings = settings;
  }

  async execute(redirectUrl = null) {
    // 1. Проверка, что Keycloak включен
    if (!this.settings.isKeycloakEnabled) {
      throw new Error('KEYCLOAK_DISABLED');
    }

    // 2. Проверка доступности Keycloak
    const isKeycloakAvailable = await this.keycloakService.isAvailable();
    if (!isKeycloakAvailable) {
      throw new Error('KEYCLOAK_UNAVAILABLE');
    }

    // 3. Проверка доступности Redis (если Keycloak включен)
    const isRedisAvailable = await this.stateStorageService.isAvailable();
    if (!isRedisAvailable) {
      throw new Error('STATE_STORAGE_UNAVAILABLE');
    }

    try {
      // 4. Генерация cryptographically strong state
      const state = crypto.randomUUID();

      // 5. Сохранение state в Redis с TTL 600 секунд
      const stateData = {
        redirectUrl: redirectUrl || this.settings.clientUrl,
        createdAt: Date.now()
      };
      
      await this.stateStorageService.store(state, stateData, 600);

      // 6. Генерация URL авторизации
      const authUrl = this.keycloakService.generateAuthUrl(
        state, 
        this.settings.keycloak.redirectUri
      );

      console.log('KEYCLOAK_AUTH_INITIATED', { state, redirectUrl });

      return {
        authUrl,
        state
      };
    } catch (error) {
      console.error('Get Keycloak auth URL error:', error.message);
      throw new Error('AUTH_URL_GENERATION_FAILED');
    }
  }
}

module.exports = GetKeycloakAuthUrlUseCase; 