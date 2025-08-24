"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class PointTicket extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ TimePoint, Ticket }) {
      this.belongsTo(TimePoint, {
        foreignKey: "timepointId",
        as: "timepointTicket",
        onDelete: "cascade",
      });
      this.belongsTo(Ticket, {
        foreignKey: "ticketId",
        as: "ticketPointId",
        onDelete: "cascade",
      });
    }
  }
  PointTicket.init(
    {
      typePoint: DataTypes.STRING,
      timepointId: DataTypes.INTEGER,
      ticketId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "PointTicket",
    }
  );
  return PointTicket;
};
