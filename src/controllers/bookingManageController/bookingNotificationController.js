// src/controllers/bookingManageController/bookingNotificationController.js
import bookingNotificationService from "../../services/bookingManageServices/bookingNotificationService.js";

// Lấy danh sách booking mới từ thời điểm nhất định
const getNewBookings = async (req, res) => {
  try {
    const since = req.query.since;

    // Gọi service lấy booking mới
    const data = await bookingNotificationService.getNewBookingsService(since);
    return res.status(200).json({
      errCode: 0,
      data,
    });
  } catch (e) {
    console.error("Lỗi khi lấy danh sách booking mới:", e);
    return res.status(500).json({
      errCode: 1,
      errMessage: "Lỗi hệ thống",
    });
  }
};

const getCancellationBookings = async (req, res) => {
  try {
    const since = req.query.since || null;
    const data = await bookingNotificationService.getNewRefundsService(since);
    return res.status(200).json({
      errCode: 0,
      errMessage: "OK",
      data,
    });
  } catch (e) {
    console.error("getNewRefunds error:", e);
    return res.status(500).json({
      errCode: -1,
      errMessage: "Server error",
      data: [],
    });
  }
};

export default { getNewBookings, getCancellationBookings };
