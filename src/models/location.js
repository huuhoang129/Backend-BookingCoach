"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Location extends Model {
    /**
     * Associations
     */
    static associate(models) {
      this.belongsTo(models.Province, {
        foreignKey: "provinceId",
        as: "province",
        onDelete: "CASCADE",
      });

      this.hasMany(models.CoachRoute, {
        foreignKey: "fromLocationId",
        as: "routesFrom",
      });

      this.hasMany(models.CoachRoute, {
        foreignKey: "toLocationId",
        as: "routesTo",
      });
    }
  }

  Location.init(
    {
      nameLocations: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      type: {
        type: DataTypes.ENUM("stopPoint", "station"),
        defaultValue: "stopPoint",
      },
      provinceId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "Location",
      tableName: "locations",
    }
  );

  return Location;
};
