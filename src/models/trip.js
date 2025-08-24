"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Trip extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ Station, TripPassenger }) {
      this.belongsTo(Station, {
        foreignKey: "fromStation",
        as: "from",
        onDelete: "cascade",
      });
      this.belongsTo(Station, {
        foreignKey: "toStation",
        as: "to",
        onDelete: "cascade",
      });
      this.hasMany(TripPassenger, {
        foreignKey: "tripId",
        as: "trip",
        onDelete: "cascade",
      });
    }
  }
  Trip.init(
    {
      fromStation: DataTypes.INTEGER,
      toStation: DataTypes.INTEGER,
      startTime: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: "Trip",
    }
  );
  return Trip;
};
