import paymentService from "../../services/bookingManageServices/bookingPaymentService.js";

/**
 * Lấy danh sách thanh toán
 */
const getAllPayments = async (req, res) => {
  try {
    const result = await paymentService.getAllPayments();
    return res.status(200).json(result);
  } catch (e) {
    console.error("PaymentController - getAllPayments error:", e);
    return res.status(500).json({
      errCode: -1,
      errMessage: "Lỗi hệ thống",
    });
  }
};

/**
 * Tạo giao dịch thanh toán mới
 */
const createPayment = async (req, res) => {
  try {
    const result = await paymentService.createPayment(req.body);
    return res.status(200).json(result);
  } catch (e) {
    console.error("PaymentController - createPayment error:", e);
    return res.status(500).json({
      errCode: -1,
      errMessage: "Lỗi hệ thống",
    });
  }
};

/**
 * Lấy thông tin thanh toán
 */
const getPaymentByBooking = async (req, res) => {
  try {
    const bookingId = req.params.bookingId;
    const result = await paymentService.getPaymentByBooking(bookingId);
    return res.status(200).json(result);
  } catch (e) {
    console.error("PaymentController - getPaymentByBooking error:", e);
    return res.status(500).json({
      errCode: -1,
      errMessage: "Lỗi hệ thống",
    });
  }
};

/**
 * Cập nhật trạng thái thanh toán
 */
const updatePaymentStatus = async (req, res) => {
  try {
    const result = await paymentService.updatePaymentStatus(req.body);
    return res.status(200).json(result);
  } catch (e) {
    console.error("PaymentController - updatePaymentStatus error:", e);
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
