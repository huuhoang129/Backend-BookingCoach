import paymentService from "../../services/paymentManageService/paymentService";

let createBankingQR = async (req, res) => {
  try {
    let data = req.body;
    let result = await paymentService.createBankingQR(data);
    return res.status(200).json(result);
  } catch (e) {
    console.error("createBankingQR error:", e);
    return res.status(500).json({
      errCode: -1,
      errMessage: "Error from server",
    });
  }
};

export default {
  createBankingQR,
};
