"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Seats extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ Vehicles, SeatTicket }) {
      this.belongsTo(Vehicles, {
        foreignKey: "vehicleId",
        as: "seatVehicle",
        onDelete: "cascade",
      });
      this.hasMany(SeatTicket, {
        foreignKey: "seatId",
        as: "seatofticket",
        onDelete: "cascade",
      });
    }
  }
  Seats.init(
    {
      name: DataTypes.STRING,
      status: DataTypes.STRING,
      floor: DataTypes.INTEGER,
      type: DataTypes.STRING,
      price: DataTypes.FLOAT,
      vehicleId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Seats",
    }
  );
  return Seats;
};
