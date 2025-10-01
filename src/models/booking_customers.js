"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class BookingCustomers extends Model {
    static associate(models) {
      this.belongsTo(models.Bookings, {
        foreignKey: "bookingId",
        as: "booking",
      });
    }
  }

  BookingCustomers.init(
    {
      bookingId: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      fullName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      phone: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "BookingCustomers",
      tableName: "booking_customers",
    }
  );

  return BookingCustomers;
};
