"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class PasswordReset extends Model {
    static associate(models) {
      // Mỗi token thuộc về 1 user
      PasswordReset.belongsTo(models.User, {
        foreignKey: "userId",
        as: "user",
        onDelete: "CASCADE",
      });
    }
  }

  PasswordReset.init(
    {
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      otp: {
        type: DataTypes.STRING(6),
        allowNull: false,
      },
      expires: {
        type: DataTypes.BIGINT,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "PasswordReset",
      tableName: "password_reset",
    }
  );

  return PasswordReset;
};
