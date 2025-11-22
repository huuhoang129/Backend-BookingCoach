// src/controllers/reportManageController/reportController.js
import reportService from "../../services/reportManageServices/reportService";

// Báo cáo doanh thu
let getRevenueReport = async (req, res) => {
  try {
    const { from, to, groupBy } = req.query;
    const result = await reportService.getRevenueReport(from, to, groupBy);

    return res.status(200).json(result);
  } catch (error) {
    // Lỗi xử lý báo cáo
    console.error("Lỗi khi lấy báo cáo doanh thu:", error);
    return res.status(500).json({
      errCode: 500,
      errMessage: "Lỗi hệ thống",
      data: [],
    });
  }
};

// Báo cáo lượt bán vé
let getTicketSalesReport = async (req, res) => {
  try {
    const { from, to, groupBy } = req.query;

    // Gọi service lấy báo cáo bán vé
    const result = await reportService.getTicketSalesReport(from, to, groupBy);

    return res.status(200).json(result);
  } catch (error) {
    // Lỗi xử lý báo cáo
    console.error("Lỗi khi lấy báo cáo bán vé:", error);
    return res.status(500).json({
      errCode: 500,
      errMessage: "Lỗi hệ thống",
      data: [],
    });
  }
};

// Báo cáo tỉ lệ hủy vé
let getCancellationRateReport = async (req, res) => {
  try {
    const { from, to, groupBy } = req.query;
    const result = await reportService.getCancellationRateReport(
      from,
      to,
      groupBy
    );

    return res.status(200).json(result);
  } catch (error) {
    // Lỗi xử lý báo cáo
    console.error("Lỗi khi lấy báo cáo tỉ lệ hủy:", error);
    return res.status(500).json({
      errCode: 500,
      errMessage: "Lỗi hệ thống",
      data: [],
    });
  }
};

export default {
  getRevenueReport,
  getTicketSalesReport,
  getCancellationRateReport,
};
