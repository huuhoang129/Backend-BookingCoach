"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class TimePoint extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ TripPassenger, Point, PointTicket }) {
      this.belongsTo(Point, {
        foreignKey: "pointId",
        as: "point",
        onDelete: "cascade",
      });
      this.belongsTo(TripPassenger, {
        foreignKey: "tripPassengerId",
        as: "tripTimePoint",
        onDelete: "cascade",
      });
      this.hasMany(PointTicket, {
        foreignKey: "timepointId",
        as: "timepointTicket",
        onDelete: "cascade",
      });
    }
  }
  TimePoint.init(
    {
      time: DataTypes.TIME,
      type: DataTypes.STRING,
      pointId: DataTypes.INTEGER,
      tripPassengerId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "TimePoint",
    }
  );
  return TimePoint;
};
