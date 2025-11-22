// src/controllers/systemManageController/newController.js
import newsService from "../../services/systemManageServices/newServices";

// Lấy danh sách tất cả tin tức
let getAllNews = async (req, res) => {
  try {
    const result = await newsService.getAllNews();
    return res.status(200).json(result);
  } catch (e) {
    console.error("Lỗi khi lấy danh sách tin tức:", e);
    return res.status(500).json({
      errCode: -1,
      errMessage: "Lỗi hệ thống",
    });
  }
};

// Lấy thông tin tin tức theo ID
let getNewsById = async (req, res) => {
  try {
    const newsId = req.params.id;
    const result = await newsService.getNewsById(newsId);
    return res.status(200).json(result);
  } catch (e) {
    console.error("Lỗi khi lấy tin tức theo ID:", e);
    return res.status(500).json({
      errCode: -1,
      errMessage: "Lỗi hệ thống",
    });
  }
};

// Tạo mới tin tức
let createNews = async (req, res) => {
  try {
    const result = await newsService.createNews(req.body);
    return res.status(200).json(result);
  } catch (e) {
    console.error("Lỗi khi tạo tin tức:", e);
    return res.status(500).json({
      errCode: -1,
      errMessage: "Lỗi hệ thống",
    });
  }
};

// Tạo mới tin tức
let updateNews = async (req, res) => {
  try {
    const result = await newsService.updateNews(req.body);
    return res.status(200).json(result);
  } catch (e) {
    console.error("Lỗi khi cập nhật tin tức:", e);
    return res.status(500).json({
      errCode: -1,
      errMessage: "Lỗi hệ thống",
    });
  }
};

/**
 * Xóa tin tức
 */
let deleteNews = async (req, res) => {
  try {
    const newsId = req.params.id;
    const result = await newsService.deleteNews(newsId);
    return res.status(200).json(result);
  } catch (e) {
    console.error("Lỗi khi xóa tin tức:", e);
    return res.status(500).json({
      errCode: -1,
      errMessage: "Lỗi hệ thống",
    });
  }
};

module.exports = {
  getAllNews,
  getNewsById,
  createNews,
  updateNews,
  deleteNews,
};
