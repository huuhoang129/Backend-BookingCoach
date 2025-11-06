import bookingNotificationService from "../../services/bookingManageServices/bookingNotificationService.js";

/**
 * Lấy danh sách booking mới sau thời điểm `since`
 */
const getNewBookings = async (req, res) => {
  try {
    const since = req.query.since;
    const data = await bookingNotificationService.getNewBookingsService(since);
    return res.status(200).json({ errCode: 0, data });
  } catch (e) {
    console.error("BookingNotificationController - getNewBookings error:", e);
    return res.status(500).json({
      errCode: 1,
      errMessage: "Lỗi hệ thống",
    });
  }
};

export default { getNewBookings };
