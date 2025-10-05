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

      this.belongsTo(models.CoachTrip, {
        foreignKey: "tripId",
        as: "trip",
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
      tripId: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      price: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM("HOLD", "SOLD", "CANCELLED"),
        allowNull: false,
        defaultValue: "HOLD",
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
