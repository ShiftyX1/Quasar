'use strict';
const { v4: uuidv4 } = require('uuid');
const { nanoid } = require('nanoid');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const adminUser = await queryInterface.sequelize.query(
      `SELECT id FROM "Users" WHERE username = 'admin' LIMIT 1`,
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    );
    
    if (!adminUser || adminUser.length === 0) {
      console.log('Admin user not found, skipping chat room creation');
      return;
    }
    
    const adminId = adminUser[0].id;
    const now = new Date();
    
    return queryInterface.bulkInsert('ChatRooms', [
      {
        id: uuidv4(),
        name: 'General',
        accessCode: nanoid(8),
        ownerId: adminId,
        createdAt: now,
        updatedAt: now
      },
      {
        id: uuidv4(),
        name: 'Random',
        accessCode: nanoid(8),
        ownerId: adminId,
        createdAt: now,
        updatedAt: now
      }
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('ChatRooms', null, {});
  }
}; 