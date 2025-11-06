"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class VehicleStatus extends Model {
    static associate(models) {
      this.belongsTo(models.Vehicle, {
        foreignKey: "vehicleId",
        as: "vehicle",
      });
    }
  }

  VehicleStatus.init(
    {
      vehicleId: DataTypes.INTEGER,
      status: DataTypes.ENUM("GOOD", "NEEDS_MAINTENANCE", "IN_REPAIR"),
      note: DataTypes.TEXT,
    },
    {
      sequelize,
      modelName: "VehicleStatus",
      tableName: "vehicle_status",
    }
  );
  return VehicleStatus;
};
