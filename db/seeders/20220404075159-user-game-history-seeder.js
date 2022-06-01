'use strict';

const { faker } = require('@faker-js/faker');

module.exports = {
  async up (queryInterface, Sequelize) {
    // For now, seeder just for insert data if table is empty or never used 
    
    const data = [];
    for (let i = 1; i <= 15; i++) {
      let score = faker.datatype.number({ min: 0, max: 100 });
      let user_id = faker.datatype.number({ min: 1, max: 5 });
      let time_played_minutes_random = faker.datatype.number({ min: 10, max: 60 });
      let time_played_in_milliseconds = time_played_minutes_random * 60 * 1000;
      let date_now = new Date(Date.now() + i * 60000);
      data.push({
        score: score,
        time_played: time_played_in_milliseconds,
        user_id: user_id,
        created_at: date_now,
        updated_at: date_now,
      })
    }
    console.log(data);
    await queryInterface.bulkInsert('user_game_histories', data, {});
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
