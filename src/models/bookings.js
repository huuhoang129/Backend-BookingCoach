"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Bookings extends Model {
    static associate(models) {
      this.belongsTo(models.User, {
        foreignKey: "userId",
        as: "user",
      });

      this.belongsTo(models.CoachTrip, {
        foreignKey: "coachTripId",
        as: "trip",
      });

      this.hasMany(models.BookingSeats, {
        foreignKey: "bookingId",
        as: "seats",
      });

      this.hasMany(models.BookingCustomers, {
        foreignKey: "bookingId",
        as: "customers",
      });

      this.hasMany(models.BookingPoints, {
        foreignKey: "bookingId",
        as: "points",
      });

      this.hasMany(models.BookingPayments, {
        foreignKey: "bookingId",
        as: "payment",
      });
    }
  }

  Bookings.init(
    {
      bookingCode: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      userId: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      coachTripId: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM("PENDING", "CONFIRMED", "CANCELLED", "EXPIRED"),
        defaultValue: "PENDING",
      },
      totalAmount: {
        type: DataTypes.DECIMAL(12, 0),
        allowNull: false,
      },
      expiredAt: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "Bookings",
      tableName: "bookings",
    }
  );

  return Bookings;
};
