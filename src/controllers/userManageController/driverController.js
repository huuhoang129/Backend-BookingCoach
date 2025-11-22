// src/controllers/userManageController/driverController.js
import driverServices from "../../services/userManageServices/driverServices.js";

// Lấy tất cả tài xế
let getAllDrivers = async (req, res) => {
  try {
    const drivers = await driverServices.getAllDrivers();
    return res.status(200).json(drivers);
  } catch (e) {
    console.error("Lỗi lấy danh sách tài xế:", e);
    return res.status(500).json({
      errCode: -1,
      errMessage: "Lỗi hệ thống",
    });
  }
};

// Lấy tài xế theo ID
let getDriverById = async (req, res) => {
  try {
    const driver = await driverServices.getDriverById(req.params.id);
    return res.status(200).json(driver);
  } catch (e) {
    console.error("Lỗi lấy tài xế theo ID:", e);
    return res.status(500).json({
      errCode: -1,
      errMessage: "Lỗi hệ thống",
    });
  }
};

// Tạo tài xế mới
let createDriver = async (req, res) => {
  try {
    const result = await driverServices.createDriver(req.body);
    return res.status(200).json(result);
  } catch (e) {
    console.error("Lỗi tạo tài xế:", e);
    return res.status(500).json({
      errCode: -1,
      errMessage: "Lỗi hệ thống",
    });
  }
};

// Cập nhật thông tin tài xế
let updateDriver = async (req, res) => {
  try {
    const data = { ...req.body, id: req.params.id };
    const result = await driverServices.updateDriver(data);
    return res.status(200).json(result);
  } catch (e) {
    console.error("Lỗi cập nhật tài xế:", e);
    return res.status(500).json({
      errCode: -1,
      errMessage: "Lỗi hệ thống",
    });
  }
};

// Xóa tài xế
let deleteDriver = async (req, res) => {
  try {
    const result = await driverServices.deleteDriver(req.params.id);
    return res.status(200).json(result);
  } catch (e) {
    console.error("Lỗi xóa tài xế:", e);
    return res.status(500).json({
      errCode: -1,
      errMessage: "Lỗi hệ thống",
    });
  }
};

export default {
  getAllDrivers,
  getDriverById,
  createDriver,
  updateDriver,
  deleteDriver,
};
