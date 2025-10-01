"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class BookingSeats extends Model {
    static associate(models) {
      this.belongsTo(models.Bookings, {
        foreignKey: "bookingId",
        as: "booking",
      });

      this.belongsTo(models.Seat, {
        foreignKey: "seatId",
        as: "seat",
      });
    }
  }

  BookingSeats.init(
    {
      bookingId: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      seatId: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      price: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "BookingSeats",
      tableName: "booking_seats",
    }
  );

  return BookingSeats;
};
