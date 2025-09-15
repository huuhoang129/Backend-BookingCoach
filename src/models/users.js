"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {}
  }
  User.init(
    {
      email: DataTypes.STRING,
      password: DataTypes.STRING,
      firstName: DataTypes.STRING,
      lastName: DataTypes.STRING,
      phoneNumber: DataTypes.STRING,
      role: DataTypes.ENUM("Admin", "Staff", "Driver", "Client"),
      status: DataTypes.ENUM("Active", "Looking"),
    },
    {
      sequelize,
      modelName: "User",
    }
  );
  return User;
};
