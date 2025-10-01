"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class BookingPayments extends Model {
    static associate(models) {
      this.belongsTo(models.Bookings, {
        foreignKey: "bookingId",
        as: "booking",
      });
    }
  }

  BookingPayments.init(
    {
      bookingId: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      method: {
        type: DataTypes.ENUM("CASH", "BANKING", "VNPAY"),
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM("PENDING", "SUCCESS", "FAILED"),
        defaultValue: "PENDING",
      },
      amount: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      transactionCode: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      paidAt: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "BookingPayments",
      tableName: "booking_payments",
    }
  );

  return BookingPayments;
};
