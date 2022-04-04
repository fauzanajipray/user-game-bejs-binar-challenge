'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class UserGameHistory extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.UserGame, { foreignKey: 'user_id', as: 'user' });
    }
  }
  UserGameHistory.init({
    score: DataTypes.INTEGER,
    time_played: DataTypes.INTEGER,
    user_id: DataTypes.INTEGER,
  }, {
    sequelize,
    tableName: 'user_game_histories',
    modelName: 'UserGameHistory',
    underscored: true,
  });
  return UserGameHistory;
};