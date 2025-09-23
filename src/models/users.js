"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      User.hasOne(models.StaffDetail, {
        foreignKey: "userId",
        as: "staffDetail",
      });

      User.hasMany(models.News, {
        foreignKey: "authorId",
        as: "news",
      });
    }
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
      userCode: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: true,
      },
    },
    {
      sequelize,
      modelName: "User",
    }
  );
  return User;
};
