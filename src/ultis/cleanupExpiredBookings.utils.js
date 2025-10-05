import db from "../models/index.js";
import { Op } from "sequelize";

/**
 * 🧹 Cron job: Tự động hủy booking hết hạn
 */
export const cleanupExpiredBookings = async () => {
  const now = new Date();

  try {
    const expiredBookings = await db.Bookings.findAll({
      where: {
        status: "PENDING",
        expiredAt: { [Op.lt]: now },
      },
    });

    if (expiredBookings.length === 0) return;

    for (const booking of expiredBookings) {
      await db.Bookings.update(
        { status: "EXPIRED" },
        { where: { id: booking.id } }
      );

      await Promise.all([
        db.BookingSeats.destroy({ where: { bookingId: booking.id } }),
        db.BookingCustomers.destroy({ where: { bookingId: booking.id } }),
        db.BookingPoints.destroy({ where: { bookingId: booking.id } }),
      ]);
    }
  } catch (err) {
    console.error("❌ [Cron] Lỗi khi dọn booking hết hạn:", err);
  }
};
