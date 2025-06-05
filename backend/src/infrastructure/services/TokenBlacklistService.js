const redis = require('redis');

/**
 * Сервис для управления черным списком JWT токенов
 */
class TokenBlacklistService {
  constructor(config) {
    this.config = config;
    this.client = null;
    this.keyPrefix = 'blacklist:token:';
  }

  async connect() {
    if (!this.client) {
      try {
        this.client = redis.createClient({
          host: this.config.host,
          port: this.config.port,
          password: this.config.password,
          db: this.config.db
        });

        this.client.on('error', (err) => {
          console.error('Redis TokenBlacklist error:', err);
        });

        await this.client.connect();
        console.log('✅ TokenBlacklist Redis connected');
      } catch (error) {
        console.error('Failed to connect to TokenBlacklist Redis:', error.message);
        throw error;
      }
    }
  }

  async disconnect() {
    if (this.client) {
      await this.client.disconnect();
      this.client = null;
    }
  }

  /**
   * Добавляет токен в черный список
   * @param {string} token - JWT токен
   * @param {number} expiresIn - время жизни токена в секундах
   */
  async blacklistToken(token, expiresIn) {
    try {
      await this.connect();
      
      const key = `${this.keyPrefix}${token}`;
      await this.client.setEx(key, expiresIn, 'blacklisted');
      
      console.log('Token blacklisted:', { token: token.substring(0, 20) + '...', expiresIn });
    } catch (error) {
      console.error('Failed to blacklist token:', error.message);
      // Не бросаем ошибку, чтобы logout все равно работал
    }
  }

  /**
   * Проверяет, находится ли токен в черном списке
   * @param {string} token - JWT токен
   * @returns {Promise<boolean>}
   */
  async isTokenBlacklisted(token) {
    try {
      await this.connect();
      
      const key = `${this.keyPrefix}${token}`;
      const result = await this.client.get(key);
      
      return result === 'blacklisted';
    } catch (error) {
      console.error('Failed to check token blacklist:', error.message);
      // В случае ошибки Redis, считаем токен НЕ заблокированным
      return false;
    }
  }

  /**
   * Проверяет доступность Redis
   * @returns {Promise<boolean>}
   */
  async isAvailable() {
    try {
      await this.connect();
      await this.client.ping();
      return true;
    } catch (error) {
      return false;
    }
  }
}

module.exports = TokenBlacklistService; 