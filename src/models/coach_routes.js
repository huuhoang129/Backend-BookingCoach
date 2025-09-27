"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class CoachRoute extends Model {
    /**
     * Associations
     */
    static associate({ Location }) {
      this.belongsTo(Location, {
        foreignKey: "fromLocationId",
        as: "fromLocation",
        onDelete: "CASCADE",
      });

      this.belongsTo(Location, {
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
