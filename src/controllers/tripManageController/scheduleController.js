import scheduleService from "../../services/tripManageServices/scheduleService";

let getAllSchedules = async (req, res) => {
  try {
    let result = await scheduleService.getAllSchedules();
    return res.status(200).json(result);
  } catch (e) {
    console.error("getAllSchedules error:", e);
    return res.status(500).json({ errCode: -1, errMessage: "Server error" });
  }
};

let getScheduleById = async (req, res) => {
  try {
    let id = req.params.id;
    let result = await scheduleService.getScheduleById(id);
    return res.status(200).json(result);
  } catch (e) {
    console.error("getScheduleById error:", e);
    return res.status(500).json({ errCode: -1, errMessage: "Server error" });
  }
};

let createSchedule = async (req, res) => {
  try {
    let result = await scheduleService.createSchedule(req.body);
    return res.status(200).json(result);
  } catch (e) {
    console.error("createSchedule error:", e);
    return res.status(500).json({ errCode: -1, errMessage: "Server error" });
  }
};

let updateSchedule = async (req, res) => {
  try {
    let result = await scheduleService.updateSchedule({
      id: req.params.id,
      ...req.body,
    });
    return res.status(200).json(result);
  } catch (e) {
    console.error("updateSchedule error:", e);
    return res.status(500).json({ errCode: -1, errMessage: "Server error" });
  }
};

let deleteSchedule = async (req, res) => {
  try {
    let result = await scheduleService.deleteSchedule(req.params.id);
    return res.status(200).json(result);
  } catch (e) {
    console.error("deleteSchedule error:", e);
    return res.status(500).json({ errCode: -1, errMessage: "Server error" });
  }
};

let generateTrips = async (req, res) => {
  try {
    let result = await scheduleService.generateTripsFromSchedules();
    return res.status(200).json(result);
  } catch (e) {
    console.error("generateTrips error:", e);
    return res.status(500).json({ errCode: -1, errMessage: "Server error" });
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
