import * as momoService from "../../services/paymentManageService/momoService.js";

/**
 * Tạo yêu cầu thanh toán MoMo
 */
export const createMoMoPaymentController = async (req, res) => {
  try {
    const { bookingId, amount } = req.body;
    // Gọi service tạo yêu cầu thanh toán MoMo
    const result = await momoService.createMoMoPayment({ bookingId, amount });
    // Thành công
    if (result.resultCode === 0) {
      return res.json({
        errCode: 0,
        message: "Tạo thanh toán MoMo thành công",
        payUrl: result.payUrl,
        result,
      });
    }
    // Thất bại
    return res.status(400).json({
      errCode: 1,
      message: result.message || "Không thể tạo thanh toán MoMo",
      resultCode: result.resultCode,
    });
  } catch (error) {
    console.error("MoMoController - createMoMoPayment error:", error);
    return res.status(500).json({
      errCode: -1,
      message: "Lỗi hệ thống",
    });
  }
};

/**
 * Nhận callback IPN từ MoMo (khi thanh toán hoàn tất)
 */
export const handleMoMoIPNController = async (req, res) => {
  try {
    const response = await momoService.handleMoMoIPN(req.body);
    return res.json(response);
  } catch (error) {
    console.error("MoMoController - handleMoMoIPN error:", error);
    return res.status(500).json({
      resultCode: 99,
      message: "Lỗi hệ thống",
    });
  }
};
