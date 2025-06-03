const redis = require('redis');
const IStateStorageService = require('../../domain/interfaces/IStateStorageService');

/**
 * Реализация сервиса хранения OAuth state в Redis
 */
class StateStorageService extends IStateStorageService {
  constructor(config) {
    super();
    this.config = config;
    this.client = null;
    this.keyPrefix = 'keycloak:state:';
  }

  /**
   * Инициализация соединения с Redis
   */
  async _initConnection() {
    if (this.client && this.client.isOpen) {
      return;
    }

    try {
      this.client = redis.createClient({
        host: this.config.host,
        port: this.config.port,
        password: this.config.password,
        db: this.config.db,
        retry_strategy: (options) => {
          if (options.error && options.error.code === 'ECONNREFUSED') {
            console.error('Redis connection refused');
            return new Error('Redis connection refused');
          }
          if (options.total_retry_time > 1000 * 60 * 60) {
            console.error('Redis retry time exhausted');
            return new Error('Retry time exhausted');
          }
          if (options.attempt > 10) {
            console.error('Redis retry attempts exhausted');
            return undefined;
          }
          return Math.min(options.attempt * 100, 3000);
        }
      });

      await this.client.connect();
      console.log('✅ Redis connected successfully');
    } catch (error) {
      console.error('❌ Redis connection failed:', error.message);
      throw error;
    }
  }

  /**
   * Проверяет доступность хранилища
   * @returns {Promise<boolean>}
   */
  async isAvailable() {
    try {
      await this._initConnection();
      await this.client.ping();
      return true;
    } catch (error) {
      console.error('Redis availability check failed:', error.message);
      return false;
    }
  }

  /**
   * Сохраняет state с данными
   * @param {string} state - Уникальный state
   * @param {object} data - Данные для сохранения
   * @param {number} ttlSeconds - Время жизни в секундах
   * @returns {Promise<void>}
   */
  async store(state, data, ttlSeconds) {
    try {
      await this._initConnection();
      const key = this.keyPrefix + state;
      const value = JSON.stringify({
        ...data,
        createdAt: Date.now()
      });

      await this.client.setEx(key, ttlSeconds, value);
      console.log(`State stored: ${state} (TTL: ${ttlSeconds}s)`);
    } catch (error) {
      console.error('Failed to store state:', error.message);
      throw new Error('State storage failed');
    }
  }

  /**
   * Получает данные по state
   * @param {string} state - State для поиска
   * @returns {Promise<object|null>} Сохраненные данные или null
   */
  async retrieve(state) {
    try {
      await this._initConnection();
      const key = this.keyPrefix + state;
      const value = await this.client.get(key);

      if (!value) {
        console.log(`State not found: ${state}`);
        return null;
      }

      const data = JSON.parse(value);
      console.log(`State retrieved: ${state}`);
      return data;
    } catch (error) {
      console.error('Failed to retrieve state:', error.message);
      return null;
    }
  }

  /**
   * Удаляет state (one-time use)
   * @param {string} state - State для удаления
   * @returns {Promise<boolean>} Успешность удаления
   */
  async delete(state) {
    try {
      await this._initConnection();
      const key = this.keyPrefix + state;
      const result = await this.client.del(key);
      
      const deleted = result > 0;
      console.log(`State deletion ${deleted ? 'successful' : 'failed'}: ${state}`);
      return deleted;
    } catch (error) {
      console.error('Failed to delete state:', error.message);
      return false;
    }
  }

  /**
   * Закрывает соединение с Redis
   */
  async disconnect() {
    if (this.client && this.client.isOpen) {
      await this.client.disconnect();
      console.log('Redis disconnected');
    }
  }
}

module.exports = StateStorageService; 