import * as momoService from "../../services/paymentManageService/momoService.js";

export const createMoMoPaymentController = async (req, res) => {
  try {
    const { bookingId, amount } = req.body;
    const result = await momoService.createMoMoPayment({ bookingId, amount });

    if (result.resultCode === 0) {
      return res.json({
        errCode: 0,
        message: "Tạo thanh toán MoMo thành công",
        payUrl: result.payUrl,
        result,
      });
    } else {
      return res.status(400).json({
        errCode: 1,
        message: result.message,
        resultCode: result.resultCode,
      });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      errCode: 99,
      message: "Lỗi hệ thống",
    });
  }
};

// ✅ IPN callback (khi MoMo gọi về)
export const handleMoMoIPNController = async (req, res) => {
  try {
    const response = await momoService.handleMoMoIPN(req.body);
    return res.json(response);
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ resultCode: 99, message: "Internal Server Error" });
  }
};
