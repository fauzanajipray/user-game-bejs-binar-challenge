'use strict';
const { faker } = require('@faker-js/faker')

module.exports = {
  async up (queryInterface, Sequelize) {
    // For now, seeder just for insert data if table is empty or never used
    
    const data = [];
    for (let i = 0; i < 5; i++) {
      let username = faker.internet.userName();
      let password = faker.internet.password();
      let date_now = new Date(Date.now() + i * 60000);
      data.push({
        username: username,
        password: password,
        created_at: date_now,
        updated_at: date_now,
      })
    }
    console.log(data);
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
