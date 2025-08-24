"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class TripPassenger extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({
      Ticket,
      Trip,
      PassengerCarCompany,
      Vehicles,
      TimePoint,
    }) {
      this.hasMany(Ticket, {
        foreignKey: "tripPassengerId",
        as: "tripPassengerTicket",
        onDelete: "cascade",
      });
      this.belongsTo(Trip, { foreignKey: "tripId", as: "trip" });
      this.belongsTo(PassengerCarCompany, {
        foreignKey: "passengerId",
        as: "passenger",
        onDelete: "cascade",
      });
      this.belongsTo(Vehicles, {
        foreignKey: "vehicleId",
        as: "vehicle",
        onDelete: "cascade",
      });
      this.hasMany(TimePoint, {
        foreignKey: "tripPassengerId",
        as: "tripTimePoint",
        onDelete: "cascade",
      });
    }
  }
  TripPassenger.init(
    {
      tripId: DataTypes.INTEGER,
      passengerId: DataTypes.INTEGER,
      startTime: DataTypes.TIME,
      endTime: DataTypes.TIME,
      status: DataTypes.STRING,
      vehicleId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "TripPassenger",
    }
  );
  return TripPassenger;
};
