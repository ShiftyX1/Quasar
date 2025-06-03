/**
 * Интерфейс для хранения OAuth state
 */
class IStateStorageService {
  /**
   * Сохраняет state с данными
   * @param {string} state - Уникальный state
   * @param {object} data - Данные для сохранения
   * @param {number} ttlSeconds - Время жизни в секундах
   * @returns {Promise<void>}
   */
  async store(state, data, ttlSeconds) {
    throw new Error('Method must be implemented');
  }

  /**
   * Получает данные по state
   * @param {string} state - State для поиска
   * @returns {Promise<object|null>} Сохраненные данные или null
   */
  async retrieve(state) {
    throw new Error('Method must be implemented');
  }

  /**
   * Удаляет state (one-time use)
   * @param {string} state - State для удаления
   * @returns {Promise<boolean>} Успешность удаления
   */
  async delete(state) {
    throw new Error('Method must be implemented');
  }

  /**
   * Проверяет доступность хранилища
   * @returns {Promise<boolean>}
   */
  async isAvailable() {
    throw new Error('Method must be implemented');
  }
}

module.exports = IStateStorageService; 