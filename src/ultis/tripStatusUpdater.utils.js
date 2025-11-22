// src/ultis/tripStatusUpdater.utils.js
import db from "../models/index.js";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration.js";

dayjs.extend(duration);

/**
 * Tự động chuyển trạng thái chuyến xe sang FULL
 * khi thời gian hiện tại vượt quá thời gian kết thúc chuyến
 */
export const updateFinishedTrips = async () => {
  try {
    const now = dayjs();

    // Lấy danh sách chuyến đang mở
    const openTrips = await db.CoachTrip.findAll({
      where: { status: "OPEN" },
      attributes: ["id", "startDate", "startTime", "totalTime"],
    });

    let updatedCount = 0;

    for (const trip of openTrips) {
      // Ghép ngày + giờ bắt đầu
      const startDateTime = dayjs(`${trip.startDate} ${trip.startTime}`);

      // Tránh lỗi khi totalTime null
      const [h, m, s] = (trip.totalTime || "00:00:00").split(":").map(Number);

      // Thời lượng chuyến
      const totalDuration = dayjs.duration({
        hours: h || 0,
        minutes: m || 0,
        seconds: s || 0,
      });

      // Thời điểm kết thúc chuyến
      const endTime = startDateTime.add(totalDuration.asMilliseconds(), "ms");

      // Nếu thời gian hiện tại đã vượt qua thời điểm kết thúc → cập nhật trạng thái
      if (now.isAfter(endTime)) {
        await db.CoachTrip.update(
          { status: "FULL" },
          { where: { id: trip.id } }
        );
        updatedCount++;
      }
    }

    // Log số lượng chuyến đã cập nhật
    if (updatedCount > 0) {
      console.log(`Đã cập nhật ${updatedCount} chuyến sang trạng thái FULL.`);
    }
  } catch (err) {
    // Log lỗi khi cron job chạy thất bại
    console.error("Lỗi khi cập nhật trạng thái chuyến:", err);
  }
};
