import db from "../../models/index.js";

let getAllNews = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let news = await db.News.findAll({
        include: [
          {
            model: db.User,
            as: "author",
            attributes: ["id", "firstName", "lastName", "email"],
          },
          {
            model: db.News_Details,
            as: "details",
            attributes: ["id", "blockType", "content", "imageUrl", "sortOrder"],
            separate: true,
            order: [["sortOrder", "ASC"]],
            limit: 1,
          },
        ],
        order: [["createdAt", "DESC"]],
        raw: false,
        nest: true,
      });

      if (news && news.length > 0) {
        news = news.map((item) => {
          if (item.thumbnail) {
            item.thumbnail = Buffer.from(item.thumbnail, "base64").toString(
              "binary"
            );
          }
          return item;
        });
      }

      resolve({
        errCode: 0,
        errMessage: "OK",
        data: news,
      });
    } catch (e) {
      reject(e);
    }
  });
};

let getNewsById = (newsId) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!newsId) {
        return resolve({
          errCode: 1,
          errMessage: "Missing parameter",
        });
      }

      let news = await db.News.findOne({
        where: { id: newsId },
        include: [
          {
            model: db.News_Details,
            as: "details",
            attributes: ["id", "blockType", "content", "imageUrl", "sortOrder"],
          },
          {
            model: db.User,
            as: "author",
            attributes: ["id", "email", "firstName", "lastName"],
          },
        ],
        order: [
          [{ model: db.News_Details, as: "details" }, "sortOrder", "ASC"],
        ],
        raw: false,
        nest: true,
      });

      if (!news) {
        return resolve({
          errCode: 2,
          errMessage: "News not found",
        });
      }

      if (news.thumbnail) {
        // Convert buffer → base64 string
        const base64Str = news.thumbnail.toString("base64");
        news.thumbnail = `data:image/png;base64,${base64Str}`;
      }

      resolve({
        errCode: 0,
        errMessage: "OK",
        data: news,
      });
    } catch (e) {
      reject(e);
    }
  });
};

let createNews = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!data.title || !data.authorId) {
        return resolve({
          errCode: 1,
          errMessage: "Missing parameter",
        });
      }

      let news = await db.News.create({
        title: data.title,
        thumbnail: data.thumbnailBase64 || null,
        authorId: data.authorId,
        status: data.status || "Draft",
        newsType: data.newsType || "News",
      });

      if (Array.isArray(data.blocks) && data.blocks.length > 0) {
        for (let i = 0; i < data.blocks.length; i++) {
          let block = data.blocks[i];
          await db.News_Details.create({
            newsId: news.id,
            blockType: block.blockType,
            content: block.content || null,
            imageUrl: block.imageUrl || null,
            sortOrder: i,
          });
        }
      }

      resolve({
        errCode: 0,
        errMessage: "OK",
        data: news,
      });
    } catch (e) {
      reject(e);
    }
  });
};

let updateNews = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!data.id) {
        return resolve({
          errCode: 1,
          errMessage: "Missing parameter: id",
        });
      }

      let news = await db.News.findOne({
        where: { id: data.id },
        raw: false,
      });

      if (!news) {
        return resolve({
          errCode: 2,
          errMessage: "News not found",
        });
      }

      news.title = data.title || news.title;
      if (data.thumbnailBase64) {
        news.thumbnail = data.thumbnailBase64;
      }
      news.status = data.status || news.status;
      news.newsType = data.newsType || news.newsType; // ✅ ok
      await news.save();

      if (Array.isArray(data.blocks)) {
        await db.News_Details.destroy({ where: { newsId: news.id } });

        for (let i = 0; i < data.blocks.length; i++) {
          let block = data.blocks[i];
          await db.News_Details.create({
            newsId: news.id,
            blockType: block.blockType,
            content: block.content || null,
            imageUrl: block.imageUrl || null,
            sortOrder: i,
          });
        }
      }

      resolve({
        errCode: 0,
        errMessage: "Update News Success",
      });
    } catch (e) {
      reject(e);
    }
  });
};

let deleteNews = (newsId) => {
  return new Promise(async (resolve, reject) => {
    try {
      let foundNews = await db.News.findOne({ where: { id: newsId } });

      if (!foundNews) {
        return resolve({
          errCode: 1,
          errMessage: "News not found",
        });
      }

      await db.News.destroy({ where: { id: newsId } });

      resolve({
        errCode: 0,
        errMessage: "News deleted",
      });
    } catch (e) {
      reject(e);
    }
  });
};

module.exports = {
  getAllNews,
  getNewsById,
  createNews,
  updateNews,
  deleteNews,
};
