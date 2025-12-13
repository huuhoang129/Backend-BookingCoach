"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class BookingCancellation extends Model {
    static associate(models) {
      BookingCancellation.belongsTo(models.User, {
        foreignKey: "userId",
        as: "user",
      });

      BookingCancellation.belongsTo(models.Bookings, {
        foreignKey: "bookingCode",
        targetKey: "bookingCode",
        as: "booking",
      });
    }
  }

  BookingCancellation.init(
    {
      bookingCode: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      title: DataTypes.STRING,
      reason: DataTypes.TEXT,

      refundMethod: {
        type: DataTypes.ENUM("CASH", "BANK"),
        defaultValue: "CASH",
      },

      bankName: {
        type: DataTypes.STRING,
        allowNull: true,
      },

      bankNumber: {
        type: DataTypes.STRING,
        allowNull: true,
      },

      status: {
        type: DataTypes.ENUM("WAITING", "APPROVED", "REJECTED"),
        defaultValue: "WAITING",
      },

      adminNote: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "BookingCancellation",
      tableName: "booking_cancellation",
    }
  );

  return BookingCancellation;
};
