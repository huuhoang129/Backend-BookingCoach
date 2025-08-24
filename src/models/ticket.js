"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Ticket extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ User, TripPassenger, PointTicket, SeatTicket }) {
      this.belongsTo(User, {
        foreignKey: "userId",
        as: "user",
        onDelete: "cascade",
      });
      this.belongsTo(TripPassenger, {
        foreignKey: "tripPassengerId",
        as: "tripPassengerTicket",
        onDelete: "cascade",
      });
      this.hasMany(PointTicket, {
        foreignKey: "ticketId",
        as: "ticketPointId",
        onDelete: "cascade",
      });
      this.hasMany(SeatTicket, {
        foreignKey: "ticketId",
        as: "ticketSeatId",
        onDelete: "cascade",
      });
    }
  }
  Ticket.init(
    {
      note: DataTypes.STRING,
      status: DataTypes.STRING,
      totalAmount: DataTypes.FLOAT,
      userId: DataTypes.INTEGER,
      tripPassengerId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Ticket",
    }
  );
  return Ticket;
};
