// src/services/systemManageServices/staticPageServices.js
import db from "../../models/index.js";

// Lấy nội dung trang tĩnh theo pageKey
let getStaticPage = (pageKey) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!pageKey) {
        return resolve({
          errCode: 1,
          errMessage: "Thiếu tham số bắt buộc: pageKey",
        });
      }

      const blocks = await db.StaticPage.findAll({
        where: { pageKey },
        order: [["sortOrder", "ASC"]],
        raw: true,
      });

      resolve({
        errCode: 0,
        errMessage: "Lấy nội dung trang tĩnh thành công",
        data: blocks,
      });
    } catch (e) {
      reject(e);
    }
  });
};

// Cập nhật nội dung trang tĩnh theo pageKey
let updateStaticPage = (pageKey, blocks) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!pageKey || !Array.isArray(blocks) || blocks.length === 0) {
        return resolve({
          errCode: 1,
          errMessage: "Thiếu tham số bắt buộc: pageKey hoặc blocks",
        });
      }

      // Xóa toàn bộ block cũ của trang
      await db.StaticPage.destroy({
        where: { pageKey },
      });

      // Thêm danh sách block mới cho trang
      const newBlocks = blocks.map((b, idx) => ({
        pageKey,
        blockType: b.blockType,
        content: b.content || null,
        imageUrl: b.imageUrl || null,
        sortOrder: b.sortOrder ?? idx + 1,
      }));

      await db.StaticPage.bulkCreate(newBlocks);

      resolve({
        errCode: 0,
        errMessage: `Cập nhật trang ${pageKey} thành công`,
      });
    } catch (e) {
      reject(e);
    }
  });
};

module.exports = {
  getStaticPage,
  updateStaticPage,
};
