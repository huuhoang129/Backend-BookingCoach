"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Seat extends Model {
    static associate(models) {
      // Mỗi seat thuộc về 1 vehicle
      this.belongsTo(models.Vehicle, {
        foreignKey: "vehicleId",
        as: "vehicle",
        onDelete: "CASCADE",
      });
    }
  }

  Seat.init(
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM("available", "selected", "sold"),
        defaultValue: "available",
      },
      floor: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      vehicleId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "Seat",
      tableName: "seats",
    }
  );

  return Seat;
};
