import db from "../../models/index.js";

let createNews = async (data) => {
  try {
    if (!data.title || !data.thumbnail || !data.authorId) {
      console.log("❌ Thiếu field:", data); // log input khi thiếu
      return {
        errCode: 1,
        errMessage: "Missing required fields",
      };
    }

    console.log("📥 Payload nhận từ frontend:", JSON.stringify(data, null, 2));

    const t = await db.sequelize.transaction();

    try {
      const news = await db.News.create(
        {
          title: data.title,
          thumbnail: data.thumbnail,
          status: data.status || "draft",
          authorId: data.authorId,
        },
        { transaction: t }
      );

      console.log("✅ News đã tạo:", news.toJSON());

      if (Array.isArray(data.blocks) && data.blocks.length > 0) {
        for (let i = 0; i < data.blocks.length; i++) {
          const block = data.blocks[i];
          console.log(`➡️ Đang tạo block #${i + 1}:`, block);

          await db.NewsBlock.create(
            {
              newsId: news.id,
              blockType: block.type,
              content: block.type === "text" ? block.content : null,
              image: block.type === "image" ? block.content : null,
              position: i + 1,
            },
            { transaction: t }
          );
        }
      }

      await t.commit();
      console.log("🎉 Commit thành công");
      return {
        errCode: 0,
        errMessage: "OK",
        data: news,
      };
    } catch (err) {
      console.error("❌ Lỗi khi insert NewsBlock:", err);
      await t.rollback();
      throw err;
    }
  } catch (e) {
    console.error("❌ Lỗi server:", e);
    return {
      errCode: -1,
      errMessage: "Error from the server",
    };
  }
};

let getAllNews = async () => {
  try {
    const newsList = await db.News.findAll({
      include: [
        {
          model: db.NewsBlock,
          as: "blocks",
          attributes: ["id", "blockType", "content", "image", "position"],
        },
      ],
      order: [
        ["createdAt", "DESC"],
        [{ model: db.NewsBlock, as: "blocks" }, "position", "ASC"],
      ],
    });

    const formatted = newsList.map((item) => {
      const news = item.toJSON();

      if (news.thumbnail) {
        // Nếu DB lưu kiểu BLOB / Buffer
        news.thumbnail = Buffer.from(news.thumbnail).toString("binary");
      }

      if (news.blocks && news.blocks.length > 0) {
        news.blocks = news.blocks.map((b) => {
          if (b.image) {
            b.image = Buffer.from(b.image).toString("binary");
          }
          return b;
        });
      }

      return news;
    });

    return {
      errCode: 0,
      data: formatted,
    };
  } catch (e) {
    console.error(e);
    return {
      errCode: -1,
      errMessage: "Error from the server",
    };
  }
};

let getNewsById = (inputId) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!inputId) {
        return resolve({
          errCode: 1,
          errMessage: "Missing parameter",
        });
      }

      let data = await db.News.findOne({
        where: { id: inputId },
        attributes: [
          "id",
          "title",
          "thumbnail",
          "status",
          "authorId",
          "createdAt",
          "updatedAt",
        ],
        include: [
          {
            model: db.NewsBlock,
            as: "blocks",
            attributes: ["id", "blockType", "content", "image", "position"],
            order: [["position", "ASC"]],
          },
        ],
      });

      if (!data) {
        return resolve({
          errCode: 2,
          errMessage: "News not found",
        });
      }

      // ✅ convert thumbnail nếu có
      if (data.thumbnail) {
        data.thumbnail = Buffer.from(data.thumbnail).toString("base64");
      }

      // ✅ convert block image nếu có
      if (data.blocks && data.blocks.length > 0) {
        data.blocks = data.blocks.map((b) => {
          if (b.image) {
            b.image = Buffer.from(b.image).toString("base64");
          }
          return b;
        });
      }

      resolve({
        errCode: 0,
        errMessage: "OK",
        data,
      });
    } catch (e) {
      console.error(e);
      reject(e);
    }
  });
};

let deleteNews = (newsId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const foundNews = await db.News.findOne({
        where: { id: newsId },
      });

      if (!foundNews) {
        return resolve({
          errCode: 2,
          errMessage: "News isn't exist",
        });
      }

      await db.NewsBlock.destroy({
        where: { newsId },
      });

      await db.News.destroy({
        where: { id: newsId },
      });

      resolve({
        errCode: 0,
        errMessage: "News is deleted",
      });
    } catch (e) {
      console.error(e);
      reject(e);
    }
  });
};

let updateNews = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!data.id || !data.title) {
        return resolve({
          errCode: 2,
          errMessage: "Missing required parameters!",
        });
      }

      let news = await db.News.findOne({
        where: { id: data.id },
        raw: false,
      });

      if (!news) {
        return resolve({
          errCode: 1,
          errMessage: "News not found!",
        });
      }

      // update các field cơ bản
      news.title = data.title;
      if (data.thumbnail) news.thumbnail = data.thumbnail; // giống banner.image
      if (data.status) news.status = data.status;
      if (data.authorId) news.authorId = data.authorId;

      await news.save();

      resolve({
        errCode: 0,
        errMessage: "Update News Succeeds!",
      });
    } catch (e) {
      console.error(e);
      reject(e);
    }
  });
};

export default {
  createNews,
  getAllNews,
  getNewsById,
  deleteNews,
  updateNews,
};
