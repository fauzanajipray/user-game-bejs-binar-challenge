'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Role extends Model {

    static associate(models) {
      this.hasMany(models.UserGame, { foreignKey: 'role_id', as: 'userGames' });
    }
  }
  Role.init({
    name: DataTypes.STRING,
    description: DataTypes.STRING
  }, {
    sequelize,
    tableName: 'roles',
    modelName: 'Role',
  });
  return Role;
};