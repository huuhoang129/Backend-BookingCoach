// src/controllers/stationManageController/routeController.js
import routeService from "../../services/stationManageServices/routeServices";

// Lấy danh sách tất cả các tuyến đường
let getAllRoutes = async (req, res) => {
  try {
    const routes = await routeService.getAllRoutes();
    return res.status(200).json(routes);
  } catch (e) {
    console.error("Lỗi khi lấy danh sách tuyến:", e);
    return res.status(500).json({
      errCode: -1,
      errMessage: "Lỗi hệ thống",
    });
  }
};

// Lấy thông tin tuyến đường theo ID
let getRouteById = async (req, res) => {
  try {
    const routeId = req.params.id;
    const result = await routeService.getRouteById(routeId);
    return res.status(200).json(result);
  } catch (e) {
    console.error("Lỗi khi lấy tuyến theo ID:", e);
    return res.status(500).json({
      errCode: -1,
      errMessage: "Lỗi hệ thống",
    });
  }
};

// Tạo mới tuyến đường
let createRoute = async (req, res) => {
  try {
    const result = await routeService.createRoute(req.body);
    return res.status(200).json(result);
  } catch (e) {
    console.error("Lỗi khi tạo tuyến đường:", e);
    return res.status(500).json({
      errCode: -1,
      errMessage: "Lỗi hệ thống",
    });
  }
};

// Cập nhật thông tin tuyến đường
let updateRoute = async (req, res) => {
  try {
    const result = await routeService.updateRoute({
      id: req.params.id,
      ...req.body,
    });

    return res.status(200).json(result);
  } catch (e) {
    console.error("Lỗi khi cập nhật tuyến đường:", e);
    return res.status(500).json({
      errCode: -1,
      errMessage: "Lỗi hệ thống",
    });
  }
};

// Xóa tuyến đường
let deleteRoute = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        errCode: 1,
        errMessage: "Thiếu tham số id",
      });
    }

    const result = await routeService.deleteRoute(id);
    return res.status(200).json(result);
  } catch (e) {
    console.error("Lỗi khi xóa tuyến đường:", e);
    return res.status(500).json({
      errCode: -1,
      errMessage: "Lỗi hệ thống",
    });
  }
};

export default {
  getAllRoutes,
  getRouteById,
  createRoute,
  deleteRoute,
  updateRoute,
};
