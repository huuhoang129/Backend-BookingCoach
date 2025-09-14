"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class News extends Model {
    static associate(models) {
      News.belongsTo(models.User, { foreignKey: "authorId", as: "author" });
      News.hasMany(models.NewsBlock, { foreignKey: "newsId", as: "blocks" });
    }
  }
  News.init(
    {
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      thumbnail: {
        type: DataTypes.STRING, // đường dẫn ảnh đại diện
      },
      status: {
        type: DataTypes.ENUM("draft", "published"),
        defaultValue: "draft",
      },
      authorId: {
        type: DataTypes.INTEGER,
        field: "authorId",
      },
    },
    {
      sequelize,
      modelName: "News",
    }
  );
  return News;
};
