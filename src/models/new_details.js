"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class News_Details extends Model {
    static associate(models) {
      News_Details.belongsTo(models.News, {
        foreignKey: "newsId",
        as: "news",
      });
    }
  }

  News_Details.init(
    {
      newsId: DataTypes.INTEGER,
      blockType: DataTypes.ENUM("text", "image"),
      content: DataTypes.TEXT,
      imageUrl: DataTypes.STRING,
      sortOrder: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "News_Details",
      tableName: "News_Details",
    }
  );

  return News_Details;
};
