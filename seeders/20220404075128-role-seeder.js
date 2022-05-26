'use strict';
const { faker } = require('@faker-js/faker')

const bc = require('bcrypt')
module.exports = {
  async up (queryInterface, Sequelize) {
    // For now, seeder just for insert data if table is empty or never used
    
    const dataRoles = [
      {
        name: 'admin',
        description: 'Admin role',
        created_at: new Date(Date.now()),
        updated_at: new Date(Date.now()),
      },
      {
        name: 'user',
        description: 'User role',
        created_at: new Date(Date.now()),
        updated_at: new Date(Date.now()),
      },
    ]

    await queryInterface.bulkInsert('roles', dataRoles, {});
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
