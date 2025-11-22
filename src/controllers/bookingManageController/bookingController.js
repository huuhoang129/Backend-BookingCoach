// src/controllers/bookingManageController/bookingController.js
import bookingService from "../../services/bookingManageServices/bookingService";

// Lấy tất cả booking (có thể lọc theo userId)
const getAllBookings = async (req, res) => {
  try {
    const userId = req.query.userId || null;
    const result = await bookingService.getAllBookings(userId);
    return res.status(200).json(result);
  } catch (e) {
    console.error("Lỗi tại BookingController - getAllBookings:", e);
    return res.status(500).json({ errCode: 1, errMessage: "Lỗi hệ thống" });
  }
};

// Lấy booking theo ID
const getBookingById = async (req, res) => {
  try {
    const bookingId = req.params.id;
    const result = await bookingService.getBookingById(bookingId);
    return res.status(200).json(result);
  } catch (e) {
    console.error("Lỗi tại BookingController - getBookingById:", e);
    return res.status(500).json({ errCode: -1, errMessage: "Lỗi hệ thống" });
  }
};

// Tạo booking mới
const createBooking = async (req, res) => {
  try {
    const data = req.body;
    const result = await bookingService.createBooking(data);
    return res.status(200).json(result);
  } catch (e) {
    console.error("Lỗi tại BookingController - createBooking:", e);
    return res.status(500).json({ errCode: -1, errMessage: "Lỗi hệ thống" });
  }
};

// Cập nhật trạng thái booking
const updateBookingStatus = async (req, res) => {
  try {
    const { id, status } = req.body;
    const result = await bookingService.updateBookingStatus(id, status);
    return res.status(200).json(result);
  } catch (e) {
    console.error("Lỗi tại BookingController - updateBookingStatus:", e);
    return res.status(500).json({ errCode: -1, errMessage: "Lỗi hệ thống" });
  }
};

// Xóa booking
const deleteBooking = async (req, res) => {
  try {
    const bookingId = req.params.id;
    const result = await bookingService.deleteBooking(bookingId);
    return res.status(200).json(result);
  } catch (e) {
    console.error("Lỗi tại BookingController - deleteBooking:", e);
    return res.status(500).json({ errCode: -1, errMessage: "Lỗi hệ thống" });
  }
};

export default {
  getAllBookings,
  getBookingById,
  createBooking,
  updateBookingStatus,
  deleteBooking,
};
