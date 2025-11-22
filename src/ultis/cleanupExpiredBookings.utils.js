// src/ultis/cleanupExpiredBookings.utils.js
import db from "../models/index.js";
import { Op } from "sequelize";

/**
 * Cron job: Tự động hủy các booking đã quá hạn thanh toán
 */
export const cleanupExpiredBookings = async () => {
  const now = new Date();

  try {
    // Lấy danh sách booking chờ thanh toán nhưng đã quá hạn
    const expiredBookings = await db.Bookings.findAll({
      where: {
        status: "PENDING",
        expiredAt: { [Op.lt]: now },
      },
    });

    // Không có booking nào quá hạn → dừng
    if (expiredBookings.length === 0) return;

    // Xử lý hủy từng booking quá hạn
    for (const booking of expiredBookings) {
      // Cập nhật trạng thái sang "EXPIRED"
      await db.Bookings.update(
        { status: "EXPIRED" },
        { where: { id: booking.id } }
      );

      // Xóa toàn bộ dữ liệu liên quan đến booking
      await Promise.all([
        db.BookingSeats.destroy({ where: { bookingId: booking.id } }),
        db.BookingCustomers.destroy({ where: { bookingId: booking.id } }),
        db.BookingPoints.destroy({ where: { bookingId: booking.id } }),
      ]);
    }
  } catch (err) {
    // Ghi log lỗi khi chạy cron job
    console.error("[Cron] Lỗi khi dọn dẹp booking hết hạn:", err);
  }
};
