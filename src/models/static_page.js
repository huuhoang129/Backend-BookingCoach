"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class StaticPage extends Model {
    static associate(models) {}
  }

  StaticPage.init(
    {
      pageKey: DataTypes.STRING,
      blockType: DataTypes.ENUM("text", "image"),
      content: DataTypes.TEXT,
      imageUrl: DataTypes.STRING,
      sortOrder: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "StaticPage",
      tableName: "static_page",
    }
  );

  return StaticPage;
};
