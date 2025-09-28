"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Vehicle extends Model {
    static associate(models) {
      this.hasMany(models.CoachTrip, {
        foreignKey: "vehicleId",
        as: "trips",
        onDelete: "CASCADE",
      });
    }
  }

  Vehicle.init(
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      licensePlate: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: true,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      type: {
        type: DataTypes.ENUM("Normal", "Sleeper", "DoubleSleeper", "Limousine"),
        allowNull: false,
      },
      numberFloors: {
        type: DataTypes.INTEGER,
        defaultValue: 1,
      },
      seatCount: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "Vehicle",
      tableName: "vehicles",
    }
  );

  return Vehicle;
};
