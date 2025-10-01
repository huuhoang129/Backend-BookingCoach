"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class BookingPoints extends Model {
    static associate(models) {
      this.belongsTo(models.Bookings, {
        foreignKey: "bookingId",
        as: "booking",
      });

      this.belongsTo(models.Location, {
        foreignKey: "locationId",
        as: "Location",
      });
    }
  }

  BookingPoints.init(
    {
      bookingId: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      type: {
        type: DataTypes.ENUM("PICKUP", "DROPOFF"),
        allowNull: false,
      },
      locationId: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      time: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      note: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "BookingPoints",
      tableName: "booking_points",
    }
  );

  return BookingPoints;
};
