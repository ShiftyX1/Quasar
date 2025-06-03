const axios = require('axios');
const IKeycloakService = require('../../domain/interfaces/IKeycloakService');

/**
 * Реализация Keycloak сервиса
 */
class KeycloakService extends IKeycloakService {
  constructor(config) {
    super();
    this.config = config;
    this.baseUrl = `${config.serverUrl}/auth/realms/${config.realm}`;
    this.httpClient = axios.create({
      timeout: 10000, // 10 секунд таймаут
      validateStatus: (status) => status < 500 // Не считать 4xx ошибками
    });
  }

  /**
   * Проверяет доступность Keycloak сервера
   * @returns {Promise<boolean>}
   */
  async isAvailable() {
    try {
      const response = await this.httpClient.get(`https://google.com`); // just for test
      return response.status === 200;
    } catch (error) {
      console.error('Keycloak unavailable:', error.message);
      return false;
    }
  }

  /**
   * Генерирует URL для авторизации в Keycloak
   * @param {string} state - CSRF state
   * @param {string} redirectUri - URL для редиректа
   * @returns {string} Authorization URL
   */
  generateAuthUrl(state, redirectUri) {
    const params = new URLSearchParams({
      client_id: this.config.clientId,
      redirect_uri: redirectUri,
      state: state,
      response_type: 'code',
      scope: 'openid profile email'
    });

    return `${this.baseUrl}/protocol/openid-connect/auth?${params.toString()}`;
  }

  /**
   * Обменивает authorization code на access token
   * @param {string} code - Authorization code
   * @returns {Promise<object>} Token response
   */
  async exchangeCodeForToken(code) {
    try {
      const params = new URLSearchParams({
        grant_type: 'authorization_code',
        client_id: this.config.clientId,
        client_secret: this.config.clientSecret,
        code: code,
        redirect_uri: this.config.redirectUri
      });

      const response = await this.httpClient.post(
        `${this.baseUrl}/protocol/openid-connect/token`,
        params,
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }
      );

      if (response.status !== 200) {
        throw new Error(`Token exchange failed: ${response.status} ${response.statusText}`);
      }

      return response.data;
    } catch (error) {
      console.error('Token exchange error:', error.message);
      throw new Error('Failed to exchange code for token');
    }
  }

  /**
   * Получает информацию о пользователе по access token
   * @param {string} accessToken - Access token
   * @returns {Promise<object>} User info
   */
  async getUserInfo(accessToken) {
    try {
      const response = await this.httpClient.get(
        `${this.baseUrl}/protocol/openid-connect/userinfo`,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`
          }
        }
      );

      if (response.status !== 200) {
        throw new Error(`User info request failed: ${response.status} ${response.statusText}`);
      }

      return response.data;
    } catch (error) {
      console.error('Get user info error:', error.message);
      throw new Error('Failed to get user info');
    }
  }

  /**
   * Валидирует access token через introspection endpoint
   * @param {string} token - Access token
   * @returns {Promise<boolean>}
   */
  async validateToken(token) {
    try {
      const params = new URLSearchParams({
        token: token,
        client_id: this.config.clientId,
        client_secret: this.config.clientSecret
      });

      const response = await this.httpClient.post(
        `${this.baseUrl}/protocol/openid-connect/token/introspect`,
        params,
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }
      );

      if (response.status !== 200) {
        return false;
      }

      return response.data.active === true;
    } catch (error) {
      console.error('Token validation error:', error.message);
      return false;
    }
  }
}

module.exports = KeycloakService; 