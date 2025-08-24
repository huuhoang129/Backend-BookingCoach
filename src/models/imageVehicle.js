"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class ImageVehicle extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ Vehicles }) {
      this.belongsTo(Vehicles, {
        foreignKey: "vehicleId",
        as: "vehicleOfImage",
        onDelete: "cascade",
      });
    }
  }
  ImageVehicle.init(
    {
      link: DataTypes.STRING,
      vehicleId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "ImageVehicle",
    }
  );
  return ImageVehicle;
};
