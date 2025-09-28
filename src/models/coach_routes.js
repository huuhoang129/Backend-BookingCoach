"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class CoachRoute extends Model {
    static associate(models) {
      this.hasMany(models.CoachTrip, {
        foreignKey: "coachRouteId",
        as: "trips",
        onDelete: "CASCADE",
      });

      this.belongsTo(models.Location, {
        foreignKey: "fromLocationId",
        as: "fromLocation",
        onDelete: "CASCADE",
      });

      this.belongsTo(models.Location, {
        foreignKey: "toLocationId",
        as: "toLocation",
        onDelete: "CASCADE",
      });
    }
  }

  CoachRoute.init(
    {
      imageRouteCoach: {
        type: DataTypes.BLOB("long"),
        allowNull: true,
      },
      fromLocationId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      toLocationId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "CoachRoute",
      tableName: "coach_routes",
    }
  );

  return CoachRoute;
};
