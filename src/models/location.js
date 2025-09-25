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
