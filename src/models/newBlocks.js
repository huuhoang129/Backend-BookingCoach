"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class NewsBlock extends Model {
    static associate(models) {
      NewsBlock.belongsTo(models.News, { foreignKey: "newsId", as: "news" });
    }
  }
  NewsBlock.init(
    {
      newsId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      blockType: {
        type: DataTypes.ENUM("text", "image"),
        allowNull: false,
      },
      content: {
        type: DataTypes.TEXT,
      },
      image: {
        type: DataTypes.BLOB("long"),
      },
      position: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "NewsBlock",
    }
  );
  return NewsBlock;
};
