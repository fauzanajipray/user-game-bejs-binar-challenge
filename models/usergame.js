'use strict';
const { Model } = require('sequelize');

const bc = require('bcrypt');

module.exports = (sequelize, DataTypes) => {
  class UserGame extends Model {
    static associate(models) {
      this.hasOne(models.UserGameBiodata, { foreignKey: 'id', as: 'userGameBiodata' });
      this.hasMany(models.UserGameHistory, { foreignKey: 'user_id', as: 'userGameHistories' });
    }

    static #encrypt = (password) => bc.hashSync(password, 10);
    static register = async ({ username, password }) => {
      const encryptedPassword = this.#encrypt(password);
      return this.create({ username: username, password: encryptedPassword });
    };
    checkPassword = (password) => bc.compareSync(password, this.password);
    static authenticate = async (username, password) => {
      try {
        const userGame = await this.findOne({ where: { username: username }});
        // console.log('userGame', userGame);
        if(!userGame) return Promise.reject('User not found')
        if(!userGame.checkPassword(password)) return Promise.reject('Wrong password');
        return Promise.resolve(userGame);
      } catch (error) {
        return Promise.reject(error);
      }
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
    },
    role: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      }
    },
  }, {
    sequelize,
    tableName: 'user_games',
    modelName: 'UserGame',
    underscored: true,
  });
  return UserGame;
};