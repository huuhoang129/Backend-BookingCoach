import driverScheduleServices from "../../services/vehicleManageServices/driverScheduleServices.js";

let getAllDriverSchedules = async (req, res) => {
  try {
    const { userId } = req.query;

    let result;
    if (userId) {
      // ✅ Nếu có userId → chỉ lấy lịch của tài xế đó
      result = await driverScheduleServices.getDriverSchedulesByUser(userId);
    } else {
      // ✅ Nếu không có userId → admin lấy toàn bộ lịch
      result = await driverScheduleServices.getAllDriverSchedules();
    }

    return res.status(200).json(result);
  } catch (e) {
    console.error("❌ getAllDriverSchedules error:", e);
    return res
      .status(500)
      .json({ errCode: -1, errMessage: "Error from server" });
  }
};

let getDriverScheduleById = async (req, res) => {
  try {
    let id = req.params.id;
    let result = await driverScheduleServices.getDriverScheduleById(id);
    return res.status(200).json(result);
  } catch (e) {
    console.error("getDriverScheduleById error:", e);
    return res
      .status(500)
      .json({ errCode: -1, errMessage: "Error from server" });
  }
};

let createDriverSchedule = async (req, res) => {
  try {
    let data = req.body;
    let result = await driverScheduleServices.createDriverSchedule(data);
    return res.status(200).json(result);
  } catch (e) {
    console.error("createDriverSchedule error:", e);
    return res
      .status(500)
      .json({ errCode: -1, errMessage: "Error from server" });
  }
};

let updateDriverSchedule = async (req, res) => {
  try {
    let data = req.body;
    let result = await driverScheduleServices.updateDriverSchedule(data);
    return res.status(200).json(result);
  } catch (e) {
    console.error("updateDriverSchedule error:", e);
    return res
      .status(500)
      .json({ errCode: -1, errMessage: "Error from server" });
  }
};

let deleteDriverSchedule = async (req, res) => {
  try {
    let id = req.params.id;
    let result = await driverScheduleServices.deleteDriverSchedule(id);
    return res.status(200).json(result);
  } catch (e) {
    console.error("deleteDriverSchedule error:", e);
    return res
      .status(500)
      .json({ errCode: -1, errMessage: "Error from server" });
  }
};

const getAllDrivers = async (req, res) => {
  try {
    const data = await driverScheduleServices.getAllDrivers();
    res.status(200).json(data);
  } catch (e) {
    res.status(500).json({ errCode: 1, errMessage: e.message });
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
