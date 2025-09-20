import db from "../../models/index.js";

// let createAboutPage = (blocks) => {
//   return new Promise(async (resolve, reject) => {
//     try {
//       if (!Array.isArray(blocks) || blocks.length === 0) {
//         return resolve({
//           errCode: 1,
//           errMessage: "Missing parameter: blocks",
//         });
//       }

//       // Thêm nhiều block cùng lúc
//       const newBlocks = blocks.map((b, idx) => ({
//         pageKey: "AboutPage",
//         blockType: b.blockType,
//         content: b.content || null,
//         imageUrl: b.imageUrl || null,
//         sortOrder: b.sortOrder ?? idx + 1,
//       }));

//       await db.StaticPage.bulkCreate(newBlocks);

//       resolve({
//         errCode: 0,
//         errMessage: "About page created",
//       });
//     } catch (e) {
//       reject(e);
//     }
//   });
// };

let getAboutPage = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let blocks = await db.StaticPage.findAll({
        where: { pageKey: "AboutPage" },
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

let updateAboutPage = (blocks) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!Array.isArray(blocks) || blocks.length === 0) {
        return resolve({
          errCode: 1,
          errMessage: "Missing parameter: blocks",
        });
      }

      // Xóa block cũ
      await db.StaticPage.destroy({
        where: { pageKey: "AboutPage" },
      });

      // Thêm block mới
      const newBlocks = blocks.map((b, idx) => ({
        pageKey: "AboutPage",
        blockType: b.blockType,
        content: b.content || null,
        imageUrl: b.imageUrl || null,
        sortOrder: b.sortOrder ?? idx + 1,
      }));

      await db.StaticPage.bulkCreate(newBlocks);

      resolve({
        errCode: 0,
        errMessage: "About page updated",
      });
    } catch (e) {
      reject(e);
    }
  });
};

let getConditionsPage = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let blocks = await db.StaticPage.findAll({
        where: { pageKey: "ConditionsPage" },
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

let updateConditionsPage = (blocks) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!Array.isArray(blocks) || blocks.length === 0) {
        return resolve({
          errCode: 1,
          errMessage: "Missing parameter: blocks",
        });
      }

      // Xóa block cũ
      await db.StaticPage.destroy({
        where: { pageKey: "ConditionsPage" },
      });

      // Thêm block mới
      const newBlocks = blocks.map((b, idx) => ({
        pageKey: "ConditionsPage",
        blockType: b.blockType,
        content: b.content || null,
        imageUrl: b.imageUrl || null,
        sortOrder: b.sortOrder ?? idx + 1,
      }));

      await db.StaticPage.bulkCreate(newBlocks);

      resolve({
        errCode: 0,
        errMessage: "Conditions page updated",
      });
    } catch (e) {
      reject(e);
    }
  });
};

let getPrivacyPolicyPage = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let blocks = await db.StaticPage.findAll({
        where: { pageKey: "PrivacyPolicyPage" },
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

let updatePrivacyPolicyPage = (blocks) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!Array.isArray(blocks) || blocks.length === 0) {
        return resolve({
          errCode: 1,
          errMessage: "Missing parameter: blocks",
        });
      }

      // Xóa block cũ
      await db.StaticPage.destroy({
        where: { pageKey: "PrivacyPolicyPage" },
      });

      // Thêm block mới
      const newBlocks = blocks.map((b, idx) => ({
        pageKey: "PrivacyPolicyPage",
        blockType: b.blockType,
        content: b.content || null,
        imageUrl: b.imageUrl || null,
        sortOrder: b.sortOrder ?? idx + 1,
      }));

      await db.StaticPage.bulkCreate(newBlocks);

      resolve({
        errCode: 0,
        errMessage: "Conditions page updated",
      });
    } catch (e) {
      reject(e);
    }
  });
};

let getRefundPolicyPage = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let blocks = await db.StaticPage.findAll({
        where: { pageKey: "RefundPolicyPage" },
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

let updateRefundPolicyPage = (blocks) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!Array.isArray(blocks) || blocks.length === 0) {
        return resolve({
          errCode: 1,
          errMessage: "Missing parameter: blocks",
        });
      }

      // Xóa block cũ
      await db.StaticPage.destroy({
        where: { pageKey: "RefundPolicyPage" },
      });

      // Thêm block mới
      const newBlocks = blocks.map((b, idx) => ({
        pageKey: "RefundPolicyPage",
        blockType: b.blockType,
        content: b.content || null,
        imageUrl: b.imageUrl || null,
        sortOrder: b.sortOrder ?? idx + 1,
      }));

      await db.StaticPage.bulkCreate(newBlocks);

      resolve({
        errCode: 0,
        errMessage: "Conditions page updated",
      });
    } catch (e) {
      reject(e);
    }
  });
};

let getPaymentPolicyPage = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let blocks = await db.StaticPage.findAll({
        where: { pageKey: "PaymentPolicyPage" },
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

let updatePaymentPolicyPage = (blocks) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!Array.isArray(blocks) || blocks.length === 0) {
        return resolve({
          errCode: 1,
          errMessage: "Missing parameter: blocks",
        });
      }

      // Xóa block cũ
      await db.StaticPage.destroy({
        where: { pageKey: "PaymentPolicyPage" },
      });

      // Thêm block mới
      const newBlocks = blocks.map((b, idx) => ({
        pageKey: "PaymentPolicyPage",
        blockType: b.blockType,
        content: b.content || null,
        imageUrl: b.imageUrl || null,
        sortOrder: b.sortOrder ?? idx + 1,
      }));

      await db.StaticPage.bulkCreate(newBlocks);

      resolve({
        errCode: 0,
        errMessage: "PaymentPolicy page updated",
      });
    } catch (e) {
      reject(e);
    }
  });
};

let getCancellationPolicyPage = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let blocks = await db.StaticPage.findAll({
        where: { pageKey: "CancellationPolicyPage" },
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

let updateCancellationPolicyPage = (blocks) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!Array.isArray(blocks) || blocks.length === 0) {
        return resolve({
          errCode: 1,
          errMessage: "Missing parameter: blocks",
        });
      }

      // Xóa block cũ
      await db.StaticPage.destroy({
        where: { pageKey: "CancellationPolicyPage" },
      });

      // Thêm block mới
      const newBlocks = blocks.map((b, idx) => ({
        pageKey: "CancellationPolicyPage",
        blockType: b.blockType,
        content: b.content || null,
        imageUrl: b.imageUrl || null,
        sortOrder: b.sortOrder ?? idx + 1,
      }));

      await db.StaticPage.bulkCreate(newBlocks);

      resolve({
        errCode: 0,
        errMessage: "PaymentPolicy page updated",
      });
    } catch (e) {
      reject(e);
    }
  });
};

let getShippingPolicyPage = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let blocks = await db.StaticPage.findAll({
        where: { pageKey: "ShippingPolicyPage" },
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

let updateShippingPolicyPage = (blocks) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!Array.isArray(blocks) || blocks.length === 0) {
        return resolve({
          errCode: 1,
          errMessage: "Missing parameter: blocks",
        });
      }

      // Xóa block cũ
      await db.StaticPage.destroy({
        where: { pageKey: "ShippingPolicyPage" },
      });

      // Thêm block mới
      const newBlocks = blocks.map((b, idx) => ({
        pageKey: "ShippingPolicyPage",
        blockType: b.blockType,
        content: b.content || null,
        imageUrl: b.imageUrl || null,
        sortOrder: b.sortOrder ?? idx + 1,
      }));

      await db.StaticPage.bulkCreate(newBlocks);

      resolve({
        errCode: 0,
        errMessage: "PaymentPolicy page updated",
      });
    } catch (e) {
      reject(e);
    }
  });
};

module.exports = {
  getAboutPage,
  // createAboutPage,
  updateAboutPage,
  getConditionsPage,
  updateConditionsPage,
  getPrivacyPolicyPage,
  updatePrivacyPolicyPage,
  getRefundPolicyPage,
  updateRefundPolicyPage,
  getPaymentPolicyPage,
  updatePaymentPolicyPage,
  getCancellationPolicyPage,
  updateCancellationPolicyPage,
  getShippingPolicyPage,
  updateShippingPolicyPage,
};
