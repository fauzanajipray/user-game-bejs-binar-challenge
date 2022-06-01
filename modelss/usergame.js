'use strict';
const { Model } = require('sequelize');

const bc = require('bcrypt');
const jwt = require('jsonwebtoken');

module.exports = (sequelize, DataTypes) => {
  class UserGame extends Model {
    static associate(models) {
      //role
      this.belongsTo(models.Role, { foreignKey: "role_id" });
      this.hasOne(models.UserGameBiodata, { foreignKey: 'id', as: 'userGameBiodata' });
      this.hasMany(models.UserGameHistory, { foreignKey: 'user_id', as: 'userGameHistories' });
    }
    static #encrypt = (password) => bc.hashSync(password, 10);
    static register = async ({ username, password, role_id }) => {
      const encryptedPassword = this.#encrypt(password);
      return this.create({ username: username, password: encryptedPassword, role_id: role_id });
    };
    checkPassword = (password) => bc.compareSync(password, this.password);
    static authenticate = async (username, password) => {
      try {
        const userGame = await this.findOne({ where: { username: username }});
        if(!userGame) {
          return Promise.reject(new Error('User not found'));
        }
        if(!userGame.checkPassword(password)){
          return Promise.reject(new Error('Password is incorrect'));
        }
        return Promise.resolve(userGame);
      } catch (error) {
        return Promise.reject(error);
      }
    }
    generateToken = () => {
      const token = jwt.sign({
        id: this.id,
        username: this.username,
        role_id: this.role_id
      }, process.env.JWT_SECRET, { expiresIn: '5h' });
      return token;
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
    role_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
      defaultValue: 2
    },
  }, {
    sequelize,
    tableName: 'user_games',
    modelName: 'UserGame',
    underscored: true,
  });
  return UserGame;
};