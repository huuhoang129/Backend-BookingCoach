"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class TripPrices extends Model {
    static associate(models) {
      // Mỗi TripPrice gắn với 1 tuyến
      this.belongsTo(models.CoachRoute, {
        foreignKey: "coachRouteId",
        as: "route",
        onDelete: "CASCADE",
      });
    }
  }

  TripPrices.init(
    {
      coachRouteId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      seatType: {
        type: DataTypes.ENUM("SEAT", "SLEEPER", "DOUBLESLEEPER", "LIMOUSINE"),
        allowNull: false,
      },
      priceTrip: {
        type: DataTypes.DECIMAL(10, 0),
        allowNull: false,
      },
      typeTrip: {
        type: DataTypes.ENUM("NORMAL", "HOLIDAY"),
        defaultValue: "NORMAL",
      },
    },
    {
      sequelize,
      modelName: "TripPrices",
      tableName: "trip_prices",
    }
  );

  return TripPrices;
};
