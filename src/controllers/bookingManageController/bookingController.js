import bookingService from "../../services/bookingManageServices/bookingService";

/**
 * Lấy danh sách booking
 */
const getAllBookings = async (req, res) => {
  try {
    const userId = req.query.userId || null;
    const result = await bookingService.getAllBookings(userId);
    return res.status(200).json(result);
  } catch (e) {
    console.error("BookingController - getAllBookings error:", e);
    return res.status(500).json({ errCode: 1, errMessage: "Lỗi hệ thống" });
  }
};

/**
 * Lấy chi tiết booking
 */
const getBookingById = async (req, res) => {
  try {
    const bookingId = req.params.id;
    const result = await bookingService.getBookingById(bookingId);
    return res.status(200).json(result);
  } catch (e) {
    console.error("BookingController - getBookingById error:", e);
    return res.status(500).json({ errCode: -1, errMessage: "Lỗi hệ thống" });
  }
};

/**
 * Tạo booking mới
 */
const createBooking = async (req, res) => {
  try {
    const data = req.body;
    const result = await bookingService.createBooking(data);
    return res.status(200).json(result);
  } catch (e) {
    console.error("BookingController - createBooking error:", e);
    return res.status(500).json({ errCode: -1, errMessage: "Lỗi hệ thống" });
  }
};

/**
 * Cập nhật trạng thái booking
 */
const updateBookingStatus = async (req, res) => {
  try {
    const { bookingId, status } = req.body;
    const result = await bookingService.updateBookingStatus(bookingId, status);
    return res.status(200).json(result);
  } catch (e) {
    console.error("BookingController - updateBookingStatus error:", e);
    return res.status(500).json({ errCode: -1, errMessage: "Lỗi hệ thống" });
  }
};

/**
 * Xóa booking theo ID
 */
const deleteBooking = async (req, res) => {
  try {
    const bookingId = req.params.id;
    const result = await bookingService.deleteBooking(bookingId);
    return res.status(200).json(result);
  } catch (e) {
    console.error("BookingController - deleteBooking error:", e);
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
