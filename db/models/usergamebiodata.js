'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class UserGameBiodata extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.UserGame, { foreignKey: 'user_id', as: 'userGame' });
    }
  }
  UserGameBiodata.init({
    first_name: DataTypes.STRING,
    last_name: DataTypes.STRING,
    address: DataTypes.STRING,
    email: {
      type: DataTypes.STRING,
      validate: {
        isEmail: true,
      },
      allowNull: false,
    },
    url_photo: DataTypes.STRING,
    url_video: DataTypes.STRING,
    user_id: DataTypes.INTEGER,
  }, {
    sequelize,
    tableName: 'user_game_biodata',
    modelName: 'UserGameBiodata',
    underscored: true,
  });
  return UserGameBiodata;
};