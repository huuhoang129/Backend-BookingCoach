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
      const startDateTime = dayjs(`${trip.startDate} ${trip.startTime}`);
      const endTime = startDateTime.subtract(5, "minute");

      // Cập nhật trạng thái
      if (now.isAfter(endTime)) {
        await db.CoachTrip.update(
          { status: "FULL" },
          { where: { id: trip.id } }
        );
        updatedCount++;
      }
    }

    if (updatedCount > 0) {
      console.log(`Đã cập nhật ${updatedCount} chuyến sang trạng thái FULL.`);
    }
  } catch (err) {
    console.error("Lỗi khi cập nhật trạng thái chuyến:", err);
  }
};
