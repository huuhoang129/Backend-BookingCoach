// src/services/vehicleManageServices/driverScheduleServices.js
import db from "../../models/index.js";
import dayjs from "dayjs";

// Lấy tất cả tài xế
let getAllDrivers = async () => {
  try {
    const drivers = await db.User.findAll({
      where: { role: "Driver" },
      attributes: ["id", "firstName", "lastName", "phoneNumber", "email"],
      order: [["firstName", "ASC"]],
    });

    return {
      errCode: 0,
      errMessage: "Lấy danh sách tài xế thành công",
      data: drivers,
    };
  } catch (e) {
    throw e;
  }
};

// Lấy toàn bộ lịch tài xế
let getAllDriverSchedules = async () => {
  try {
    const schedules = await db.DriverSchedule.findAll({
      include: [
        {
          model: db.User,
          as: "driver",
          attributes: ["id", "firstName", "lastName", "phoneNumber", "email"],
        },
        {
          model: db.CoachTrip,
          as: "trip",
          include: [
            {
              model: db.CoachRoute,
              as: "route",
              attributes: { exclude: ["imageRouteCoach"] },
              include: [
                {
                  model: db.Location,
                  as: "fromLocation",
                  include: [{ model: db.Province, as: "province" }],
                },
                {
                  model: db.Location,
                  as: "toLocation",
                  include: [{ model: db.Province, as: "province" }],
                },
              ],
            },
            {
              model: db.Vehicle,
              as: "vehicle",
              attributes: ["id", "name", "licensePlate"],
            },
          ],
        },
      ],
      order: [["createdAt", "DESC"]],
      raw: false,
      nest: true,
    });

    return {
      errCode: 0,
      errMessage: "Lấy danh sách lịch tài xế thành công",
      data: schedules,
    };
  } catch (e) {
    throw e;
  }
};

// Lịch tài xế
let getDriverSchedulesByUser = async (userId) => {
  try {
    if (!userId) return { errCode: 1, errMessage: "Thiếu tham số: userId" };

    const schedules = await db.DriverSchedule.findAll({
      where: { userId },
      include: [
        {
          model: db.User,
          as: "driver",
          attributes: ["id", "firstName", "lastName", "phoneNumber", "email"],
        },
        {
          model: db.CoachTrip,
          as: "trip",
          include: [
            {
              model: db.CoachRoute,
              as: "route",
              attributes: { exclude: ["imageRouteCoach"] },
              include: [
                {
                  model: db.Location,
                  as: "fromLocation",
                  include: [{ model: db.Province, as: "province" }],
                },
                {
                  model: db.Location,
                  as: "toLocation",
                  include: [{ model: db.Province, as: "province" }],
                },
              ],
            },
            {
              model: db.Vehicle,
              as: "vehicle",
              attributes: ["id", "name", "licensePlate"],
            },
          ],
        },
      ],
      order: [["createdAt", "DESC"]],
      raw: false,
      nest: true,
    });

    return {
      errCode: 0,
      errMessage: "Lấy lịch tài xế theo người dùng thành công",
      data: schedules,
    };
  } catch (e) {
    console.error("[getDriverSchedulesByUser] error:", e);
    throw e;
  }
};

// Lịch tài xế theo id
let getDriverScheduleById = async (id) => {
  try {
    if (!id) return { errCode: 1, errMessage: "Thiếu tham số: id" };

    const schedule = await db.DriverSchedule.findOne({
      where: { id },
      include: [
        {
          model: db.User,
          as: "driver",
          attributes: ["id", "firstName", "lastName", "phoneNumber", "email"],
        },
        {
          model: db.CoachTrip,
          as: "trip",
          include: [
            {
              model: db.CoachRoute,
              as: "route",
              attributes: { exclude: ["imageRouteCoach"] },
            },
            {
              model: db.Vehicle,
              as: "vehicle",
              attributes: ["id", "name", "licensePlate"],
            },
          ],
        },
      ],
      raw: false,
      nest: true,
    });

    if (!schedule)
      return { errCode: 2, errMessage: "Không tìm thấy lịch tài xế" };

    return {
      errCode: 0,
      errMessage: "Lấy lịch tài xế thành công",
      data: schedule,
    };
  } catch (e) {
    throw e;
  }
};

// Tính tổng thời gian
const getDurationMinutes = (timeStr) => {
  if (!timeStr) return 0;
  const [h, m, s] = timeStr.split(":").map(Number);
  return h * 60 + m + (s ? s / 60 : 0);
};

// Tạo lịch tài xế
let createDriverSchedule = async (data) => {
  try {
    const { userId, coachTripId, note } = data;

    if (!userId || !coachTripId)
      return {
        errCode: 1,
        errMessage: "Thiếu tham số bắt buộc (userId, coachTripId)",
      };

    const trip = await db.CoachTrip.findOne({ where: { id: coachTripId } });
    if (!trip) return { errCode: 2, errMessage: "Không tìm thấy chuyến xe" };

    const sameDaySchedules = await db.DriverSchedule.findAll({
      where: { userId },
      include: [
        {
          model: db.CoachTrip,
          as: "trip",
          where: { startDate: trip.startDate },
        },
      ],
      nest: true,
      raw: false,
    });

    const tripStart = dayjs(`${trip.startDate} ${trip.startTime}`);
    const tripEnd = tripStart.add(getDurationMinutes(trip.totalTime), "minute");

    for (const s of sameDaySchedules) {
      const t = s.trip;
      if (!t) continue;

      const existingStart = dayjs(`${t.startDate} ${t.startTime}`);
      const existingEnd = existingStart.add(
        getDurationMinutes(t.totalTime),
        "minute"
      );

      const existingStartWithBuffer = existingStart.subtract(60, "minute");
      const existingEndWithBuffer = existingEnd.add(60, "minute");

      const overlap =
        tripStart.isBefore(existingEndWithBuffer) &&
        tripEnd.isAfter(existingStartWithBuffer);

      if (overlap) {
        return {
          errCode: 3,
          errMessage: `Tài xế đã có chuyến từ ${existingStart.format(
            "HH:mm"
          )} đến ${existingEnd.format("HH:mm")} ngày ${
            t.startDate
          }. Cần nghỉ ít nhất 1 giờ giữa các chuyến.`,
        };
      }
    }

    await db.DriverSchedule.create({
      userId,
      coachTripId,
      note: note || null,
    });

    return { errCode: 0, errMessage: "Tạo lịch tài xế thành công" };
  } catch (e) {
    console.error("createDriverSchedule error:", e);
    throw e;
  }
};

// Cập nhật lịch tài xế
let updateDriverSchedule = async (data) => {
  try {
    if (!data.id) return { errCode: 1, errMessage: "Thiếu tham số: id" };

    const [updated] = await db.DriverSchedule.update(
      {
        userId: data.userId,
        coachTripId: data.coachTripId,
        note: data.note,
      },
      { where: { id: data.id } }
    );

    if (!updated)
      return { errCode: 2, errMessage: "Không tìm thấy lịch tài xế" };

    return { errCode: 0, errMessage: "Cập nhật lịch tài xế thành công" };
  } catch (e) {
    throw e;
  }
};

// Xóa lịch tài xế
let deleteDriverSchedule = async (id) => {
  try {
    const schedule = await db.DriverSchedule.findByPk(id);
    if (!schedule)
      return { errCode: 2, errMessage: "Không tìm thấy lịch tài xế" };

    await db.DriverSchedule.destroy({ where: { id } });

    return { errCode: 0, errMessage: "Xóa lịch tài xế thành công" };
  } catch (e) {
    throw e;
  }
};

export default {
  getAllDrivers,
  getAllDriverSchedules,
  getDriverScheduleById,
  createDriverSchedule,
  updateDriverSchedule,
  deleteDriverSchedule,
  getDriverSchedulesByUser,
};
