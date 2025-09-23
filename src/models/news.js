"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class News extends Model {
    static associate(models) {
      News.hasMany(models.News_Details, {
        foreignKey: "newsId",
        as: "details",
        onDelete: "CASCADE",
      });
      News.belongsTo(models.User, {
        foreignKey: "authorId",
        as: "author",
      });
    }
  }

  News.init(
    {
      title: DataTypes.STRING,
      thumbnail: DataTypes.TEXT,
      authorId: DataTypes.INTEGER,
      status: {
        type: DataTypes.ENUM("Draft", "Published", "Archived"),
        defaultValue: "Draft",
      },
      newsType: {
        type: DataTypes.ENUM("News", "Featured", "Recruitment", "Service"),
        defaultValue: "News",
      },
    },
    {
      sequelize,
      modelName: "News",
      tableName: "News",
    }
  );

  return News;
};
