"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      // Một User (Staff/Driver) có 1 StaffDetail
      User.hasOne(models.StaffDetail, {
        foreignKey: "userId",
        as: "staffDetail", // 👈 alias này phải dùng khi include
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
        unique: true, // 👈 đảm bảo không trùng mã
      },
    },
    {
      sequelize,
      modelName: "User",
    }
  );
  return User;
};
