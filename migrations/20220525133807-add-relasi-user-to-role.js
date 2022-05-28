'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.addColumn('user_games', 'role_id', {
      type: Sequelize.INTEGER,
      references: {
        model: 'roles',
        key: 'id'
      },
      allowNull: false,
      onDelete: 'SET NULL'
    });

  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.removeColumn('user_games', 'role_id');
    
  }
};
