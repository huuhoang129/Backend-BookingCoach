"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class CoachSchedule extends Model {
    static associate(models) {
      // mỗi lịch trình thuộc về 1 tuyến
      this.belongsTo(models.CoachRoute, {
        foreignKey: "coachRouteId",
        as: "route",
        onDelete: "CASCADE",
      });

      // mỗi lịch trình gắn với 1 xe
      this.belongsTo(models.Vehicle, {
        foreignKey: "vehicleId",
        as: "vehicle",
        onDelete: "CASCADE",
      });

      // mỗi lịch trình gắn với 1 giá vé
      this.belongsTo(models.TripPrices, {
        foreignKey: "tripPriceId",
        as: "price",
        onDelete: "CASCADE",
      });
    }
  }

  CoachSchedule.init(
    {
      coachRouteId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      vehicleId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      tripPriceId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      startTime: {
        type: DataTypes.TIME,
        allowNull: false,
      },
      frequency: {
        type: DataTypes.ENUM("DAILY", "WEEKLY"),
        allowNull: false,
        defaultValue: "DAILY",
      },
      daysOfWeek: {
        type: DataTypes.STRING, // ví dụ: "1,3,5" => chạy thứ 2-4-6
        allowNull: true,
      },

      totalTime: {
        // ✅ thêm trường mới
        type: DataTypes.TIME, // tính bằng phút (hoặc giờ tuỳ bạn)
        allowNull: true,
      },
      status: {
        type: DataTypes.ENUM("ACTIVE", "INACTIVE"),
        defaultValue: "ACTIVE",
      },
    },
    {
      sequelize,
      modelName: "CoachSchedule",
      tableName: "coach_schedules",
    }
  );

  return CoachSchedule;
};
