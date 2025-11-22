// src/controllers/bookingManageController/bookingPaymentController.js
import paymentService from "../../services/bookingManageServices/bookingPaymentService.js";

// Lấy tất cả các giao dịch thanh toán
const getAllPayments = async (req, res) => {
  try {
    const result = await paymentService.getAllPayments();
    return res.status(200).json(result);
  } catch (e) {
    console.error("Lỗi khi lấy danh sách thanh toán:", e);
    return res.status(500).json({
      errCode: -1,
      errMessage: "Lỗi hệ thống",
    });
  }
};

// Tạo giao dịch thanh toán mới
const createPayment = async (req, res) => {
  try {
    const result = await paymentService.createPayment(req.body);
    return res.status(200).json(result);
  } catch (e) {
    console.error("Lỗi khi tạo giao dịch thanh toán:", e);
    return res.status(500).json({
      errCode: -1,
      errMessage: "Lỗi hệ thống",
    });
  }
};

// Lấy thông tin thanh toán theo booking ID
const getPaymentByBooking = async (req, res) => {
  try {
    const bookingId = req.params.bookingId;
    const result = await paymentService.getPaymentByBooking(bookingId);
    return res.status(200).json(result);
  } catch (e) {
    console.error("Lỗi khi lấy thông tin thanh toán theo booking:", e);
    return res.status(500).json({
      errCode: -1,
      errMessage: "Lỗi hệ thống",
    });
  }
};

// Cập nhật trạng thái thanh toán
const updatePaymentStatus = async (req, res) => {
  try {
    const result = await paymentService.updatePaymentStatus(req.body);
    return res.status(200).json(result);
  } catch (e) {
    console.error("Lỗi khi cập nhật trạng thái thanh toán:", e);
    return res.status(500).json({
      errCode: -1,
      errMessage: "Lỗi hệ thống",
    });
  }
};

export default {
  getAllPayments,
  createPayment,
  getPaymentByBooking,
  updatePaymentStatus,
};
