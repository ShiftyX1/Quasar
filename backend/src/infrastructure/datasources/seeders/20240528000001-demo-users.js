'use strict';
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const passwordHash = await bcrypt.hash('password123', 10);
    const now = new Date();
    
    return queryInterface.bulkInsert('Users', [
      {
        id: uuidv4(),
        username: 'admin',
        email: 'admin@example.com',
        passwordHash,
        createdAt: now,
        updatedAt: now
      },
      {
        id: uuidv4(),
        username: 'user1',
        email: 'user1@example.com',
        passwordHash,
        createdAt: now,
        updatedAt: now
      },
      {
        id: uuidv4(),
        username: 'user2',
        email: 'user2@example.com',
        passwordHash,
        createdAt: now,
        updatedAt: now
      }
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Users', null, {});
  }
}; 