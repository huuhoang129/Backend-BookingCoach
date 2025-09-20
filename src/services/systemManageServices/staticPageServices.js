import db from "../../models/index.js";

let getStaticPage = (pageKey) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!pageKey) {
        return resolve({
          errCode: 1,
          errMessage: "Missing parameter: pageKey",
        });
      }

      let blocks = await db.StaticPage.findAll({
        where: { pageKey },
        order: [["sortOrder", "ASC"]],
        raw: true,
      });

      resolve({
        errCode: 0,
        errMessage: "OK",
        data: blocks,
      });
    } catch (e) {
      reject(e);
    }
  });
};

let updateStaticPage = (pageKey, blocks) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!pageKey || !Array.isArray(blocks) || blocks.length === 0) {
        return resolve({
          errCode: 1,
          errMessage: "Missing parameter: pageKey or blocks",
        });
      }

      // Xoá block cũ
      await db.StaticPage.destroy({
        where: { pageKey },
      });

      // Thêm block mới
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
        errMessage: `${pageKey} updated`,
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
