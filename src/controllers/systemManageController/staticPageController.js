// src/controllers/systemManageController/staticPageController.js
import staticPageServices from "../../services/systemManageServices/staticPageServices";

// Lấy nội dung trang tĩnh theo pageKey
let getStaticPage = async (req, res) => {
  try {
    const { pageKey } = req.params;

    if (!pageKey) {
      return res.status(400).json({
        errCode: 1,
        errMessage: "Thiếu tham số pageKey",
      });
    }

    const data = await staticPageServices.getStaticPage(pageKey);
    return res.status(200).json(data);
  } catch (e) {
    console.error("Lỗi khi lấy trang tĩnh:", e);
    return res.status(500).json({
      errCode: -1,
      errMessage: "Lỗi hệ thống",
    });
  }
};

// Cập nhật nội dung trang tĩnh theo pageKey
let updateStaticPage = async (req, res) => {
  try {
    const { pageKey } = req.params;
    const { blocks } = req.body;

    if (!pageKey || !Array.isArray(blocks)) {
      return res.status(400).json({
        errCode: 1,
        errMessage: "Thiếu tham số pageKey hoặc blocks không hợp lệ",
      });
    }

    const result = await staticPageServices.updateStaticPage(pageKey, blocks);
    return res.status(200).json(result);
  } catch (e) {
    console.error("Lỗi khi cập nhật trang tĩnh:", e);
    return res.status(500).json({
      errCode: -1,
      errMessage: "Lỗi hệ thống",
    });
  }
};

module.exports = {
  getStaticPage,
  updateStaticPage,
};
