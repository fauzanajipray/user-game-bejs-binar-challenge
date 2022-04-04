'use strict';
const { faker } = require('@faker-js/faker');

module.exports = {
  async up (queryInterface, Sequelize) {
    
    const data = [];
    for (let i = 1; i <= 5; i++) {
      let first_name = faker.name.firstName();
      let last_name = faker.name.lastName();
      let address = faker.address.streetAddress();
      let email = faker.internet.email(first_name, last_name);
      let date_now = new Date(Date.now() + i * 60000);
      data.push({
        first_name: first_name,
        last_name: last_name,
        address: address,
        email: email,
        user_id: i,
        created_at: date_now,
        updated_at: date_now,
      })
    }
    console.log(data);
    await queryInterface.bulkInsert('user_game_biodata', data, {});
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
