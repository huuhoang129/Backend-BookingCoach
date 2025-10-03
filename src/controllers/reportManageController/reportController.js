import reportService from "../../services/reportManageServices/reportService";

let getRevenueReport = async (req, res) => {
  try {
    let result = await reportService.getRevenueReport();
    return res.status(200).json(result);
  } catch (e) {
    console.error("getRevenueReport error:", e);
    return res.status(500).json({ errCode: -1, errMessage: "Server error" });
  }
};

let getTicketSalesReport = async (req, res) => {
  try {
    let result = await reportService.getTicketSalesReport();
    return res.status(200).json(result);
  } catch (e) {
    console.error("getTicketSalesReport error:", e);
    return res.status(500).json({ errCode: -1, errMessage: "Server error" });
  }
};

let getCancellationRateReport = async (req, res) => {
  try {
    let result = await reportService.getCancellationRateReport();
    return res.status(200).json(result);
  } catch (e) {
    console.error("getCancellationRateReport error:", e);
    return res.status(500).json({ errCode: -1, errMessage: "Server error" });
  }
};

export default {
  getRevenueReport,
  getTicketSalesReport,
  getCancellationRateReport,
};
