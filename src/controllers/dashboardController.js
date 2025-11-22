// src/controllers/dashboardController.js
import dashboardService from "../services/dashboardService.js";

// Lấy tổng quan dashboard
const getOverview = async (req, res) => {
  try {
    const data = await dashboardService.getOverview();
    return res.status(200).json(data);
  } catch (e) {
    console.error("Lỗi lấy dữ liệu tổng quan:", e);
    return res.status(500).json({
      errCode: -1,
      errMessage: "Lỗi hệ thống",
    });
  }
};

// Lấy dữ liệu biểu đồ
const getCharts = async (req, res) => {
  try {
    const data = await dashboardService.getCharts();
    return res.status(200).json(data);
  } catch (e) {
    console.error("Lỗi lấy dữ liệu biểu đồ:", e);
    return res.status(500).json({
      errCode: -1,
      errMessage: "Lỗi hệ thống",
    });
  }
};

// Lấy danh sách tuyến nổi bật
const getTopRoutes = async (req, res) => {
  try {
    const data = await dashboardService.getTopRoutes();
    return res.status(200).json(data);
  } catch (e) {
    console.error("Lỗi lấy danh sách tuyến nổi bật:", e);
    return res.status(500).json({
      errCode: -1,
      errMessage: "Lỗi hệ thống",
    });
  }
};

export default {
  getOverview,
  getCharts,
  getTopRoutes,
};
