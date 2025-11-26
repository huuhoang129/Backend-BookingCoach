// src/controllers/paymentManageController/vnpayController.js
import {
  createVNPayPayment,
  handleVNPayReturn,
  handleVNPayIPN,
} from "../../services/paymentManageService/vnpayService.js";

// Tạo URL thanh toán VNPay
export const vnpayCreatePayment = async (req, res) => {
  try {
    const { bookingId, amount, bankCode } = req.body;

    // Lấy địa chỉ IP của client
    const ipAddr =
      req.headers["x-forwarded-for"] ||
      req.connection.remoteAddress ||
      req.socket.remoteAddress;
    const url = await createVNPayPayment({
      bookingId,
      amount,
      bankCode,
      ipAddr,
    });

    return res.json({ errCode: 0, paymentUrl: url });
  } catch (e) {
    // Lỗi tạo URL thanh toán
    console.error("Lỗi khi tạo URL thanh toán VNPay:", e);
    return res
      .status(500)
      .json({ errCode: 1, errMessage: "Không thể tạo giao dịch thanh toán" });
  }
};

// Xử lý khi user quay về từ VNPay
export const vnpayReturn = async (req, res) => {
  const result = await handleVNPayReturn({ ...req.query });

  // Redirect về frontend hiển thị trạng thái thanh toán
  return res.redirect(
    `http://localhost:5173/payment-result?code=${result.code}&bookingId=${result.bookingId}`
  );
};

// Xử lý IPN từ VNPay
export const vnpayIPN = async (req, res) => {
  const result = await handleVNPayIPN({ ...req.query });
  return res.status(200).json(result);
};
