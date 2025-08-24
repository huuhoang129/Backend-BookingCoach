"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class SeatTicket extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ Seats, Ticket }) {
      this.belongsTo(Ticket, {
        foreignKey: "ticketId",
        as: "ticketSeatId",
        onDelete: "cascade",
      });
      this.belongsTo(Seats, {
        foreignKey: "seatId",
        as: "seatofticket",
        onDelete: "cascade",
      });
    }
  }
  SeatTicket.init(
    {
      ticketId: DataTypes.INTEGER,
      seatId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "SeatTicket",
    }
  );
  return SeatTicket;
};
