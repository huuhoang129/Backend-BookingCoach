// src/controllers/vehicleManageController/vehicleManageController.js
import vehicleService from "../../services/vehicleManageServices/vehicleServices.js";

// Lấy tất cả phương tiện
let getAllVehicles = async (req, res) => {
  try {
    const vehicles = await vehicleService.getAllVehicles();
    return res.status(200).json(vehicles);
  } catch (e) {
    console.error("Lỗi lấy danh sách phương tiện:", e);
    return res.status(500).json({
      errCode: -1,
      errMessage: "Lỗi hệ thống",
    });
  }
};

// Lấy phương tiện theo ID
let getVehicleById = async (req, res) => {
  try {
    const result = await vehicleService.getVehicleById(req.params.id);
    return res.status(200).json(result);
  } catch (e) {
    console.error("Lỗi lấy phương tiện theo ID:", e);
    return res.status(500).json({
      errCode: -1,
      errMessage: "Lỗi hệ thống",
    });
  }
};

// Tạo phương tiện mới
let createVehicle = async (req, res) => {
  try {
    const result = await vehicleService.createVehicle(req.body);
    return res.status(200).json(result);
  } catch (e) {
    console.error("Lỗi tạo phương tiện:", e);
    return res.status(500).json({
      errCode: -1,
      errMessage: "Lỗi hệ thống",
    });
  }
};

// Cập nhật phương tiện
let updateVehicle = async (req, res) => {
  try {
    const result = await vehicleService.updateVehicle({
      id: req.params.id,
      ...req.body,
    });

    return res.status(200).json(result);
  } catch (e) {
    console.error("Lỗi cập nhật phương tiện:", e);
    return res.status(500).json({
      errCode: -1,
      errMessage: "Lỗi hệ thống",
    });
  }
};

// Xóa phương tiện
let deleteVehicle = async (req, res) => {
  const { id } = req.params;

  // Kiểm tra thiếu ID
  if (!id) {
    return res.status(400).json({
      errCode: 1,
      errMessage: "Thiếu tham số bắt buộc: id",
    });
  }

  try {
    const result = await vehicleService.deleteVehicle(id);
    return res.status(200).json(result);
  } catch (e) {
    console.error("Lỗi xóa phương tiện:", e);
    return res.status(500).json({
      errCode: -1,
      errMessage: "Lỗi hệ thống",
    });
  }
};

export default {
  getAllVehicles,
  getVehicleById,
  createVehicle,
  updateVehicle,
  deleteVehicle,
};
