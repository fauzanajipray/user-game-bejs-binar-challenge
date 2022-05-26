'use strict';
const { faker } = require('@faker-js/faker')

const bc = require('bcrypt')
module.exports = {
  async up (queryInterface, Sequelize) {
    // For now, seeder just for insert data if table is empty or never used
    
    const data = [];
    for (let i = 0; i < 5; i++) {
      let username = faker.internet.userName();
      let password = bc.hashSync('12345678', 10);
      let date_now = new Date(Date.now() + i * 60000);
      data.push({
        username: username,
        password: password,
        role_id: 2,
        created_at: date_now,
        updated_at: date_now,
      })
    }
    const data2 = await queryInterface.bulkInsert('user_games', data, {});
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
