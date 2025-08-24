"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Vehicles extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ PassengerCarCompany, Seats, ImageVehicle }) {
      this.belongsTo(PassengerCarCompany, {
        foreignKey: "passengerCarId",
        as: "passengerCar",
        onDelete: "cascade",
      });
      this.hasMany(Seats, {
        foreignKey: "vehicleId",
        as: "seatVehicle",
        onDelete: "cascade",
      });
      this.hasMany(ImageVehicle, {
        foreignKey: "vehicleId",
        as: "vehicleOfImage",
        onDelete: "cascade",
      });
    }
  }
  Vehicles.init(
    {
      name: DataTypes.STRING,
      description: DataTypes.STRING,
      type: DataTypes.STRING,
      numberFloors: DataTypes.INTEGER,
      passengerCarId: DataTypes.INTEGER, //pasengerCarCompany
    },
    {
      sequelize,
      modelName: "Vehicles",
    }
  );
  return Vehicles;
};
