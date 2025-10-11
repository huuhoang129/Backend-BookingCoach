"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class DriverSchedule extends Model {
    static associate(models) {
      DriverSchedule.belongsTo(models.User, {
        foreignKey: "userId",
        as: "driver",
      });

      DriverSchedule.belongsTo(models.CoachTrip, {
        foreignKey: "coachTripId",
        as: "trip",
      });
    }
  }

  DriverSchedule.init(
    {
      userId: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      coachTripId: {
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
      modelName: "DriverSchedule",
      tableName: "driver_schedule",
    }
  );

  return DriverSchedule;
};
