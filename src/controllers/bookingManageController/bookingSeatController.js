// src/controllers/bookingSeatController.js
import bookingSeatService from "../../services/bookingManageServices/bookingSeatService.js";

// Lấy danh sách ghế theo booking ID
const getSeatsByBooking = async (req, res) => {
  try {
    const bookingId = req.params.bookingId;
    const result = await bookingSeatService.getSeatsByBooking(bookingId);
    return res.status(200).json(result);
  } catch (e) {
    console.error("BookingSeatController - getSeatsByBooking error:", e);
    return res.status(500).json({
      errCode: -1,
      errMessage: "Lỗi hệ thống",
    });
  }
};

// Thêm ghế vào booking
const addSeat = async (req, res) => {
  try {
    const data = req.body;
    const result = await bookingSeatService.addSeat(data);
    return res.status(200).json(result);
  } catch (e) {
    console.error("BookingSeatController - addSeat error:", e);
    return res.status(500).json({
      errCode: -1,
      errMessage: "Lỗi hệ thống",
    });
  }
};

// Cập nhật thông tin ghế
const updateSeat = async (req, res) => {
  try {
    const data = req.body;
    const result = await bookingSeatService.updateSeat(data);
    return res.status(200).json(result);
  } catch (e) {
    console.error("BookingSeatController - updateSeat error:", e);
    return res.status(500).json({
      errCode: -1,
      errMessage: "Lỗi hệ thống",
    });
  }
};

// Xóa ghế khỏi booking
const deleteSeat = async (req, res) => {
  try {
    const id = req.params.id;
    const result = await bookingSeatService.deleteSeat(id);
    return res.status(200).json(result);
  } catch (e) {
    console.error("BookingSeatController - deleteSeat error:", e);
    return res.status(500).json({
      errCode: -1,
      errMessage: "Lỗi hệ thống",
    });
  }
};

export default {
  getSeatsByBooking,
  addSeat,
  updateSeat,
  deleteSeat,
};
