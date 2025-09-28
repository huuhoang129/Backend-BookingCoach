"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Province extends Model {
    /**
     * Associations
     */
    static associate(models) {
      this.hasMany(models.Location, {
        foreignKey: "provinceId",
        as: "locations",
        onDelete: "CASCADE",
      });
    }
  }

  Province.init(
    {
      nameProvince: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      valueProvince: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "Province",
      tableName: "provinces",
    }
  );

  return Province;
};
