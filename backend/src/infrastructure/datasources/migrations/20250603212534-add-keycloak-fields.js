'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    // Добавление новых полей для поддержки Keycloak
    await queryInterface.addColumn('Users', 'authProvider', {
      type: Sequelize.STRING(20),
      allowNull: false,
      defaultValue: 'local',
      comment: 'Authentication provider: local or keycloak'
    });

    await queryInterface.addColumn('Users', 'externalId', {
      type: Sequelize.STRING(255),
      allowNull: true,
      comment: 'External system user ID (e.g., Keycloak sub)'
    });

    await queryInterface.addColumn('Users', 'metadata', {
      type: Sequelize.JSON,
      allowNull: true,
      comment: 'Additional user data from SSO provider'
    });

    // Изменение passwordHash на nullable для SSO пользователей
    await queryInterface.changeColumn('Users', 'passwordHash', {
      type: Sequelize.STRING(255),
      allowNull: true,
      comment: 'Nullable for SSO users'
    });

    // Создание индексов для производительности
    await queryInterface.addIndex('Users', ['externalId'], {
      name: 'idx_users_external_id'
    });

    await queryInterface.addIndex('Users', ['authProvider'], {
      name: 'idx_users_auth_provider'
    });

    await queryInterface.addIndex('Users', ['email', 'authProvider'], {
      name: 'idx_users_email_auth_provider',
      unique: true
    });

    // Установка authProvider для существующих пользователей
    await queryInterface.sequelize.query(
      "UPDATE \"Users\" SET \"authProvider\" = 'local' WHERE \"authProvider\" IS NULL;"
    );
  },

  async down (queryInterface, Sequelize) {
    // Удаление индексов
    await queryInterface.removeIndex('Users', 'idx_users_email_auth_provider');
    await queryInterface.removeIndex('Users', 'idx_users_auth_provider');
    await queryInterface.removeIndex('Users', 'idx_users_external_id');

    // Возврат passwordHash к NOT NULL (осторожно с данными!)
    await queryInterface.changeColumn('Users', 'passwordHash', {
      type: Sequelize.STRING(255),
      allowNull: false
    });

    // Удаление добавленных полей
    await queryInterface.removeColumn('Users', 'metadata');
    await queryInterface.removeColumn('Users', 'externalId');
    await queryInterface.removeColumn('Users', 'authProvider');
  }
};
