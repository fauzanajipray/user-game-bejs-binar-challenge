'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class UserGame extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.hasOne(models.UserGameBiodata, { foreignKey: 'id', as: 'userGameBiodata' });
      this.hasMany(models.UserGameHistory, { foreignKey: 'user_id', as: 'userGameHistories' });
    }
  }
  UserGame.init({
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      }
    }
  }, {
    sequelize,
    tableName: 'user_games',
    modelName: 'UserGame',
    underscored: true,
  });
  return UserGame;
};