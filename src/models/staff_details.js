"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class StaffDetail extends Model {
    static associate(models) {
      // StaffDetail thuộc về 1 User
      StaffDetail.belongsTo(models.User, {
        foreignKey: "userId",
        as: "user",
      });
    }
  }

  StaffDetail.init(
    {
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      address: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      dateOfBirth: {
        type: DataTypes.DATEONLY,
        allowNull: true,
      },
      citizenId: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "StaffDetail",
      tableName: "staff_details", // 👈 đúng tên bảng trong MySQL
    }
  );

  return StaffDetail;
};
