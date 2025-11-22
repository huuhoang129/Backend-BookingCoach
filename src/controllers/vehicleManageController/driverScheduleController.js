// src/controllers/vehicleManageController/driverScheduleController.js
import driverScheduleServices from "../../services/vehicleManageServices/driverScheduleServices.js";

// Lấy tất cả lịch tài xế
let getAllDriverSchedules = async (req, res) => {
  try {
    const { userId } = req.query;

    const result = userId
      ? await driverScheduleServices.getDriverSchedulesByUser(userId)
      : await driverScheduleServices.getAllDriverSchedules();

    return res.status(200).json(result);
  } catch (e) {
    console.error("Lỗi lấy danh sách lịch tài xế:", e);
    return res.status(500).json({
      errCode: -1,
      errMessage: "Lỗi hệ thống",
    });
  }
};

// Lấy lịch tài xế theo ID
let getDriverScheduleById = async (req, res) => {
  try {
    const result = await driverScheduleServices.getDriverScheduleById(
      req.params.id
    );
    return res.status(200).json(result);
  } catch (e) {
    console.error("Lỗi lấy lịch tài xế theo ID:", e);
    return res.status(500).json({
      errCode: -1,
      errMessage: "Lỗi hệ thống",
    });
  }
};

// Tạo lịch tài xế mới
let createDriverSchedule = async (req, res) => {
  try {
    const result = await driverScheduleServices.createDriverSchedule(req.body);
    return res.status(200).json(result);
  } catch (e) {
    console.error("Lỗi tạo lịch tài xế:", e);
    return res.status(500).json({
      errCode: -1,
      errMessage: "Lỗi hệ thống",
    });
  }
};

// Cập nhật lịch tài xế
let updateDriverSchedule = async (req, res) => {
  try {
    const result = await driverScheduleServices.updateDriverSchedule(req.body);
    return res.status(200).json(result);
  } catch (e) {
    console.error("Lỗi cập nhật lịch tài xế:", e);
    return res.status(500).json({
      errCode: -1,
      errMessage: "Lỗi hệ thống",
    });
  }
};

// Xóa lịch tài xế
let deleteDriverSchedule = async (req, res) => {
  try {
    const result = await driverScheduleServices.deleteDriverSchedule(
      req.params.id
    );
    return res.status(200).json(result);
  } catch (e) {
    console.error("Lỗi xóa lịch tài xế:", e);
    return res.status(500).json({
      errCode: -1,
      errMessage: "Lỗi hệ thống",
    });
  }
};

// Lấy tất cả tài xế
const getAllDrivers = async (req, res) => {
  try {
    const result = await driverScheduleServices.getAllDrivers();
    return res.status(200).json(result);
  } catch (e) {
    console.error("Lỗi lấy danh sách tài xế:", e);
    return res.status(500).json({
      errCode: -1,
      errMessage: "Lỗi hệ thống",
    });
  }
};

export default {
  getAllDriverSchedules,
  getDriverScheduleById,
  createDriverSchedule,
  updateDriverSchedule,
  deleteDriverSchedule,
  getAllDrivers,
};
