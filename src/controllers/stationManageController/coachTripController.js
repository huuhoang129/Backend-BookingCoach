// src/controllers/stationManageController/coachTripController.js
import coachTripServices from "../../services/stationManageServices/coachTripServices";

// Lấy tất cả chuyến xe
let getAllTrips = async (req, res) => {
  try {
    const result = await coachTripServices.getAllTrips();
    return res.status(200).json(result);
  } catch (e) {
    console.error("Lỗi khi lấy danh sách chuyến xe:", e);
    return res.status(500).json({
      errCode: -1,
      errMessage: "Lỗi hệ thống",
    });
  }
};

// Lấy thông tin chuyến xe theo ID
let getTripById = async (req, res) => {
  try {
    const tripId = req.params.id;
    const result = await coachTripServices.getTripById(tripId);
    return res.status(200).json(result);
  } catch (e) {
    console.error("Lỗi khi lấy thông tin chuyến xe theo ID:", e);
    return res.status(500).json({
      errCode: -1,
      errMessage: "Lỗi hệ thống",
    });
  }
};

// Tạo mới chuyến xe
let createTrip = async (req, res) => {
  try {
    const data = req.body;
    const result = await coachTripServices.createTrip(data);
    return res.status(200).json(result);
  } catch (e) {
    console.error("Lỗi khi tạo mới chuyến xe:", e);
    return res.status(500).json({
      errCode: -1,
      errMessage: "Lỗi hệ thống",
    });
  }
};

// Cập nhật chuyến xe
let updateTrip = async (req, res) => {
  try {
    const id = req.params.id;
    const data = req.body;
    const result = await coachTripServices.updateTrip(id, data);
    return res.status(200).json(result);
  } catch (e) {
    console.error("Lỗi khi cập nhật chuyến xe:", e);
    return res.status(500).json({
      errCode: -1,
      errMessage: "Lỗi hệ thống",
    });
  }
};

// Xóa chuyến xe
let deleteTrip = async (req, res) => {
  try {
    const tripId = req.params.id;
    const result = await coachTripServices.deleteTrip(tripId);
    return res.status(200).json(result);
  } catch (e) {
    console.error("Lỗi khi xóa chuyến xe:", e);
    return res.status(500).json({
      errCode: -1,
      errMessage: "Lỗi hệ thống",
    });
  }
};

// Tìm kiếm chuyến xe theo địa điểm và ngày tháng
let searchTrips = async (req, res) => {
  try {
    const { fromLocationId, toLocationId, startDate, endDate } = req.query;

    const result = await coachTripServices.findTripsByRouteAndDate(
      Number(fromLocationId),
      Number(toLocationId),
      startDate,
      endDate
    );

    return res.status(200).json(result);
  } catch (e) {
    console.error("Lỗi khi tìm kiếm chuyến xe:", e);
    return res.status(500).json({
      errCode: -1,
      errMessage: "Lỗi hệ thống",
    });
  }
};

export default {
  getAllTrips,
  getTripById,
  createTrip,
  updateTrip,
  deleteTrip,
  searchTrips,
};
