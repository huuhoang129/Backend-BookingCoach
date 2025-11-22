// src/controllers/tripManageController/scheduleController.js
import scheduleService from "../../services/tripManageServices/scheduleService";

// Lấy tất cả lịch chạy
let getAllSchedules = async (req, res) => {
  try {
    const result = await scheduleService.getAllSchedules();
    return res.status(200).json(result);
  } catch (e) {
    console.error("Lỗi khi lấy danh sách lịch chạy:", e);
    return res.status(500).json({
      errCode: -1,
      errMessage: "Lỗi hệ thống",
    });
  }
};

// Lấy lịch chạy theo ID
let getScheduleById = async (req, res) => {
  try {
    const id = req.params.id;
    const result = await scheduleService.getScheduleById(id);
    return res.status(200).json(result);
  } catch (e) {
    console.error("Lỗi khi lấy lịch chạy theo ID:", e);
    return res.status(500).json({
      errCode: -1,
      errMessage: "Lỗi hệ thống",
    });
  }
};

// Tạo lịch chạy mới
let createSchedule = async (req, res) => {
  try {
    const result = await scheduleService.createSchedule(req.body);
    return res.status(200).json(result);
  } catch (e) {
    console.error("Lỗi khi tạo lịch chạy:", e);
    return res.status(500).json({
      errCode: -1,
      errMessage: "Lỗi hệ thống",
    });
  }
};

// Cập nhật lịch chạy
let updateSchedule = async (req, res) => {
  try {
    const result = await scheduleService.updateSchedule({
      id: req.params.id,
      ...req.body,
    });
    return res.status(200).json(result);
  } catch (e) {
    console.error("Lỗi khi cập nhật lịch chạy:", e);
    return res.status(500).json({
      errCode: -1,
      errMessage: "Lỗi hệ thống",
    });
  }
};

// Xóa lịch chạy
let deleteSchedule = async (req, res) => {
  try {
    const result = await scheduleService.deleteSchedule(req.params.id);
    return res.status(200).json(result);
  } catch (e) {
    console.error("Lỗi khi xóa lịch chạy:", e);
    return res.status(500).json({
      errCode: -1,
      errMessage: "Lỗi hệ thống",
    });
  }
};

// Tạo chuyến từ lịch chạy
let generateTrips = async (req, res) => {
  try {
    const result = await scheduleService.generateTripsFromSchedules();
    return res.status(200).json(result);
  } catch (e) {
    console.error("Lỗi khi tạo chuyến từ lịch chạy:", e);
    return res.status(500).json({
      errCode: -1,
      errMessage: "Lỗi hệ thống",
    });
  }
};

export default {
  getAllSchedules,
  getScheduleById,
  createSchedule,
  updateSchedule,
  deleteSchedule,
  generateTrips,
};
