const jwt = require('jsonwebtoken');
const settings = require('../../../../config/settings');

/**
 * Use Case для logout пользователя с инвалидацией токена
 */
class LogoutUserUseCase {
  constructor(tokenBlacklistService, logoutWithKeycloakUseCase = null) {
    this.tokenBlacklistService = tokenBlacklistService;
    this.logoutWithKeycloakUseCase = logoutWithKeycloakUseCase;
  }

  async execute(token, user) {
    try {
      // Добавляем токен в черный список
      if (token) {
        // Декодируем токен чтобы получить время истечения
        const decoded = jwt.decode(token);
        const now = Math.floor(Date.now() / 1000);
        const expiresIn = decoded.exp - now;

        if (expiresIn > 0) {
          await this.tokenBlacklistService.blacklistToken(token, expiresIn);
        }
      }

      // Если пользователь из Keycloak, возвращаем URL для logout
      if (user?.authProvider === 'keycloak' && this.logoutWithKeycloakUseCase) {
        try {
          const keycloakResult = await this.logoutWithKeycloakUseCase.execute();
          return {
            success: true,
            keycloakLogoutUrl: keycloakResult.logoutUrl
          };
        } catch (error) {
          console.warn('Keycloak logout failed, continuing with local logout:', error.message);
        }
      }

      return {
        success: true
      };
    } catch (error) {
      console.error('Logout error:', error.message);
      // Даже если что-то пошло не так, считаем logout успешным
      return {
        success: true
      };
    }
  }
}

module.exports = LogoutUserUseCase; 