/**
 * Интерфейс для взаимодействия с Keycloak
 */
class IKeycloakService {
  /**
   * Проверяет доступность Keycloak сервера
   * @returns {Promise<boolean>}
   */
  async isAvailable() {
    throw new Error('Method must be implemented');
  }

  /**
   * Генерирует URL для авторизации в Keycloak
   * @param {string} state - CSRF state
   * @param {string} redirectUri - URL для редиректа
   * @returns {string} Authorization URL
   */
  generateAuthUrl(state, redirectUri) {
    throw new Error('Method must be implemented');
  }

  /**
   * Обменивает authorization code на access token
   * @param {string} code - Authorization code
   * @returns {Promise<object>} Token response
   */
  async exchangeCodeForToken(code) {
    throw new Error('Method must be implemented');
  }

  /**
   * Получает информацию о пользователе по access token
   * @param {string} accessToken - Access token
   * @returns {Promise<object>} User info
   */
  async getUserInfo(accessToken) {
    throw new Error('Method must be implemented');
  }

  /**
   * Валидирует access token
   * @param {string} token - Access token
   * @returns {Promise<boolean>}
   */
  async validateToken(token) {
    throw new Error('Method must be implemented');
  }

  /**
   * Генерирует URL для logout в Keycloak
   * @param {string} redirectUri - URL для редиректа после logout
   * @returns {string} Logout URL
   */
  generateLogoutUrl(redirectUri) {
    throw new Error('Method must be implemented');
  }

  /**
   * Отзывает токен в Keycloak
   * @param {string} token - Access или Refresh token
   * @param {string} tokenType - 'access_token' или 'refresh_token'
   * @returns {Promise<boolean>}
   */
  async revokeToken(token, tokenType = 'access_token') {
    throw new Error('Method must be implemented');
  }
}

module.exports = IKeycloakService; 