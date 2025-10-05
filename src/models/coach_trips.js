"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class CoachTrip extends Model {
    static associate(models) {
      this.belongsTo(models.CoachRoute, {
        foreignKey: "coachRouteId",
        as: "route",
        onDelete: "CASCADE",
      });

      this.belongsTo(models.Vehicle, {
        foreignKey: "vehicleId",
        as: "vehicle",
        onDelete: "CASCADE",
      });

      this.belongsTo(models.TripPrices, {
        foreignKey: "tripPriceId",
        as: "price",
        onDelete: "CASCADE",
      });

      this.hasMany(models.BookingSeats, {
        foreignKey: "tripId",
        as: "bookingSeats",
      });
    }
  }

  CoachTrip.init(
    {
      coachRouteId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      vehicleId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      tripPriceId: {
        type: DataTypes.INTEGER,
        allowNull: false, // bắt buộc phải gắn với 1 price
      },
      startDate: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
      startTime: {
        type: DataTypes.TIME,
        allowNull: false,
      },
      totalTime: {
        type: DataTypes.TIME,
        allowNull: true,
      },
      status: {
        type: DataTypes.ENUM("OPEN", "FULL", "CANCELLED"),
        defaultValue: "OPEN",
      },
    },
    {
      sequelize,
      modelName: "CoachTrip",
      tableName: "coach_trips",
    }
  );

  return CoachTrip;
};
