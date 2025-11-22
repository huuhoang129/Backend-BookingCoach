// src/services/systemManageServices/newServices.js
import db from "../../models/index.js";

// Lấy danh sách toàn bộ tin tức
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

      // Chuyển thumbnail từ base64 sang dạng binary để hiển thị
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
        errMessage: "Lấy danh sách tin tức thành công",
        data: news,
      });
    } catch (e) {
      reject(e);
    }
  });
};

// Lấy chi tiết tin tức theo ID
let getNewsById = (newsId) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!newsId) {
        return resolve({
          errCode: 1,
          errMessage: "Thiếu tham số bắt buộc: id",
        });
      }

      const news = await db.News.findOne({
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
          errMessage: "Không tìm thấy tin tức",
        });
      }

      // Chuyển thumbnail từ buffer sang base64 string
      if (news.thumbnail) {
        const base64Str = news.thumbnail.toString("base64");
        news.thumbnail = `data:image/png;base64,${base64Str}`;
      }

      resolve({
        errCode: 0,
        errMessage: "Lấy thông tin tin tức thành công",
        data: news,
      });
    } catch (e) {
      reject(e);
    }
  });
};

// Tạo mới tin tức
let createNews = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!data.title || !data.authorId) {
        return resolve({
          errCode: 1,
          errMessage: "Thiếu tham số bắt buộc",
        });
      }

      const news = await db.News.create({
        title: data.title,
        thumbnail: data.thumbnailBase64 || null,
        authorId: data.authorId,
        status: data.status || "Draft",
        newsType: data.newsType || "News",
      });

      // Tạo các block nội dung chi tiết
      if (Array.isArray(data.blocks) && data.blocks.length > 0) {
        for (let i = 0; i < data.blocks.length; i++) {
          const block = data.blocks[i];
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
        errMessage: "Tạo tin tức thành công",
        data: news,
      });
    } catch (e) {
      reject(e);
    }
  });
};

// Cập nhật tin tức
let updateNews = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!data.id) {
        return resolve({
          errCode: 1,
          errMessage: "Thiếu tham số bắt buộc: id",
        });
      }

      const news = await db.News.findOne({
        where: { id: data.id },
        raw: false,
      });

      if (!news) {
        return resolve({
          errCode: 2,
          errMessage: "Không tìm thấy tin tức",
        });
      }

      // Cập nhật thông tin cơ bản của tin tức
      news.title = data.title || news.title;
      if (data.thumbnailBase64) {
        news.thumbnail = data.thumbnailBase64;
      }
      news.status = data.status || news.status;
      news.newsType = data.newsType || news.newsType;
      await news.save();

      // Nếu có gửi danh sách block mới thì xóa block cũ và tạo lại
      if (Array.isArray(data.blocks)) {
        await db.News_Details.destroy({ where: { newsId: news.id } });

        for (let i = 0; i < data.blocks.length; i++) {
          const block = data.blocks[i];
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
        errMessage: "Cập nhật tin tức thành công",
      });
    } catch (e) {
      reject(e);
    }
  });
};

// Xóa tin tức theo ID
let deleteNews = (newsId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const foundNews = await db.News.findOne({ where: { id: newsId } });

      if (!foundNews) {
        return resolve({
          errCode: 1,
          errMessage: "Không tìm thấy tin tức",
        });
      }

      await db.News.destroy({ where: { id: newsId } });

      resolve({
        errCode: 0,
        errMessage: "Xóa tin tức thành công",
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
