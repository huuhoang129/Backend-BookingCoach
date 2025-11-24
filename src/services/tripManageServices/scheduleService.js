import db from "../../models/index.js";
import dayjs from "dayjs";

// Lấy danh sách tất cả lịch chạy
let getAllSchedules = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const schedules = await db.CoachSchedule.findAll({
        include: [
          {
            model: db.CoachRoute,
            as: "route",
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
          { model: db.Vehicle, as: "vehicle" },
          { model: db.TripPrices, as: "price" },
        ],
        order: [["id", "ASC"]],
        raw: false,
        nest: true,
      });

      resolve({
        errCode: 0,
        errMessage: "Lấy danh sách lịch chạy thành công",
        data: schedules,
      });
    } catch (e) {
      reject(e);
    }
  });
};

// Lấy chi tiết lịch chạy theo ID
let getScheduleById = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!id) {
        return resolve({
          errCode: 1,
          errMessage: "Thiếu tham số id",
        });
      }

      const schedule = await db.CoachSchedule.findOne({
        where: { id },
        include: [
          { model: db.CoachRoute, as: "route" },
          { model: db.Vehicle, as: "vehicle" },
          { model: db.TripPrices, as: "price" },
        ],
        raw: false,
        nest: true,
      });

      if (!schedule) {
        return resolve({
          errCode: 2,
          errMessage: "Không tìm thấy lịch chạy",
        });
      }

      resolve({
        errCode: 0,
        errMessage: "Lấy thông tin lịch chạy thành công",
        data: schedule,
      });
    } catch (e) {
      reject(e);
    }
  });
};

// Tạo mới lịch chạy
let createSchedule = async (data) => {
  try {
    const {
      coachRouteId,
      vehicleId,
      tripPriceId,
      startTime,
      totalTime,
      status,
    } = data;

    // Kiểm tra tham số bắt buộc
    if (!coachRouteId || !vehicleId || !tripPriceId || !startTime) {
      return {
        errCode: 1,
        errMessage: "Thiếu các tham số bắt buộc",
      };
    }

    // Kiểm tra trùng lịch cho cùng xe, tuyến, thời gian
    const existingSchedule = await db.CoachSchedule.findOne({
      where: {
        coachRouteId,
        vehicleId,
        startTime,
      },
    });

    if (existingSchedule) {
      return {
        errCode: 2,
        errMessage: `Xe ${vehicleId} đã có lịch chạy tuyến này vào ${startTime}.`,
      };
    }

    await db.CoachSchedule.create({
      coachRouteId,
      vehicleId,
      tripPriceId,
      startTime,
      totalTime: totalTime || null,
      status: status || "ACTIVE",
    });

    return {
      errCode: 0,
      errMessage: "Tạo lịch chạy thành công",
    };
  } catch (e) {
    console.error("Lỗi khi tạo lịch chạy:", e);
    throw e;
  }
};

// Cập nhật lịch chạy
let updateSchedule = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!data.id) {
        return resolve({
          errCode: 1,
          errMessage: "Thiếu tham số id",
        });
      }

      const schedule = await db.CoachSchedule.findOne({
        where: { id: data.id },
      });

      if (!schedule) {
        return resolve({
          errCode: 2,
          errMessage: "Không tìm thấy lịch chạy",
        });
      }

      await db.CoachSchedule.update(
        {
          coachRouteId: data.coachRouteId,
          vehicleId: data.vehicleId,
          tripPriceId: data.tripPriceId,
          startTime: data.startTime,
          totalTime: data.totalTime,
          status: data.status,
        },
        { where: { id: data.id } }
      );

      resolve({
        errCode: 0,
        errMessage: "Cập nhật lịch chạy thành công",
      });
    } catch (e) {
      reject(e);
    }
  });
};

// Xóa lịch chạy
let deleteSchedule = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const schedule = await db.CoachSchedule.findOne({ where: { id } });

      if (!schedule) {
        return resolve({
          errCode: 2,
          errMessage: "Không tìm thấy lịch chạy",
        });
      }

      await db.CoachSchedule.destroy({ where: { id } });

      resolve({
        errCode: 0,
        errMessage: "Xóa lịch chạy thành công",
      });
    } catch (e) {
      reject(e);
    }
  });
};

// Sinh các chuyến xe CoachTrip từ lịch chạy (trong 7 ngày tới)
let generateTripsFromSchedules = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const schedules = await db.CoachSchedule.findAll({
        where: { status: "ACTIVE" },
      });

      for (let s of schedules) {
        for (let i = 1; i <= 7; i++) {
          const date = dayjs().add(i, "day").format("YYYY-MM-DD");

          // Kiểm tra xem chuyến đã tồn tại chưa
          const exist = await db.CoachTrip.findOne({
            where: {
              coachRouteId: s.coachRouteId,
              vehicleId: s.vehicleId,
              startDate: date,
              startTime: s.startTime,
            },
          });
          if (exist) continue;

          // Tạo chuyến xe mới
          await db.CoachTrip.create({
            coachRouteId: s.coachRouteId,
            vehicleId: s.vehicleId,
            tripPriceId: s.tripPriceId,
            startDate: date,
            startTime: s.startTime,
            totalTime: s.totalTime,
            status: "OPEN",
          });
        }
      }

      resolve({
        errCode: 0,
        errMessage: "Sinh chuyến xe từ lịch chạy thành công",
      });
    } catch (e) {
      reject(e);
    }
  });
};

export default {
  getAllSchedules,
  getScheduleById,
  createSchedule,
  updateSchedule,
  deleteSchedule,
  generateTripsFromSchedules,
};
