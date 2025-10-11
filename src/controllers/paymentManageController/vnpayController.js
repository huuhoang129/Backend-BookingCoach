import {
  createVNPayPayment,
  handleVNPayReturn,
  handleVNPayIPN,
} from "../../services/paymentManageService/vnpayService.js";

// Tạo URL thanh toán
export const vnpayCreatePayment = async (req, res) => {
  try {
    const { bookingId, amount, bankCode } = req.body;
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
    console.error(e);
    return res
      .status(500)
      .json({ errCode: 1, errMessage: "Create payment failed" });
  }
};

// User quay về từ VNPAY
export const vnpayReturn = async (req, res) => {
  const result = await handleVNPayReturn({ ...req.query });
  return res.redirect(
    `http://localhost:5173/payment-result?code=${result.code}`
  );
};

// IPN callback
export const vnpayIPN = async (req, res) => {
  const result = await handleVNPayIPN({ ...req.query });
  return res.status(200).json(result);
};
