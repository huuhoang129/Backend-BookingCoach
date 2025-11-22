// src/controllers/paymentManageController/paymentController.js
import paymentService from "../../services/paymentManageService/paymentService";

// Tạo mã QR thanh toán qua Banking
const createBankingQR = async (req, res) => {
  try {
    const data = req.body;

    // Gọi service tạo mã QR
    const result = await paymentService.createBankingQR(data);

    return res.status(200).json(result);
  } catch (e) {
    // Lỗi khi tạo QR thanh toán
    console.error("Lỗi khi tạo mã QR thanh toán:", e);

    return res.status(500).json({
      errCode: -1,
      errMessage: "Lỗi hệ thống",
    });
  }
};

export default {
  createBankingQR,
};
