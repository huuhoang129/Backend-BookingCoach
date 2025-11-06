import bookingPointService from "../../services/bookingManageServices/bookingPointService.js";

/**
 * Lấy danh sách điểm đón/trả
 */
const getPointsByBooking = async (req, res) => {
  try {
    const bookingId = req.params.bookingId;
    const result = await bookingPointService.getPointsByBooking(bookingId);
    return res.status(200).json(result);
  } catch (e) {
    console.error("BookingPointController - getPointsByBooking error:", e);
    return res.status(500).json({
      errCode: -1,
      errMessage: "Lỗi hệ thống",
    });
  }
};

/**
 * Thêm điểm đón/trả
 */
const addPoint = async (req, res) => {
  try {
    const data = req.body;
    const result = await bookingPointService.addPoint(data);
    return res.status(200).json(result);
  } catch (e) {
    console.error("BookingPointController - addPoint error:", e);
    return res.status(500).json({
      errCode: -1,
      errMessage: "Lỗi hệ thống",
    });
  }
};

/**
 * Cập nhật điểm đón/trả
 */
const updatePoint = async (req, res) => {
  try {
    const data = req.body;
    const result = await bookingPointService.updatePoint(data);
    return res.status(200).json(result);
  } catch (e) {
    console.error("BookingPointController - updatePoint error:", e);
    return res.status(500).json({
      errCode: -1,
      errMessage: "Lỗi hệ thống",
    });
  }
};

/**
 * Xóa điểm đón/trả
 */
const deletePoint = async (req, res) => {
  try {
    const id = req.params.id;
    const result = await bookingPointService.deletePoint(id);
    return res.status(200).json(result);
  } catch (e) {
    console.error("BookingPointController - deletePoint error:", e);
    return res.status(500).json({
      errCode: -1,
      errMessage: "Lỗi hệ thống",
    });
  }
};

export default {
  getPointsByBooking,
  addPoint,
  updatePoint,
  deletePoint,
};
