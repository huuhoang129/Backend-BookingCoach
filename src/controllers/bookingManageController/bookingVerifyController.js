import bookingVerifyService from "../../services/bookingManageServices/bookingVerifyService.js";

// Xác minh booking bằng mã booking
let verifyBooking = async (req, res) => {
  try {
    const { bookingCode } = req.query;

    // Thiếu mã booking
    if (!bookingCode) {
      return res.status(200).json({
        errCode: 1,
        errMessage: "Thiếu mã booking",
        data: null,
      });
    }
    const result = await bookingVerifyService.verifyBookingByCode(bookingCode);

    return res.status(200).json(result);
  } catch (e) {
    console.error("Lỗi khi xác minh booking:", e);
    return res.status(500).json({
      errCode: -1,
      errMessage: "Lỗi hệ thống",
      data: null,
    });
  }
};

export default { verifyBooking };
